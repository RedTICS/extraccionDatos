import * as config from '../config';
import * as sqlserver from './sqlserver';

export function migrar(q_objeto, q_limites, page_size, addNuevoObjeto) {
    let max;
    let connection = {
        user: config.user,
        password: config.password,
        server: config.serverSql2,
        database: config.dbMigracion,
        //connectionTimeout: config.connectionTimeout,
        requestTimeout: config.requestTimeout
    };

    function navegar(connection, index) {
        if (index < max) {
            let offset = index + page_size;
            return sqlserver.query(connection, q_objeto, index, offset)
                .then(objetos => {
                    if (objetos && objetos.length) {
                        let nuevosObjetos = objetos.map(o => addNuevoObjeto(o));
                        return Promise.all(nuevosObjetos).then(res =>
                            navegar(connection, offset + 1)
                        );
                    }
                    else return navegar(connection, offset + 1);
                });
        }
    }

    return sqlserver.query(connection, q_limites)
        .then(resultado => {
            if (resultado[0]) {
                console.log(resultado[0]['min'] + ' - ' + resultado[0]['max']);
                let min = resultado[0]['min'];
                max = resultado[0]['max'];
                return navegar(connection, min);
            }
        });
}


export function migrarOffset(q_objeto, q_limites, page_size, addNuevoObjeto) {
    let max;
    let connection = {
        user: config.user,
        password: config.password,
        server: config.serverSql2,
        database: config.databasePadron,
        //connectionTimeout: config.connectionTimeout,
        requestTimeout: config.requestTimeout
    };

    function jobMigracion(connection, i, page_size, total) {
        console.log('job Migracion');
        console.log(i, page_size);
        if (i * page_size < total) {
            let offset = i * page_size;
            return sqlserver.queryOffset(connection, q_objeto, offset, page_size)
                .then(objetos => {
                    if (objetos && objetos.length) {
                        console.log('Cant pacientes', objetos.length);
                        let nuevosObjetos = objetos.map(o => addNuevoObjeto(o));
                        return Promise.all(nuevosObjetos).then(res =>
                            jobMigracion(connection,i+1, page_size, total)
                        );
                    }
                    else return jobMigracion(connection,i+1,page_size, total);
                });
        }
    }

    // return sqlserver.query(connection, q_limites)
    //     .then(resultado => {
    //         if (resultado[0]) {
    //             // console.log(resultado[0]['min'] + ' - ' + resultado[0]['max']);
                // let min = resultado[0]['min'];
                // max = resultado[0]['max'];
                // console.log('MAX', max);

               return jobMigracion(connection, 0, 1000, 2900000);
        //     }
        // });
}

