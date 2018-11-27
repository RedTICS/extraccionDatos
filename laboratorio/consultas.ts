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

const selectLaboratorioPracticas = `
        SELECT  i.codigo ,
                i.nombre ,
                i.codigoNomenclador ,
                i.descripcion ,
                i.conceptId AS conceptoSnomed ,
                i.tipo AS tipo,
                ts.nombre AS tipoLaboratorio_nombre ,
                a.objectId AS area_objectId,
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
    + ` AND i.idCategoria = 1 AND pd.orden = 1`;