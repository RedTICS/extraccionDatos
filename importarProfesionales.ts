import * as mysql from 'mysql';
import * as mongodb from 'mongodb';
import * as config from './config';

var myConnection = mysql.createConnection({
    host: config.mysqlServer,
    database: config.mysqlDatabase,
    user: config.mysqlUser,
    password: config.mysqlPassword,
});
const url = config.urlMigracion;

var limit = 999;
var max = 20000;

myConnection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + myConnection.threadId);
})

run();

async function run() {
    let profesionales = null;
    for (var i = 0; i <= max; i += limit) {
        try {
            profesionales = await getProfesionalesFull(i, limit);
            if (profesionales.length > 0) {
                insertmongo(profesionales);
            } else {
                console.log('game over');
            }
        } catch (e) {
            console.log('Error: ');
        }
    }
};

async function getProfesionales() {
    return new Promise((resolve, reject) => {
        myConnection.query(config.consultaProfesionales, function (error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    })
}

async function getProfesionalesFull(desde, hasta) {
    return new Promise((resolve, reject) => {
        myConnection.query(config.consultaProfesionalesFull, [desde, hasta], function (error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    });
}

async function insertmongo(datos) {
    try {
        let conn = await mongodb.MongoClient.connect(url);
        let db = await conn.db('andes');
        let result = await db.collection('profesional').insertMany(datos, { ordered: false })
        conn.close();
    } catch (err) {
        console.log("error insertMongo----", err, "datos: ", datos);
    }
}

// async function insertmongo(datos) {
//     let conn = await mongodb.MongoClient.connect(url);
//     let db = await conn.db('andes');
//     return new Promise((resolve, reject) => {
//         db.collection('profesional').insertMany(datos, { ordered: false }, function (err, result) {
//             if (err) reject(err);
//             resolve(result);
//         });
//         conn.close();
//     });
// }

// myConnection.end();
