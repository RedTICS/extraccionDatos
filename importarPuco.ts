import * as sql from 'mssql';
import * as mongodb from 'mongodb';
import * as config from './config';
import { debug } from 'util';
import * as assert from 'assert';
import { resolve } from 'path';
import { EventEmitter } from 'events';

const connection = {
    user: config.user,
    password: config.password,
    server: config.serverSql,
    database: config.databasePadron,
};
const url = config.urlMigracion;

var limit = 999;
var max = 5000000;

var emitter = new EventEmitter();
emitter.setMaxListeners(0);

getPuco();

async function insertmongo(datos) {
    try {
        let conn = await mongodb.MongoClient.connect(url);
        let db = await conn.db('andes');
        let result = await db.collection('puco').insertMany(datos, { ordered: false })
        conn.close();
    } catch (err) {
        console.log("error insertMongo----", err)
    }
}

async function getPuco() {
    for (var i = 0; i <= max; i += limit) {
        try {
            let pool = await sql.connect(connection);
            let result1 = await pool.request()
                .input('offset', sql.Int, i)
                .input('limit', sql.Int, limit)
                .query(config.consultaPuco)
            const inserciones = await insertmongo(result1.recordset);
            sql.close();
            console.dir(i);
        } catch (err) {
            // ... error checks
            console.log("ERROR getPuco---", err);
        }
    }
}
