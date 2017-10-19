import * as config from './config';
import {
    Matching
} from '@andes/match';
import * as debug from 'debug';

let mongoClient = require('mongodb').MongoClient;
let winston = require('winston');
let urlAndes = config.urlMongoAndes;
let urlMpi = config.urlMongoMpi;
let colPacientes = 'paciente';
let colPacientesHC = 'pacienteSipsHC';
let colOrganizacion = 'organizacion';
let arrayPromesas = [];
let carpetaNueva;

let logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)(),
        new(winston.transports.File)({
            filename: 'insertHC.log'
        })
    ]
});


function matchPacientes(pacienteApp, pacienteVinculado) {
    return new Promise((resolve, reject) => {
        let match = new Matching();
        let pacApp = {
            apellido: pacienteApp.apellido,
            nombre: pacienteApp.nombre,
            sexo: pacienteApp.sexo.toUpperCase(),
            fechaNacimiento: pacienteApp.fechaNacimiento,
            documento: pacienteApp.documento
        };
        let pac = {
            apellido: pacienteVinculado.apellido,
            nombre: pacienteVinculado.nombre,
            sexo: pacienteVinculado.sexo.toUpperCase(),
            fechaNacimiento: pacienteVinculado.fechaNacimiento,
            documento: pacienteVinculado.documento
        }
        let valorMatching = match.matchPersonas(pacApp, pac, config.weights, 'Levenshtein');
        if (valorMatching >= 0.95) {
            resolve(valorMatching);
        } else {
            resolve(valorMatching);
        }

    })

}

function getOrganizaciones(dbconnection, filter) {
    return new Promise((resolve, reject) => {
        let condicion = {
            nombre: {
                $regex: filter
            }
        }
        dbconnection.collection('organizacion').find(condicion).toArray(function (errores, orgs) {

            if (errores) {
                logger.info('Error al intentar recuparar las organizaciones');
                reject(errores);
            } else {

                if (orgs.length > 0) {
                    resolve(orgs[0]);
                } else {
                    resolve(null)
                }
            }

        })
    })
}


// Todos los pacientes
let condition = {};

mongoClient.connect(urlMpi, function (err2, db2) {
    mongoClient.connect(urlAndes, function (err, db) {
        db.collection(colPacientesHC).find(condition).toArray(function (error, pacientesHC: any) {
            if (error) {
                logger.info('Error al conectarse a la base de datos ', error);
            }
            if (pacientesHC.length > 0) {
                pacientesHC.forEach(pacHC => {
                    let p = new Promise(async(resolve, reject) => {
                        if (pacHC && pacHC.documento) {
                            let cond = {
                                documento: pacHC.documento
                            };
                            db2.collection(colPacientes).find(cond).toArray(async function (err, pacientesResultado) {
                                if (pacientesResultado.length > 0) {
                                    pacientesResultado.forEach(async pacienteAndes => {
                                        let data = Object.assign({}, pacienteAndes);
                                        // Verifico el matcheo de pacientes
                                        let matcheo = await matchPacientes(pacHC, pacienteAndes);
                                        if (matcheo >= 0.85) {
                                            // console.log('Matcheo Alto ok');
                                            let str = pacHC.carpetaEfectores.efector;
                                            let prefijo = str.substr(0, 4);
                                            let filter = '';
                                            switch (prefijo) {
                                                case 'C.S.':
                                                    filter = 'CENTRO DE SALUD';
                                                    break;
                                                case 'P.S.':
                                                    filter = 'PUESTO SANITARIO';
                                                    break;
                                                case 'J.Z.':
                                                    filter = 'JEFATURA ZONA'; // ¿Corresponde como efector?
                                                    break
                                                case 'SUBS':
                                                    filter = 'XXXX'; // Por el momento lo elimino para importar la HC
                                                    break
                                                default: // Este es el caso default donde el string es HOSPITAL
                                                    filter = str;
                                                    break
                                            }

                                            if (filter !== 'HOSPITAL') {
                                                filter = filter + str.substr(4, str.length);
                                            }

                                            let org: any = await getOrganizaciones(db, filter);
                                            if (org) {
                                                carpetaNueva = {
                                                    organizacion: {
                                                        nombre: org.nombre,
                                                        _id: org._id
                                                    },
                                                    nroCarpeta: pacHC.carpetaEfectores.historiaClinica
                                                }

                                                let noEncontrado = true;
                                                let i = 0;

                                                while (noEncontrado && i < pacienteAndes.carpetaEfectores.length) {
                                                    let carpeta = Object.assign({}, pacienteAndes.carpetaEfectores[i]);
                                                    
                                                    if (carpeta.organizacion.nombre === carpetaNueva.organizacion.nombre && 
                                                        carpeta.nroCarpeta === carpetaNueva.nroCarpeta) {

                                                        noEncontrado = false;
                                                    } else {
                                                        i++;
                                                    }
                                                }

                                                if (noEncontrado) {
                                                    logger.info('Paciente que se va a actualizar: ', pacienteAndes);
                                                    pacienteAndes.carpetaEfectores.push(carpetaNueva);
                                                    // Actualizamos las carpetas HC del paciente
                                                    
                                                    db2.collection(colPacientes).findOneAndUpdate(
                                                        {
                                                            '_id' : pacienteAndes._id
                                                        },
                                                        { $set: 
                                                            { 'carpetaEfectores': pacienteAndes.carpetaEfectores }
                                                        }, function(err, result) {
                                                            if (err) {
                                                                logger.info('Error en la actualización', err);
                                                            } else {
                                                                logger.info('Se actualizo el paciente: ', pacienteAndes);
                                                            }
                                                        }
                                                    )
                                                    
                                                }
                                            }
                                            resolve();
                                        } else {
                                            resolve()
                                        }
                                         });
                                    
                                } else {
                                    resolve();
                                }
                            })

                        } else {
                            console.log('No existen pacientes con esa condición');
                            reject();
                        }
                    });
                    arrayPromesas.push(p);
                });

                Promise.all(arrayPromesas).then(resultado => {
                    console.log('Fin del procesamiento de actualización');
                    db.close();
                    db2.close();

                })

            }
        })
    })
})