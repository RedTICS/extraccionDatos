
import * as utils from '../utils';
import * as config from '../../config';
import * as mongodb from 'mongodb';


var db;
var organizacion;

function abrirConexion(url) {
    return mongodb.MongoClient.connect(url);
}

function find(coleccion, condicion) {
    return db.collection(coleccion).find(condicion).toArray();
}

function update(coleccion, condicion, camposupdate) {
    return db.collection(coleccion).findOneAndUpdate(condicion, camposupdate);
}

function insert(coleccion, documento) {
    return db.collection(coleccion).insertOne(documento);
}

const inserPuco = (paciente) => {

    return insert('puco',
        paciente);

}

const findUpdateCarpeta = (paciente) => {
    let documentoPaciente = paciente['numeroDocumento'];
    let condicion = { documento: documentoPaciente };
    let carpetaNueva = {
        organizacion: {
            _id: organizacion._id,
            nombre: organizacion.nombre
        },
        idPaciente: paciente['idPaciente'],
        nroCarpeta: paciente['historiaClinica']
    }
    // buscamos en carpetaPaciente los pacientes con documentoPaciente
    return find('carpetaPaciente', condicion)
        .then(lista => {
            let carpetaPaciente;
            if (lista && lista.length) {
                carpetaPaciente = lista[0];
                let carpetas = carpetaPaciente.carpetaEfectores.filter(c => c.organizacion._id === organizacion._id);
                if (carpetas && carpetas.length) {
                    carpetaPaciente.carpetaEfectores.map(c => {
                        if (c.organizacion._id === organizacion._id)
                            return c.nroCarpeta = paciente['historiaClinica']
                    });
                } else {
                    carpetaPaciente.carpetaEfectores.push(carpetaNueva);
                }

                if (carpetaPaciente._id) {
                    return update('carpetaPaciente', { '_id': carpetaPaciente._id }, {
                        $set:
                            { 'carpetaEfectores': carpetaPaciente.carpetaEfectores }
                    });
                }

            } else {
                // El dni no existe en la colección carpetaPaciente 
                // Se guarda el documento en la colección carpetaPaciente

                return insert('carpetaPaciente', {
                    'documento': documentoPaciente,
                    'carpetaEfectores': [carpetaNueva]
                });

            }
        })
}

function migrar() {
    console.log('Migrando carpetas de pacientes');
    let q_limites='SELECT COUNT(*) FROM PD_PUCO';
    abrirConexion(config.urlMongoAndes).then(base => {
        db = base;
        return utils.migrarOffset(config.consultaPuco, q_limites, 100, inserPuco);
               
    })

}



//Se invoca a la función migrar
migrar();
