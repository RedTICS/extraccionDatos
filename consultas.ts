// TODO: Mover todos llamados a las consultas de abajo al archivo consultas.ts
// TODO: Cambiar en las consultas multilinea las comillas simples o dobles de apertura y cierre por backticks (acentos invertidos) 
// y eliminar los signos + de cada fin de linea (ver consultas.consultaProfesiones como ejemplo de uso)

export const consultaPaciente = 'SELECT PAC.idPaciente,PAC.nombre, PAC.apellido, PAC.numeroDocumento,idsexo,convert(varchar(10),PAC.fechaNacimiento,103) AS fechaNacimiento, ' +
    'PAC.calle, PAC.numero, PAC.piso, PAC.departamento, PAC.manzana, PAC.lote, PAC.parcela, L.idLocalidad,' +
    'L.nombre AS nombreLocalidad, L.codigoPostal, PROVINCIA.nombre as nombreProvincia,PAC.idProvinciaDomicilio, PAIS.nombre as nombrePais, PAC.idPais, ' +
    'PAC.informacionContacto, convert(varchar(10),PAC.fechaAlta,103) AS fechaAlta, convert(varchar(10),PAC.fechaDefuncion,103) AS fechaDefuncion, convert(varchar(10),PAC.fechaUltimaActualizacion,103) AS fechaUltimaActualizacion, PAC.telefonofijo, ' +
    'PAC.telefonocelular, PAC.email, ESTCIVIL.idEstadoCivil, MOTNI.idMotivoNI, MOTNI.nombre AS nombreMotivo ' +
    'FROM sys_paciente AS PAC ' +
    'LEFT JOIN dbo.Sys_EstadoCivil AS ESTCIVIL ON (ESTCIVIL.idEstadoCivil = PAC.idEstadoCivil) ' +
    'LEFT JOIN dbo.Sys_MotivoNI AS MOTNI ON (MOTNI.idMotivoNI = PAC.idMotivoNI) ' +
    'INNER JOIN sys_pais AS PAIS ON (PAIS.idPais = PAC.idPais) ' +
    'LEFT JOIN dbo.Sys_Provincia AS PROVINCIA ON (PROVINCIA.idProvincia = PAC.idProvinciaDomicilio) ' +
    'LEFT JOIN dbo.Sys_Localidad AS L ON (L.idLocalidad=Pac.idLocalidad) ' +
    'WHERE PAC.activo = 1 ';

export const consultaPacienteSipsHC = 'SELECT PAC.idPaciente,PAC.nombre, PAC.apellido, PAC.numeroDocumento,idsexo,convert(varchar(10),PAC.fechaNacimiento,103) AS fechaNacimiento, ' +
    'PAC.calle, rhe.historiaClinica as historiaClinica, efector.nombre as efector, efector.idEfector as efectorId, PAC.piso, PAC.departamento, PAC.manzana, PAC.lote, PAC.parcela, L.idLocalidad, ' +
    'L.nombre AS nombreLocalidad, L.codigoPostal, PROVINCIA.nombre as nombreProvincia,PAC.idProvinciaDomicilio, PAIS.nombre as nombrePais, PAC.idPais, ' +
    'PAC.informacionContacto, convert(varchar(10),PAC.fechaAlta,103) AS fechaAlta, convert(varchar(10),PAC.fechaDefuncion,103) AS fechaDefuncion, convert(varchar(10),PAC.fechaUltimaActualizacion,103) AS fechaUltimaActualizacion, PAC.telefonofijo, ' +
    'PAC.telefonocelular, PAC.email, ESTCIVIL.idEstadoCivil, MOTNI.idMotivoNI, MOTNI.nombre AS nombreMotivo ' +
    'FROM dbo.sys_paciente AS PAC ' +
    'inner join dbo.Sys_RelHistoriaClinicaEfector AS rhe ON rhe.idPaciente = pac.idPaciente ' +
    'inner join dbo.Sys_Efector as efector on rhe.idefector = efector.idEfector ' +
    'LEFT JOIN dbo.Sys_EstadoCivil AS ESTCIVIL ON (ESTCIVIL.idEstadoCivil = PAC.idEstadoCivil) ' +
    'LEFT JOIN dbo.Sys_MotivoNI AS MOTNI ON (MOTNI.idMotivoNI = PAC.idMotivoNI) ' +
    'INNER JOIN sys_pais AS PAIS ON (PAIS.idPais = PAC.idPais) ' +
    'LEFT JOIN dbo.Sys_Provincia AS PROVINCIA ON (PROVINCIA.idProvincia = PAC.idProvinciaDomicilio) ' +
    'LEFT JOIN dbo.Sys_Localidad AS L ON (L.idLocalidad=Pac.idLocalidad) ' +
    'WHERE PAC.activo = 1';

