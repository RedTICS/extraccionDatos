import { servicioMongo } from './servicioMongo';
import { servicioSips } from './servicioSips'

import * as sql from 'mssql';
import * as mongodb from 'mongodb';
import * as config from './config';
import { debug } from 'util';
import * as assert from 'assert';
import { resolve } from 'path';
import { EventEmitter } from 'events';

var srvSips = new servicioSips();
var srvMongo = new servicioMongo();

const connection = {
    user: config.user,
    password: config.password,
    server: config.serverSql,
    database: config.databasePadron,
};
const url = config.urlMigracion;

var offset = 1;
var limit = 999;
var max = 15000000;

var emitter = new EventEmitter();
emitter.setMaxListeners(0);

getPuco();

async function insertmongo(datos) {
    try {
        let conn = await mongodb.MongoClient.connect(url)
        let db = await conn.db('andes')
        let result = await db.collection('puco').insertMany(datos.recordset, { ordered: false })
        // console.dir(result)
    } catch (err) {
        console.log("error insertMongo----",err)
    }
}

async function getPuco(){
    console.log("Entra a gePuco")
    let pool =  await sql.connect(connection);
    sql.on('error', err => {
        // ... error handler
        console.log(err);
    });
    for (var i = 0; i <= max; i += limit) {
        try {
            let result1 = await pool.request()
                .input('offset', sql.Int, i)
                .input('limit', sql.Int, limit)
                .query(config.consultaPuco)
            const inserciones = await insertmongo(result1);
            console.dir(i);
        } catch (err) {
            // ... error checks
            console.log("ERROR getPuco---",err);
        }
    }
    pool.close();
}

/*

def source =  https://www.toptal.com/javascript/asynchronous-javascript-async-await-tutorial

 const verifyUser = async function(username, password){
   try {
       const userInfo = await dataBase.verifyUser(username, password); 
       const rolesInfo = await dataBase.getRoles(userInfo);
       const logStatus = await dataBase.logAccess(userInfo);
       return userInfo;
   }catch (e){
       //handle errors as needed
   }
};

*/