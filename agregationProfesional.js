db.profesional.aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$project: {
				nombre: 1,
				apellido: 1,
				tipoDocumento: 1,
				documento: 1,
				documentoVencimiento: 1,
				cuit: 1,
				fechaNacimiento: 1,
				lugarNacimiento: 1,
				nacionalidad: {
					codigo: "$nacionalidad_codigo",
					nombre: "$nacionalidad_nombre",
				},
				sexo: 1,
				notas: 1,
				domicilios: [{
					activo: true,
					tipo: "real",
					valor: "$domicilio_real",
					codigoPostal: "$domicilio_real_cp",
					ubicacion: {
						pais: {
							"_id": ObjectId("57f3b5c469fe79a598e6281f"),
							"nombre": "Argentina"
						},
						provincia: {
							"nombre": "$domicilio_real_prov_nombre"
						},
						localidad: {
							"nombre": "$domicilio_real_localidad"
						},
					}
				},
				{
					activo: true,
					tipo: "legal",
					valor: "$domicilio_legal",
					codigoPostal: "$domicilio_legal_cp",
					ubicacion: {
						pais: {
							"_id": ObjectId("57f3b5c469fe79a598e6281f"),
							"nombre": "Argentina"
						},
						provincia: {
							"nombre": "$domicilio_legal_prov_nombre"
						},
						localidad: {
							"nombre": "$domicilio_legal_localidad"
						},
					}
				},
				{
					activo: true,
					tipo: "profesional",
					valor: "$domicilio_profesional",
					codigoPostal: "$domicilio_profesional_cp",
					ubicacion: {
						pais: {
							"_id": ObjectId("57f3b5c469fe79a598e6281f"),
							"nombre": "Argentina"
						},
						provincia: {
							"nombre": "$domicilio_profesional_prov_nombre"
						},
						localidad: {
							"nombre": "$domicilio_profesional_localidad"
						},
					}
				}
				],
				contactos: [
					{
						tipo: "celular",
						valor: "$contactos_celular",
						activo: true,
					},
					{
						tipo: "email",
						valor: "$contactos_email",
						activo: true,
					},
					{
						tipo: "fijo",
						valor: "$contactos_fijo",
						activo: true,
					}
				],
				formacionGrado: [{
					profesion: {
                                                codigo: "$profesion_codigo_sisa",
						nombre: "$profesion_nombre",
                                                tipoDeFormacion: "$profesion_tipo_formacion"
					},
					entidadFormadora: {
						codigo: "$entidadFormadora_codigo",
						nombre: "$entidadFormadora_nombre"
					},
					titulo: "$titulo",
					fechaEgreso: "$fechaEgreso",
					matriculacion: [{
						matriculaNumero: "$grado_matriculacion_matriculaNumero",
						libro: "$grado_matriculacion_libro",
						folio: "$grado_matriculacion_folio",
						inicio: "$grado_matriculacion_inicio",
						fin: "$grado_matriculacion_fin",
						baja : {
							motivo : "",
							fecha : null
						},
					}],
					//fin:"$grado_matriculacion_fin",
					matriculado: { $cond: [{ $gte: ["$grado_matriculacion_fin", new Date()] }, true, false] },
					papelesVerificados: { $cond: [{ $gte: ["$grado_matriculacion_fin", new Date()] }, true, false] },
					renovacion: false,
				}],
                                
				formacionPosgrado: { $cond: [{ $eq: ["$especialidad_nombre", null] }, null,  [{
					profesion: {
						codigo: "$profesion_codigo_sisa",
						nombre: "$profesion_nombre"
					},
					especialidad: {
						codigo: "$especialidad_codigo_sisa",
						tipo: "$especialidad_tipo",
						nombre: "$especialidad_nombre"
					},
					//fin:"$posgrado_matriculacion_fin",
					matriculado: { $cond: [{ $gte: ["$posgrado_matriculacion_fin", { $year: new Date() }] }, true, false] },
					papelesVerificados: { $cond: [{ $gte: ["$posgrado_matriculacion_fin", { $year: new Date() }] }, true, false] },
					revalida: false,
					matriculacion: [{
						matriculaNumero: "$posgrado_matriculacion_matriculaNumero",
						libro: "$posgrado_matriculacion_libro",
						folio: "$posgrado_matriculacion_folio",
						fin: "$posgrado_matriculacion_fin",
						baja : {
							motivo : "",
							fecha : null
						},
					}],
                }]]},
				sanciones: [{
					numero: "$sancion_numero",
					sancion: {
						id: "$sancion_id",
						nombre: "$sancion_nombre"
					},
					motivo: "$sancion_motivo",
					normaLegal: "$sancion_normaLegal",
					fecha: "$sancion_fecha",
					vencimiento: "$sancion_vencimiento"
				}]

			}
		},

		// Stage 2
		{
			$group: {
				_id: {
					documento: "$documento",
					tipoDocumento: "$tipoDocumento",
					nombre: "$nombre",
					apellido: "$apellido",
					documentoVencimiento: "$documentoVencimiento",
					cuit: "$cuit",
					fechaNacimiento: "$fechaNacimiento",
					lugarNacimiento: "$lugarNacimiento",
					nacionalidad: "$nacionalidad",
					sexo: "$sexo",
					notas: "$notas"
				},
				idOld: { $min: "$_id" },
				formacionGrado: { $addToSet: "$formacionGrado" },
				formacionPosgrado: { $addToSet: "$formacionPosgrado" },
				sanciones: { $addToSet: "$sanciones" },
				domicilios: { $addToSet: "$domicilios" },
				contactos: { $addToSet: "$contactos" }
			}
		},

		// Stage 3
		{
			$addFields: {
				"formacionPosgrado": {
					"$reduce": {
						"input": "$formacionPosgrado",
						"initialValue": [],
						"in": { "$setUnion": ["$$value", "$$this"] }
					}
				},
				"formacionGrado": {
					"$reduce": {
						"input": "$formacionGrado",
						"initialValue": [],
						"in": { "$setUnion": ["$$value", "$$this"] }
					}
				},
				"sanciones": {
					"$reduce": {
						"input": "$sanciones",
						"initialValue": [],
						"in": { "$setUnion": ["$$value", "$$this"] }
					}
				},
				"domicilios": {
					"$reduce": {
						"input": "$domicilios",
						"initialValue": [],
						"in": { "$setUnion": ["$$value", "$$this"] }
					}
				},
				"contactos": {
					"$reduce": {
						"input": "$contactos",
						"initialValue": [],
						"in": { "$setUnion": ["$$value", "$$this"] }
					}
				}

			}
		},

		// Stage 4
		{
			$project: {
				_id: "$idOld",
				nombre: "$_id.nombre",
				apellido: "$_id.apellido",
				tipoDocumento: "$_id.tipoDocumento",
				documento: "$_id.documento",
				documentoVencimiento: "$_id.documentoVencimiento",
				cuit: "$_id.cuit",
				fechaNacimiento: "$_id.fechaNacimiento",
				lugarNacimiento: "$_id.lugarNacimiento",
				nacionalidad: "$_id.nacionalidad",
				sexo: "$_id.sexo",
				notas: "$_id.notas",
				formacionGrado: "$formacionGrado",
				formacionPosgrado: "$formacionPosgrado",
				sanciones: "$sanciones",
				domicilios: "$domicilios",
				contactos: "$contactos",
			}
		},

		// Stage 5
		{
			$sort: {
				documento: 1
			}
		},

		// Stage 6
		{
			$out: "profesionalSchema"
		},

	],
	{ allowDiskUse: true }

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