export const consultaPacienteHeller = 'SELECT * ' +
    'FROM PacientesHeller ';

export const consultaPacienteHPN = 'SELECT TOP 10 PHPN.*, PD.domicilio,PD.detalle,PD.audit_datetime as fechaDomicilio ' +
    'FROM PacientesHPN PHPN ' +
    'LEFT JOIN Pacientes_Domicilios PD ON (PHPN.id = PD.idPaciente) ' +
    'LEFT JOIN Pacientes_Contactos PC ON (PHPN.id = PC.idPaciente)';

export const consultaPacienteHC = "SELECT * FROM Historias_Clinicas HC " +
    "LEFT JOIN Pacientes PHPN ON (PHPN.legacy_idHistoriaClinica = HC.Codigo) " +
    "LEFT JOIN Localidades L ON (HC.HC_Direccion_Localidad =L.Loc_Codigo)  " +
    "LEFT JOIN Provincias P ON (L.Loc_Provincia= P.Prov_Codigo) " +
    "WHERE HC_Dado_de_baja='" + "false'";

export const consultaPacCluster = 'SELECT PAC.idPaciente,PAC.nombre, PAC.apellido, PAC.numeroDocumento,idsexo,convert(varchar(10),PAC.fechaNacimiento,103) AS fechaNacimiento, ' +
    'PAC.calle, PAC.numero, PAC.piso, PAC.departamento, PAC.manzana, PAC.lote, PAC.parcela, L.idLocalidad,' +
    'L.nombre AS nombreLocalidad, L.codigoPostal, PROVINCIA.nombre as nombreProvincia,PAC.idProvinciaDomicilio, PAIS.nombre as nombrePais, PAC.idPais, ' +
    'PAC.informacionContacto, convert(varchar(10),PAC.fechaAlta,103) AS fechaAlta, convert(varchar(10),PAC.fechaDefuncion,103) AS fechaDefuncion, convert(varchar(10),PAC.fechaUltimaActualizacion,103) AS fechaUltimaActualizacion, PAC.telefonofijo, ' +
    'PAC.telefonocelular, PAC.email, ESTCIVIL.idEstadoCivil, MOTNI.idMotivoNI, MOTNI.nombre AS nombreMotivo, CP.cluster_id ' +
    'FROM sys_paciente AS PAC ' +
    'LEFT JOIN dbo.Sys_EstadoCivil AS ESTCIVIL ON (ESTCIVIL.idEstadoCivil = PAC.idEstadoCivil) ' +
    'LEFT JOIN dbo.Sys_MotivoNI AS MOTNI ON (MOTNI.idMotivoNI = PAC.idMotivoNI) ' +
    'INNER JOIN sys_pais AS PAIS ON (PAIS.idPais = PAC.idPais) ' +
    'LEFT JOIN dbo.Sys_Provincia AS PROVINCIA ON (PROVINCIA.idProvincia = PAC.idProvinciaDomicilio) ' +
    'LEFT JOIN dbo.Sys_Localidad AS L ON (L.idLocalidad=Pac.idLocalidad) ' +
    'LEFT JOIN dbo.clusterPacientes2 AS CP ON (CP.record_id = Pac.idPaciente) ' +
    'WHERE PAC.activo = 1 and (PAC.idPaciente>=@inicio and PAC.idPaciente<=@fin)';

