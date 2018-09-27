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
    //connectionTimeout: config.connectionTimeout,
    requestTimeout: config.requestTimeout
};
const url = config.urlMigracion;

var limit = 999;
var max = 20000;

// sql.connect(myConnection).then(function (err) {
//     if (err) {
//         console.error('error connecting: ' + JSON.parse(err));
//         return;
//     }
//     console.log('connected :) ');
// })


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

// async function run() {
    // let laboratorios = null;
    // for (var i = 0; i <= max; i += limit) {
    //     try {
    //         laboratorios = await getLaboratorioPracticas(i, limit);
    //         if (laboratorios.length > 0) {
    //             console.log('ok');
    //             //insertmongo(laboratorios);
    //         } else {
    //             console.log('game over');
    //         }
    //     } catch (e) {
    //         console.log('Error: ');
    //     }
    // }
// };


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
        let result = await db.collection('practicaTemp').insertMany(datos, { ordered: false })
        conn.close();
    } catch (err) {
        console.log("error insertMongo----", err, "datos: ", datos);
    }
}

