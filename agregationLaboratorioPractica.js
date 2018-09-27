db.practicaTemp.aggregate(
    [
        // Stage 1
        {
            $project: {
                codigo: 1,
                nombre: 1,
                codigoNomenclador: 1,
                descripcion: 1,
                concepto: { conceptId: "$conceptoSnomed" }
            }
        },
        // Stage 6
        {
            $out: "practicaJR"
        },
    ]
);