export const consultaRelaciones = 'SELECT P.idPaciente, ' +
    'PAR.NumeroDocumento AS DocumentoRel, Par.Apellido AS ApellidoRel,Par.Nombre AS NombreRel, ' +
    'Par.tipoParentesco AS TipoParentesco ' +
    'FROM Sys_Parentesco AS Par ' +
    'LEFT JOIN Sys_Paciente AS P ON  (Par.idPaciente = P.idPaciente) ' +
    'WHERE ((P.activo =1) AND (Par.idParentesco>0) AND (Par.numeroDocumento > 0))';

export const consultaCie10 = "SELECT * FROM Sys_CIE10 order by ID " +
    "offset @offset rows fetch next @limit rows only";


export const consultaNomivac = 'SELECT ID as idvacuna, NroDocumento as documento, ' + 
'apellido , nombre, fechaNacimiento, CASE Sexo WHEN \'M\' THEN \'masculino\' ELSE \'femenino\' END AS sexo, vacuna, ' + 
'dosis, fechaAplicacion, Establecimiento as efector ' + 
'from nomivac where CodigoAplicacion is not null '; 

export const consultaFinanciador = 'SELECT cod_os, nombre FROM obras_sociales';

export const consultaPuco = ` SELECT P.id , P.TipoDoc AS tipoDocumento, 
P.DNI AS dni ,
P.Transmite AS transmite ,
P.Nombre	AS nombre,
P.CodigoOS AS codigoFinanciador ,
O.nombre AS financiador
FROM dbo.Pd_PUCO P LEFT JOIN dbo.obras_sociales O
ON P.CodigoOS = O.cod_os
ORDER BY CURRENT_TIMESTAMP
OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;

export const consultaPuco2 = ` SELECT P.id , P.TipoDoc AS tipoDocumento, 
P.DNI AS dni ,
P.Transmite AS transmite ,
P.Nombre	AS nombre,
P.CodigoOS AS codigoFinanciador ,
O.nombre AS financiador
FROM dbo.Pd_PUCO P LEFT JOIN dbo.obras_sociales O
ON P.CodigoOS = O.cod_os `;

export const consultaProfesionales =`
SELECT
P.ProfesionalNombre          AS nombre,
P.ProfesionalApellido        AS apellido,
TD.TipoDocumentoDesc         AS tipoDocumento,
P.ProfesionalDocumento       AS documento,
CAST(
  CASE WHEN P.ProfesionalFchVencDoc='1000-01-01'
    THEN '1900-01-01' ELSE P.ProfesionalFchVencDoc
  END
  AS DATE) AS documentoVencimiento,
P.ProfesionalCUILCUIT        AS cuit,
P.ProfesionalFechaNacimiento AS fechaNacimiento,
P.ProfesionalLugarNacimiento AS lugarNacimiento,
N.NacionalidadEquivSISA      AS nacionalidad_codigo,
N.NacionalidadDescripcion    AS nacionalidad_nombre,
P.ProfesionalSexo            AS sexo,
-- Schema: Contactos
P.ProfesionalTelefonoCelular AS contactos_celular,
P.ProfesionalMail            AS contactos_email,
P.ProfesionalTelefonoFijo    AS contactos_fijo,

