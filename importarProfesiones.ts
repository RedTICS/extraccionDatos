import * as mysql from 'mysql';
import * as mongodb from 'mongodb';
import * as config from './config';
import * as consultas from './consultas'

var myConnection = mysql.createConnection({
    host: config.mysqlServer,
    database: config.mysqlDatabase,
    user: config.mysqlUser,
    password: config.mysqlPassword,
});
const url = config.urlMigracion;

myConnection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + myConnection.threadId);
})

run();

async function run() {
    let profesiones = null;
    try {
        profesiones = await getProfesiones();
        if (profesiones.length > 0) {
            insertmongo(profesiones);
        } else {
            console.log('game over');
        }
    } catch (e) {
        console.log('Error: ');
    }
};

async function getProfesiones() {
    return new Promise((resolve, reject) => {
        myConnection.query(consultas.consultaProfesiones, function (error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    });
}

async function insertmongo(datos) {
    try {
        let conn = await mongodb.MongoClient.connect(url);
        let db = await conn.db('andes');
        let result = await db.collection('profesion').insertMany(datos, { ordered: false })
        conn.close();
    } catch (err) {
        console.log("error insertMongo----", err, "datos: ", datos);
    }
}
