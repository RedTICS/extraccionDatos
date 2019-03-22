import * as mongodb from 'mongodb';
import * as config from '../config';

const url = config.urlMigracion;

run();

async function run() {
    console.log("start")
    await aggregate('endocri', '57e9670e52df311059bc8964');
    await aggregate('PROTEINAS', '57fcf038326e73143fb48dac');
    console.log("end of program")
}

async function aggregate(nombreArea, IDlaboratorioDestino) {
    let conn = await mongodb.MongoClient.connect(url);
    let db = await conn.db('andes');
    var find = new RegExp(nombreArea, "i");
    
    let configTemp = await db.collection('practica').aggregate([
        { $match: { 'area.nombre':  find } },
        { $project: { 
            laboratorioDestino: new mongodb.ObjectID(IDlaboratorioDestino),
            idPractica: "$_id"} 
        }
        
    ]).toArray();
    db.collection('configuracionDerivacion').insertMany(configTemp);
    console.log('END AGREGGATE')
}

/**


// Practicas de Endorinologia al HPN
    db.practica.aggregate([	
    { $match: 
        {'area.nombre':/endocri/i}
    },
    { $project: 
        { 
            laboratorioDestino: new mongodb.ObjectID(IDlaboratorioDestino),
            idPractica: "$_id"
        }
    },
    { $out: "configuracionDerivacionTemp"},
    ],
    { allowDiskUse: true })
    db.configuracionDerivacionTemp.find().forEach(function(doc) {db.configuracionDerivacion.insert(doc)})


// Practicas de PROTEINAS E INMUNOLOGIA al HHH 
    db.practica.aggregate([	
    { $match: 
        {'area.nombre':/PROTEINAS/i}
    },
    { $project: 
        { 
            laboratorioDestino: ObjectId("57fcf038326e73143fb48dac"),
            idPractica: "$_id"
        }
    },
    { $out: "configuracionDerivacionTemp"},
    ],
    { allowDiskUse: true })
    db.configuracionDerivacionTemp.find().forEach(function(doc) {db.configuracionDerivacion.insert(doc)})

 */