-- Domicilio Real
trim( concat( P.ProfesionalDomRealCalle , ' ',
 P.ProfesionalDomRealNro ,' ',
P.ProfesionalDomRealTorre ,' ',
P.ProfesionalDomRealPiso ,' ',
P.ProfesionalDomRealDpto ) )  AS domicilio_real,
P.ProfesionalDomRealCP      AS domicilio_real_cp,
P.ProfesionalDomRealProvCod   AS domicilio_real_prov_cod,
DR.ProvinciaDescripcion AS domicilio_real_prov_nombre,
P.ProfesionalLocalidadReal AS  domicilio_real_localidad,
-- Domicilio Legal
trim( concat( P.ProfesionalDomLegalCalle    , ' ',
P.ProfesionalDomLegalNro      , ' ',
P.ProfesionalDomLegalTorre    , ' ',
P.ProfesionalDomLegalPiso     , ' ',
P.ProfesionalDomLegalDpto ) )  AS domicilio_legal,
P.ProfesionalDomLegalCP       AS domicilio_legal_cp,
P.ProfesionalDomLegalProvCod  AS domicilio_legal_prov_cod,
DL.ProvinciaDescripcion AS domicilio_legal_prov_nombre,
P.ProfesionalLocalidadLegal AS  domicilio_legal_localidad,
-- Domicilio Profesional
trim( concat( P.ProfesionalDomLaboralCalle    , ' ',
P.ProfesionalDomLaboralNro      , ' ',
P.ProfesionalDomLaboralTorre    , ' ',
P.ProfesionalDomLaboralPiso     , ' ',
P.ProfesionalDomLaboralDpto  ) )  AS domicilio_profesional,
P.ProfesionalDomLaboralCP       AS domicilio_profesional_cp,
DP.ProvinciaDescripcion AS domicilio_profesional_prov_nombre,
P.ProfesionalLocalidadLaboral AS  domicilio_profesional_localidad,

CASE P.ProfesionalRematriculado
WHEN 'RM'
  THEN 1
ELSE 0 END  AS rematriculado,
DATE_ADD( DATE_ADD( DATE_ADD(TurnoFecha, interval hour(TurnoHora) HOUR), INTERVAL minute(TurnoHora) MINUTE ), INTERVAL second(TurnoHora) SECOND  ) as turno,
P.ProfesionalObservaciones   AS notas,
-- FORMACION GRADO
T.ProfesionID                     AS profesion_codigo,
CONVERT( PR.ProfesionEquivalenciaSISA, UNSIGNED INTEGER) AS profesion_codigo_sisa,
CONVERT( PR.ProfesionEquivalenciaReferenci, UNSIGNED INTEGER) AS profesion_codigo_referencia,
CASE PR.NivelProfesionID
  WHEN 1 THEN 'Grado Universitario'
  WHEN 2 THEN 'Tecnicatura'
  WHEN 3 THEN 'Auxiliarato'
END AS profesion_tipo_formacion,
PR.ProfesionDescripcion           AS profesion_nombre,
U.UniversidadEquivalenciaSISA     AS entidadFormadora_codigo,
CASE T.UniversidadID
WHEN 1
  THEN T.ProfesionalProfesionOtraUniv
ELSE U.UniversidadDescripcion END AS entidadFormadora_nombre,
T.ProfesionalTitulo               AS titulo,
T.ProfesionalFechaEgreso          AS fechaEgreso,
P.ProfesionalMatricula            AS grado_matriculacion_matriculaNumero,
P.ProfesionalMatriculaLibro       AS grado_matriculacion_libro,
P.ProfesionalMatriculaFolio       AS grado_matriculacion_folio,
cast( CONCAT( P.ProfesionalMatriculaAnio, '-01-01') as DATE) AS grado_matriculacion_inicio,
P.ProfesionalFchVtoMatricula      AS grado_matriculacion_fin,
-- FORMACION POSGRADO
ME.ME_EspecialidadID              AS especialidad_codigo,
E.CodigoSisa                      AS especialidad_codigo_sisa,
E.TipoEspecialidadID              AS especialidad_tipo,
ME.ME_EspecialidadDescripcion     AS especialidad_nombre,
ME.ME_ProfesionEspecialidadMatric AS posgrado_matriculacion_matriculaNumero,
ME.ME_EspecialidadMatLibro        AS posgrado_matriculacion_libro,
ME.ME_EspecialidadMatFolio        AS posgrado_matriculacion_folio,
cast( CONCAT( ME.ME_EspecialidadMatAnio, '-01-01') as DATE) AS posgrado_matriculacion_fin, -- en UI es "Año Vto."
-- SANCIONES
S.ProfesionalSancionNumero      AS sancion_numero,
S.SancionID                     AS sancion_id,
S.ProfesionalMotivoSancion      AS sancion_motivo,
S.ProfesionalDisposicionSancion AS sancion_normaLegal,
S.ProfesionalFechaSancion       AS sancion_fecha,
S.ProfesionalVencimientoSancion AS sancion_vencimiento

