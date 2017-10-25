import { servicioMongo } from './servicioMongo';
import { servicioSips } from './servicioSips'

var srvSips = new servicioSips();
var srvMongo = new servicioMongo();

// buscar el maximo id mongo para pasarlo como parametro en el otro llamado
srvSips.obtenerDatosNomivac(1, 2)
    .then((resultado) => {
        if (resultado == null) {
            console.log('Sin datos Nomivac');
        } else {
            var listaVacunas;
            listaVacunas = resultado[0];
            //console.log(listaVacunas);
            //srvMongo.borrarCollection('nomivac');
            srvMongo.guardarNomivac(listaVacunas, 'nomivac')
                .then((res => {
                    console.log('Guardar Vacunas');
                }))
                .catch((err => {
                    console.log('Error al guardar Vacunas', err);
                }))
        }
    })
    .catch((err) => {
        console.error('Error**:' + err)
    });
