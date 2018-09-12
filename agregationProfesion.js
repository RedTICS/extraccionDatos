db.profesion.aggregate(

    // Pipeline

    [

        // Stage 1

        {

            $project: {

                profesion: {

                    codigo: "$profesion_codigo",

                    nombre: "$profesion_nombre",

                    habilitado: true,

                },

                proximoNumero: "$profesion_proximo_numero",

                especialidad: null

            }

        },

        {

            $out: "profesionSchema"

        },

    ]

);