FROM profesionales P
LEFT JOIN tiposdocumento TD ON P.TipoDocumentoID = TD.TipoDocumentoID
LEFT JOIN nacionalidades N ON P.NacionalidadID = N.NacionalidadID
LEFT JOIN profesionalesprofesionales_pro T
  ON P.ProfesionalDocumento = T.ProfesionalDocumento
     AND P.TipoDocumentoID = T.TipoDocumentoID
LEFT JOIN universidades U
  ON T.UniversidadID = U.UniversidadID
LEFT JOIN profesiones PR ON T.ProfesionID = PR.ProfesionID
LEFT JOIN matriculas_de_especialidades ME
  ON P.ProfesionalDocumento = ME.ME_ProfesionalDocumento
     AND P.TipoDocumentoID = ME.ME_TipoDocumentoID
LEFT JOIN especialidades E on ME_EspecialidadID = E.EspecialidadID
LEFT JOIN profesionalesprofesionales_san S
  ON P.TipoDocumentoID = S.TipoDocumentoID AND P.ProfesionalDocumento = S.ProfesionalDocumento
LEFT JOIN provincias DR ON P.ProfesionalDomRealProvCod = DR.ProvinciaID
LEFT JOIN provincias DL ON P.ProfesionalDomLegalProvCod = DL.ProvinciaID
LEFT JOIN provincias DP ON P.ProfesionalDomLabProvCod= DP.ProvinciaID

WHERE T.ProfesionID IS NOT NULL

ORDER BY P.ProfesionalDocumento, P.TipoDocumentoID
LIMIT ?, ? ;
`;

export const consultaFotos= `
SELECT
P.ProfesionalNombre          AS nombre,
P.ProfesionalApellido        AS apellido,
P.ProfesionalDocumento       AS documento,
P.ProfesionalFoto            AS foto,
P.ProfesionalFirma            AS firma
FROM profesionales P
ORDER BY P.ProfesionalDocumento, P.TipoDocumentoID
LIMIT ?, ? ;
`;
export const consultaProfesiones= `
SELECT
CONVERT( ProfesionEquivalenciaSISA, UNSIGNED INTEGER)  AS profesion_codigo,
  ProfesionDescripcion AS profesion_nombre,
  ProfesionUltimaMatriculaDispon  AS profesion_proximo_numero
FROM profesiones;`;

export const consultaEspecialidades= `
SELECT
  TD.TipoDocumentoDesc              AS tipoDocumento,
  P.ProfesionalDocumento            AS documento,
  T.ProfesionID                     AS profesion_codigo,
  PR.ProfesionDescripcion           AS profesion_nombre,
  -- Especialidad
  ME.ME_EspecialidadID              AS especialidad_codigo,
  ME.ME_EspecialidadDescripcion     AS especialidad_nombre,

  ME.ME_ProfesionEspecialidadMatric AS matriculacion_matriculaNumero,
  ME.ME_EspecialidadMatLibro        AS matriculacion_libro,
  ME.ME_EspecialidadMatFolio        AS matriculacion_folio,
  ME.ME_EspecialidadMatAnio         AS matriculacion_fin -- en UI es "Año Vto."

