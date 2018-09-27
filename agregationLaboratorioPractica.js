db.practicaTemp.aggregate(
    [
        // Stage 1
        {
            $project: {                
                codigo: 1,
                nombre: 1,
                codigoNomenclador: 1,
                descripcion: 1,
                categoria : 1, 									
                ordenImpresion : 1, 
                
                concepto: { conceptId:"$conceptoSnomed"},
                sistema: null,
                tipoLaboratorio: {
                    nombre: "$tipoLaboratorio_nombre",
                    nomencladorProvincial: 0
                    },
                area:{
                    nombre: "$area_nombre",
                    concepto: "$area_conceptoSnomed",
                    }
            }
        },
        // Stage 6
        {
            $out: "practicaJR"
        },
    ]
);