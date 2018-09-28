import * as mongodb from 'mongodb';
import * as config from './config';
import * as consultas from './consultas';
import * as sql from 'mssql';

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
    console.log('obtenerPracticas')
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
    let practicas = await obtenerPracticas();
    insertmongo(practicas);
};

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
    console.log('insertmongo')
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

