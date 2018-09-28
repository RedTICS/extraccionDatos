db.practicaTemp.aggregate([
    {
       $project: {
          codigo: 1,
          nombre: 1,
          codigoNomenclador: 1,
          descripcion: 1,
          categoria: 1,
          ordenImpresion: 1,
          etiquetaAdicional: 1,
          concepto: { conceptId: "$conceptoSnomed" },
          sistema: null,
          tipoLaboratorio: {
              nombre: "$tipoLaboratorio_nombre"
          },
              area: {
                  nombre: "$area_nombre",
                  concepto: {
                      conceptId: "$area_conceptoSnomed"
                  }
              },
              unidadMedida: {
                  nombre: "$unidadMedida_nombre",
                  concepto: {
                      conceptId: "$unidadMedida_concepto_conceptId"
                  }
              },
              requeridos: [],
              resultado: {
                   formato: {
                       opciones: []
                   }
              },
              metodo: {
                  nombre: "$metodo_nombre",
                  valoresReferencia: {
                      sexo: "$metodo_valoresReferencia_sexo",
                      todasEdades: "$metodo_valoresReferencia_todasEdades",
                      edadDesde: "$metodo_valoresReferencia_edadDesde",
                      edadHasta: "$metodo_valoresReferencia_edadHasta",
                      unidadEdad: "$metodo_valoresReferencia_unidadEdad",
                      tipoValor: "$metodo_valoresReferencia_tipoValor",
                      valorMinimo: "$metodo_valoresReferencia_valorMinimo",
                      valorMaximo: "$metodo_valoresReferencia_valorMaximo",
                      observacion: "$metodo_valoresReferencia_observacion",
                      activo: "$metodo_valoresReferencia_activo",
                      reactivo: ["$metodo_valoresReferencia_reactivo"]
                  },

              },
              valoresCriticos: {
                  minimo: "$valoresCriticos_minimo",
                  maximo: "$valoresCriticos_maximo"
              },
              recomendaciones: [],

              factorProduccion: null,
              opciones: {$cond: [
                  { $eq: ["$resultado_formato_opciones", null] },
                    [],
                    "$resultado_formato_opciones"
              ]}
          }
       },
       {
           $group: {
               _id: {codigo: '$codigo'},
               codigo: { $first: '$codigo'},
               nombre: { $first: '$nombre'},
               codigoNomenclador: { $first: '$codigoNomenclador'},
               descripcion: { $first: '$descripcion'},
               categoria: { $first: '$categoria'}, 									
               ordenImpresion: { $first: '$ordenImpresion'},
               concepto: { $first: "$conceptoSnomed" },
               sistema: { $first: '$sistema' },
               tipoLaboratorio: { $first: "$tipoLaboratorio"},
               area: { $first: '$area' },
               unidadMedida: { $first: '$unidadMedida'},
               requeridos: { $first: '$requeridos'},
               resultado: { $first: '$resultado'},
               metodo: { $first: '$metodo'},
               valoresCriticos: { $first: '$valoresCriticos'},
               recomendaciones: { $first: '$recomendaciones'},
               factorProduccion: { $first: '$factorProduccion'},
               opciones: {$push: '$opciones'}
           }
       },
       {
           $addFields: {
               "resultado.formato.opciones": '$opciones'
           }
       },
       { $out: 'practicaRulo'},
       { $out: "practicaJR" }
])
       
db.practicaRulo.update({}, {$unset: {opciones:1}}, false, true)        

// db.practicaTemp.aggregate(
//     [
//         // Stage 1
//         {
//             $project: {
//                 codigo: 1,
//                 nombre: 1,
//                 codigoNomenclador: 1,
//                 descripcion: 1,
//                 categoria: 1,
//                 ordenImpresion: 1,
//                 etiquetaAdicional: 1,
//                 concepto: { conceptId: "$conceptoSnomed" },
//                 sistema: null,
//                 tipoLaboratorio: {
//                     nombre: "$tipoLaboratorio_nombre"
//                 },
//                 area: {
//                     nombre: "$area_nombre",
//                     concepto: {
//                         conceptId: "$area_conceptoSnomed"
//                     },
//                 },
//                 unidadMedida: {
//                     nombre: "$unidadMedida_nombre",
//                     concepto: {
//                         conceptId: "$unidadMedida_concepto_conceptId"
//                     }
//                 },
//                 requeridos: [],
//                 resultado: {
//                     formato: {
//                         numerico: 1
//                     },
//                 },
//                 metodo: {
//                     nombre: "$metodo_nombre",
//                     valoresReferencia: {
//                         sexo: "$metodo_valoresReferencia_sexo",
//                         todasEdades: "$metodo_valoresReferencia_todasEdades",
//                         edadDesde: "$metodo_valoresReferencia_edadDesde",
//                         edadHasta: "$metodo_valoresReferencia_edadHasta",
//                         unidadEdad: "$metodo_valoresReferencia_unidadEdad",
//                         tipoValor: "$metodo_valoresReferencia_tipoValor",
//                         valorMinimo: "$metodo_valoresReferencia_valorMinimo",
//                         valorMaximo: "$metodo_valoresReferencia_valorMaximo",
//                         observacion: "$metodo_valoresReferencia_observacion",
//                         activo: "$metodo_valoresReferencia_activo",
//                         reactivo: ["$metodo_valoresReferencia_reactivo"]
//                     },

//                 },
//                 valoresCriticos: {
//                     minimo: "$valoresCriticos_minimo",
//                     maximo: "$valoresCriticos_maximo"
//                 },
//                 recomendaciones: [],

//                 factorProduccion: null
//             }
//         },
        // Stage 6
    //     {
    //         $out: "practicaJR"
    //     }
    // ]
// );
