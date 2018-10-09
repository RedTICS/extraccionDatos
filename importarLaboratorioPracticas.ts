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

function obtenerPracticasSimples() {
    return obtenerPracticas(consultas.consultaLaboratorioPracticasSimples);
}   
async function obtenerPracticasCompuestas() {
    console.log('obtenerPracticasCompuestas');
    return obtenerPracticas(consultas.consultaLaboratorioPracticasCompuestas);
}

async function obtenerPracticas(query) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .query(query)
            .then((recordset) => { 
                resolve(recordset.recordset); 
            })
            .catch(function (err) {
                reject(err);
            });  
    });    
}

run();

async function run() {
    let conn = await mongodb.MongoClient.connect(url);
    let db = await conn.db('andes');
    await db.collection('practica').remove();
    await db.collection('practicaTemp').remove();
    conn.close();

    await sql.connect(myConnection);
    await insertmongo(await obtenerPracticasSimples());
    await aggregate(false);
    await insertmongo(await obtenerPracticasCompuestas());
    await aggregate(true);
    sql.close();
    
    console.log("end of program")
}

async function insertmongo(datos) {
    try {
        let conn = await mongodb.MongoClient.connect(url);
        let db = await conn.db('andes');
        let result = await db.collection('practicaTemp').insertMany(datos, { ordered: false })
        conn.close();
    } catch (err) {
        console.log("error insertMongo----", err, "datos: ", datos);
    }
}

async function aggregate(compuestas){
    console.log('aggregate', compuestas);
    let conn = await mongodb.MongoClient.connect(url);
    let db = await conn.db('andes');
    const project: any = {
        codigo: 1,
        nombre: 1,
        codigoNomenclador: 1,
        descripcion: 1,
        categoria: 1,
        ordenImpresion: 1,
        etiquetaAdicional: 1,
        concepto: { conceptId: "$conceptoSnomed" },
        sistema: null,
        tipo: compuestas ? 'Compuesta' : 'Simple',
        tipoLaboratorio: {
            nombre: "$tipoLaboratorio_nombre"
        },
        area: {
            nombre: "$area_nombre",
            concepto: {
                conceptId: "$area_conceptoSnomed"
            }
        },
        unidadMedida: {
            nombre: "$unidadMedida_nombre",
            concepto: {
                conceptId: "$unidadMedida_concepto_conceptId"
            }
        },
        resultado: {
            formato: {
                tipo: "$resultado_formato_tipo",
                decimales: "$resultado_formato_decimales",
                multiplicador: "$resultado_formato_multiplicador",
                notacionCientifica: {
                    exponentePredeterminado: null
                },
                limiteDeteccion: {  /* para poner "menor que 10", valor numerico (numero entre 10 y 50), o "mayor que 50" */
                    minimo: null,
                    maximo: null
                },
                opciones: []
            },
            valorDefault: "$resultado_valorDefault"
        },
        presentaciones: {
            denominacion: "$metodo_valoresReferencia_reactivo",
            fabricante: {
                nombre: "",
                numero: ""
            },
            metodo: "$metodo_nombre",
            valoresReferencia: [{
                sexo: "$metodo_valoresReferencia_sexo",
                todasEdades: "$metodo_valoresReferencia_todasEdades",
                edadDesde: "$metodo_valoresReferencia_edadDesde",
                edadHasta: "$metodo_valoresReferencia_edadHasta",
                unidadEdad: "$metodo_valoresReferencia_unidadEdad",
                tipoValor: "$metodo_valoresReferencia_tipoValor",
                valorMinimo: "$metodo_valoresReferencia_valorMinimo",
                valorMaximo: "$metodo_valoresReferencia_valorMaximo",
                observacion: "$metodo_valoresReferencia_observacion",
                activo: "$metodo_valoresReferencia_activo"
            }],
        },
        valoresCriticos: {
            minimo: "$valoresCriticos_minimo",
            maximo: "$valoresCriticos_maximo"
        },
        recomendaciones: [{
            nombre: "$recomendaciones_nombre",
            descripcion: "$recomendaciones_descripcion",
        }],
        factorProduccion: null,
        opciones: {
            $cond: [
                { $eq: ["$resultado_formato_opciones", null] },
                [],
                "$resultado_formato_opciones"
            ]
        },
        requeridos: {
            codigo: '$subitem_codigo',
            codigoNomenclador: '$subitem_codigoNomenclador',
            nombre: '$subitem_nombre'
        }
    };

    const group = {
        _id: { codigo: '$codigo' },
        codigo: { $first: '$codigo' },
        nombre: { $first: '$nombre' },
        codigoNomenclador: { $first: '$codigoNomenclador' },
        descripcion: { $first: '$descripcion' },
        categoria: { $first: '$categoria' },
        ordenImpresion: { $first: '$ordenImpresion' },
        concepto: { $first: "$concepto" },
        sistema: { $first: '$sistema' },
        tipoLaboratorio: { $first: "$tipoLaboratorio" },
        area: { $first: '$area' },
        unidadMedida: { $first: '$unidadMedida' },
        requeridos: { $push: '$requeridos' },
        resultado: { $first: '$resultado' },
        presentaciones: { $push: '$presentaciones' },
        valoresCriticos: { $first: '$valoresCriticos' },
        recomendaciones: { $first: '$recomendaciones' },
        factorProduccion: { $first: '$factorProduccion' },
        opciones: { $push: '$opciones' }
    };

    let practicasTemp = await db.collection('practicaTemp').aggregate([
        { $project: project },
        { $group: group },
        {
            $addFields: {
                "resultado.formato.opciones": '$opciones'
            }
        }
    ]).toArray();

    let practicaCollection = db.collection('practica');
    await practicaCollection.insertMany(practicasTemp, { ordered: false })
    await practicaCollection.update({}, { $unset: { opciones: 1 } }, false)
    await practicaCollection.find({}).toArray(function(err, practicas) {
        // let promises = [];
        practicas.map( async (practica) => {
            if (practica.categoria === 'compuesta') {
                let codigos = [];
                    practica.requeridos.map( (requerido) => {
                    codigos.push(requerido.codigo)
                });

                let requeridos = await db.collection('practica').aggregate([
                    {
                    $match: {
                        'codigo' : {$in: codigos }
                    }
                    },
                    { $project: {_id:'$_id'} }
                ]).toArray();
                await practicaCollection.findAndModify({ "_id": practica._id }, [['_id','asc']], {$set: { "requeridos": requeridos } });
            }
            setSCTConcept(practica._id, practica.concepto.conceptId,'concepto');
            setSCTConcept(practica._id, practica.unidadMedida.concepto.conceptId, 'unidadMedida');
        });    
    });

    await db.collection('practicaTemp').remove();
    let setSCTConcept = (objectId, conceptId, field) => {        
        let snomedURLexpression = 'http://localhost:3002/api/core/term/snomed/expression?expression=';

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", snomedURLexpression + conceptId); // third parameter false for synchronous request
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
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

                practicaCollection.findAndModify({ "_id": objectId }, [['_id','asc']], setParam );
            }
        }
        xmlHttp.send();
    }
    console.log('END AGREGGATE')
}