FROM profesionales P
  INNER JOIN tiposdocumento TD ON P.TipoDocumentoID = TD.TipoDocumentoID
  LEFT JOIN matriculas_de_especialidades ME
    ON P.ProfesionalDocumento = ME.ME_ProfesionalDocumento
       AND P.TipoDocumentoID = ME.ME_TipoDocumentoID
  LEFT JOIN profesionalesprofesionales_pro T
    ON P.ProfesionalDocumento = T.ProfesionalDocumento
       AND P.TipoDocumentoID = T.TipoDocumentoID
  LEFT JOIN universidades U
    ON T.UniversidadID = U.UniversidadID
  LEFT JOIN profesiones PR ON T.ProfesionID = PR.ProfesionID
  LEFT JOIN (
              SELECT
                MAX(ME_FechaAlta) AS ME_FechaAlta,
                ME_TipoDocumentoID,
                ME_ProfesionalDocumento,
                ME_ProfesionID,
                ME_EspecialidadID
              FROM matesp_fechasalta
              GROUP BY ME_TipoDocumentoID,
                ME_ProfesionalDocumento,
                ME_ProfesionID,
                ME_EspecialidadID
            ) AS EA
    ON ME.ME_TipoDocumentoID = EA.ME_TipoDocumentoID
       AND ME.ME_ProfesionalDocumento = EA.ME_ProfesionalDocumento
       AND ME.ME_EspecialidadID = EA.ME_EspecialidadID
       AND ME.ME_ProfesionID = EA.ME_ProfesionID
WHERE
    P.ProfesionalDocumento = ? AND
    TD.TipoDocumentoDesc = ?

ORDER BY P.ProfesionalDocumento, P.TipoDocumentoID;`;

export const consultaSanciones= `
SELECT
  TD.TipoDocumentoDesc            AS tipoDocumento,
  P.ProfesionalDocumento          AS documento,
  S.ProfesionalSancionNumero      AS numero,
  S.SancionID                     AS sancion_id,
  S.ProfesionalMotivoSancion      AS motivo,
  S.ProfesionalDisposicionSancion AS normaLegal,
  S.ProfesionalFechaSancion       AS fecha,
  S.ProfesionalVencimientoSancion AS vencimiento
FROM profesionales P
  INNER JOIN tiposdocumento TD ON P.TipoDocumentoID = TD.TipoDocumentoID
  INNER JOIN profesionalesprofesionales_san S
    ON P.TipoDocumentoID = S.TipoDocumentoID AND P.ProfesionalDocumento = S.ProfesionalDocumento;
WHERE
    P.ProfesionalDocumento = ? AND
    TD.TipoDocumentoDesc = ?
