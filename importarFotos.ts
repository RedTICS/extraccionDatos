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

var limit = 10;
var max = 99;
var fs = require('fs');

myConnection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + myConnection.threadId);
})

run();

async function run() {
    let fotos = null;
    for (var i = 0; i <= max; i += limit) {
        try {
            fotos = await getFotos(i, limit);
            if (fotos.length > 0) {
                saveFotos(fotos);
            } else {
                console.log('game over');
            }
        } catch (e) {
            console.log('Error: ' + e);
        }
    }
};

async function getFotos(desde, hasta) {
    return new Promise((resolve, reject) => {
        myConnection.query(consultas.consultaFotos, [desde, hasta], function (error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    });
}

async function saveFotos(datos) {
    datos.forEach(foto => {
        try {
            fs.writeFile(`./fotos/${foto.documento}.jpeg`, foto.foto, (error) => { console.log(error); });
            fs.writeFile(`./fotos/${foto.documento}_firma.jpeg`, foto.firma,(error) => { console.log(error); });
        } catch (error) {
            console.log("Error en saveFotos: " + error);
        }
    });
}