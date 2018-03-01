import { servicioMongo } from './servicioMongo';
import { servicioSips } from './servicioSips'

import * as sql from 'mssql';
import * as mongodb from 'mongodb';
import * as config from './config';
import { debug } from 'util';
import * as assert from 'assert';

var srvSips = new servicioSips();
var srvMongo = new servicioMongo();

const connection = {
    user: config.user,
    password: config.password,
    server: config.serverSql,
    database: config.databasePadron,
};
const url = config.urlMigracion;

sql.connect(connection, err => {
    // ... error checks

    const request = new sql.Request()
    request.stream = true // You can set streaming differently for each request
    request.query(config.consultaFinanciador) // or request.execute(procedure)

    request.on('recordset', columns => {
        // Emitted once for each recordset in a query
        console.log(columns);
    })

    request.on('row', row => {
        // Emitted for each row in a recordset        
        (async function() {
            let client;
          
            try {
              client = await mongodb.MongoClient.connect(url);
              console.log("Connected correctly to server");
          
              const db = client.db('andes');
              let r = await db.collection('financiador').insertOne(row);
              assert.equal(1, r.insertedCount);
            } catch (err) {
              console.log(err.stack);
            }
          
            // Close connection
            client.close();
          })();
    })

    request.on('error', err => {
        // May be emitted multiple times
        console.log('Error al guardar', err);
    })

    request.on('done', result => {
        // Always emitted as the last one        
        console.log('FIN', result);
    })
})

sql.on('error', err => {
    // ... error handler
    console.log('Error de conexión', err);
})





/*

Este codigo funciona, el de arriba tambien

srvSips.obtenerDatosFinanciador()
    .then((resultado) => {
        if (resultado == null) {
            console.log('Sin datos de financiador');
        } else {
            var list;
            list = resultado[0];
            //console.log(resultado);
            srvMongo.borrarCollection('financiador');
            srvMongo.guardarDatos(list, 'financiador')
                .then((res => {
                    console.log('Guardar Financiador');
                }))
                .catch((err => {
                    console.log('Error al guardar Financiador', err);
                }))
        }
    })
    .catch((err) => {
        console.error('Error**:' + err)
    });
*/