ORDER BY P.ProfesionalDocumento, P.TipoDocumentoID;`;

const selectLaboratorioPracticas = `
SELECT  i.codigo ,
        i.nombre ,
        i.codigoNomenclador ,
        i.descripcion ,
        i.conceptId AS conceptoSnomed ,
        i.tipo AS tipo,
        ts.nombre AS tipoLaboratorio_nombre ,
        UPPER(a.nombre) AS area_nombre ,
		a.conceptId AS area_conceptoSnomed ,
        CASE WHEN i.idCategoria = 0 THEN 'simple'
             ELSE 'compuesta'
        END AS categoria ,
        i.ordenImpresion ,
        u.nombre unidadMedida_nombre ,
        u.conceptId AS unidadMedida_concepto_conceptId ,
        '' AS requeridos ,
        r.resultado AS resultado_formato_opciones ,
        i.resultadoDefecto AS resultado_valorDefault ,
        CASE ( i.idTipoResultado )
          WHEN 1 THEN 'Numérico'
          WHEN 2 THEN 'Texto'
          WHEN 3 THEN 'Predefenidos (Selección simple)'
          WHEN 4 THEN 'Predefenidos (Selección múltiple)'
          ELSE 'Otro'
        END AS resultado_formato_tipo ,
        i.formatoDecimal AS resultado_formato_decimales,
        i.multiplicador AS resultado_formato_multiplicador,
        
		-- metodo
        m.nombre AS metodo_nombre ,
        vr.sexo AS metodo_valoresReferencia_sexo ,
        vr.todasEdades AS metodo_valoresReferencia_todasEdades ,
        vr.edadDesde AS metodo_valoresReferencia_edadDesde ,
        vr.edadHasta AS metodo_valoresReferencia_edadHasta ,
        vr.unidadEdad AS metodo_valoresReferencia_unidadEdad ,
        vr.tipoValor AS metodo_valoresReferencia_tipoValor ,
        vr.valorMinimo AS metodo_valoresReferencia_valorMinimo ,
        vr.valorMaximo AS metodo_valoresReferencia_valorMaximo ,
        vr.observacion AS metodo_valoresReferencia_observacion ,
        CONVERT(BIT, 1) AS metodo_valoresReferencia_activo ,
        'cargar reactivos' AS metodo_valoresReferencia_reactivo ,
		-- valoresCriticos
        i.valorMinimo AS valoresCriticos_minimo ,
        i.valorMaximo AS valoresCriticos_maximo ,
        i.etiquetaAdicional ,
        ir.idRecomendacion ,
        rc.nombre AS recomendaciones_nombre ,
        rc.descripcion AS recomendaciones_descripcion`;

const selectLaboratorioPracticasCompuestas = `
        , si.codigo AS subitem_codigo ,
        si.nombre AS subitem_nombre ,
        si.codigoNomenclador AS subitem_codigoNomenclador `;
        

const fromLaboratorioPracticas = `
    FROM dbo.LAB_Item i
        LEFT JOIN dbo.LAB_Area a ON a.idArea = i.idArea
        LEFT JOIN dbo.LAB_TipoServicio ts ON ts.idTipoServicio = a.idTipoServicio
        LEFT JOIN dbo.LAB_UnidadMedida u ON u.idUnidadMedida = i.idUnidadMedida
        LEFT JOIN dbo.LAB_ResultadoItem r ON r.idItem = i.idItem
        LEFT JOIN dbo.LAB_ValorReferencia vr ON vr.idItem = i.idItem
        LEFT JOIN dbo.LAB_Metodo m ON m.idMetodo = vr.idMetodo
        LEFT JOIN dbo.LAB_ItemRecomendacion ir ON ir.idItem = i.idItem
        LEFT JOIN dbo.LAB_Recomendacion rc ON rc.idRecomendacion = ir.idRecomendacion `;

const fromLaboratorioPracticasCompuesta = `
        LEFT JOIN dbo.LAB_PracticaDeterminacion pd on pd.idItemPractica = i.idItem
        LEFT JOIN dbo.Lab_Item si on pd.idItemDeterminacion = si.idItem `;

const whereLaboratorioPracticas = `
    WHERE   i.baja = 0 AND i.conceptId IS NOT NULL AND i.conceptId <>'XXX'
        AND a.baja = 0 `;
        // -- AND ts.baja = 0
        // -- AND u.baja = 0
        // -- AND r.baja = 0
        // -- AND m.baja = 0
        // -- AND rc.baja = 0`
export const consultaLaboratorioPracticasSimples = selectLaboratorioPracticas + fromLaboratorioPracticas + whereLaboratorioPracticas + ` AND i.idCategoria = 0`;
export const consultaLaboratorioPracticasCompuestas = selectLaboratorioPracticas 
                                                        + selectLaboratorioPracticasCompuestas 
                                                        + fromLaboratorioPracticas 
                                                        + fromLaboratorioPracticasCompuesta 
                                                        + whereLaboratorioPracticas 
                                                        + ` AND i.idCategoria = 1`;