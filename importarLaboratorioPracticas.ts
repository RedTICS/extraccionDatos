import * as mongodb from 'mongodb';
import * as config from './config';
import * as consultas from './consultas';
import * as sql from 'mssql';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var myConnection = {
    user: config.hpnUser,
    password: config.hpnPassword,
    server: config.hpnServerSql,
    port: config.hpnPort,
    database: config.hpnDatabaseSql,
    requestTimeout: config.requestTimeout
};
const url = config.urlMigracion;

var limit = 999;
var max = 20000;


function obtenerPracticas() {
    return new Promise((resolve, reject) => {
        sql.connect(myConnection).then(function () {
            new sql.Request()
              .query(consultas.consultaLaboratorioPracticas).then(function (recordset) {
                    resolve(recordset.recordset);        
                }).catch(function (err) {
                    // ... query error checks
                    console.log("Error de conexión");
                    reject(err);
            });  
        });  
        
    });    
}

run();

async function run() {
    // let practicas = await obtenerPracticas();
    // insertmongo(practicas);
    aggregate();
}

async function getLaboratorioPracticas(desde, hasta) {
    return new Promise((resolve, reject) => {
        sql.connect(myConnection).then(function () {
            new sql.Request().query(consultas.consultaLaboratorioPracticas, [desde, hasta], function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        })
    });
}

async function insertmongo(datos) {
    try {
        let conn = await mongodb.MongoClient.connect(url);
        let db = await conn.db('andes');
        let result = await db.collection('practicaTempAll').insertMany(datos, { ordered: false })
        conn.close();
        console.log("inserted", datos.length)
    } catch (err) {
        console.log("error insertMongo----", err, "datos: ", datos);
    }
}

async function aggregate(){
    console.log('aggregate')
    let conn = await mongodb.MongoClient.connect(url);
    let db = await conn.db('andes');
    // await db.collection('practicaTemp').aggregate([
    //     {
    //        $project: {
    //           codigo: 1,
    //           nombre: 1,
    //           codigoNomenclador: 1,
    //           descripcion: 1,
    //           categoria: 1,
    //           ordenImpresion: 1,
    //           etiquetaAdicional: 1,
    //           concepto: { conceptId: "$conceptoSnomed" },
    //           sistema: null,
    //           tipoLaboratorio: {
    //               nombre: "$tipoLaboratorio_nombre"
    //           },
    //               area: {
    //                   nombre: "$area_nombre",
    //                   concepto: {
    //                       conceptId: "$area_conceptoSnomed"
    //                   }
    //               },
    //               unidadMedida: {
    //                   nombre: "$unidadMedida_nombre",
    //                   concepto: {
    //                       conceptId: "$unidadMedida_concepto_conceptId"
    //                   }
    //               },
    //               requeridos: [],
    //               resultado: {
    //                    formato: {
    //                        opciones: []
    //                    }
    //               },
    //               metodo: {
    //                   nombre: "$metodo_nombre",
    //                   valoresReferencia: {
    //                       sexo: "$metodo_valoresReferencia_sexo",
    //                       todasEdades: "$metodo_valoresReferencia_todasEdades",
    //                       edadDesde: "$metodo_valoresReferencia_edadDesde",
    //                       edadHasta: "$metodo_valoresReferencia_edadHasta",
    //                       unidadEdad: "$metodo_valoresReferencia_unidadEdad",
    //                       tipoValor: "$metodo_valoresReferencia_tipoValor",
    //                       valorMinimo: "$metodo_valoresReferencia_valorMinimo",
    //                       valorMaximo: "$metodo_valoresReferencia_valorMaximo",
    //                       observacion: "$metodo_valoresReferencia_observacion",
    //                       activo: "$metodo_valoresReferencia_activo",
    //                       reactivo: ["$metodo_valoresReferencia_reactivo"]
    //                   },
    
    //               },
    //               valoresCriticos: {
    //                   minimo: "$valoresCriticos_minimo",
    //                   maximo: "$valoresCriticos_maximo"
    //               },
    //               recomendaciones: [],
    
    //               factorProduccion: null,
    //               opciones: {$cond: [
    //                   { $eq: ["$resultado_formato_opciones", null] },
    //                     [],
    //                     "$resultado_formato_opciones"
    //               ]}
    //           }
    //        },
    //        {
    //            $group: {
    //                _id: {codigo: '$codigo'},
    //                codigo: { $first: '$codigo'},
    //                nombre: { $first: '$nombre'},
    //                codigoNomenclador: { $first: '$codigoNomenclador'},
    //                descripcion: { $first: '$descripcion'},
    //                categoria: { $first: '$categoria'}, 									
    //                ordenImpresion: { $first: '$ordenImpresion'},
    //                concepto: { $first: "$conceptoSnomed" },
    //                sistema: { $first: '$sistema' },
    //                tipoLaboratorio: { $first: "$tipoLaboratorio"},
    //                area: { $first: '$area' },
    //                unidadMedida: { $first: '$unidadMedida'},
    //                requeridos: { $first: '$requeridos'},
    //                resultado: { $first: '$resultado'},
    //                metodo: { $first: '$metodo'},
    //                valoresCriticos: { $first: '$valoresCriticos'},
    //                recomendaciones: { $first: '$recomendaciones'},
    //                factorProduccion: { $first: '$factorProduccion'},
    //                opciones: {$push: '$opciones'}
    //            }
    //        },
    //        {
    //            $addFields: {
    //                "resultado.formato.opciones": '$opciones'
    //            }
    //        },
    //        { $out: 'practicaRulo'},
    //        { $out: "practicaJR" }
    // ]);
    // console.log('agregacioens terminadas..........')        
    // db.collection('practicaRulo').update({}, {$unset: {opciones:1}}, false, true)
    // console.log('practicas zlxfvnzsdfshrfczhlqy')
    
    await db.collection('practica').find({}).toArray(function(err, practicas) {
        console.log('practicas', practicas.length)
        let promises = [];
        practicas.map( (practica) => {
            promises.push(new Promise((resolve, reject) => {
                setSCTConcept(practica._id, practica.concepto.conceptId,'concepto', resolve);
            }));
            promises.push(new Promise((resolve, reject) => {
                setSCTConcept(practica._id, practica.unidadMedida.concepto.conceptId, 'unidadMedida', resolve);
            }));
        });    
    });

    let setSCTConcept = (objectId, conceptId, field, resolve) => {
        
        let snomedURLexpression = 'http://localhost:3002/api/core/term/snomed/expression?expression=';
                    
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", snomedURLexpression + conceptId); // third parameter false for synchronous request
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log('this.responseText',this.responseText)
                let conceptoSnomed = JSON.parse(this.responseText).length > 0 ? JSON.parse(this.responseText)[0] : null ;

                let setParam;
                switch (field) {
                    case 'concepto':
                    setParam =  {$set: { "concepto": conceptoSnomed }};
                    break;

                    case 'unidadMedida':
                    setParam =  {$set: { "unidadMedida.concepto": conceptoSnomed }};
                    break;
                }
                
                db.collection('practica').findAndModify({ "_id": objectId }, [['_id','asc']], setParam );
                resolve(this.responseText);
            }
        }
        xmlHttp.send();
    }
}

    