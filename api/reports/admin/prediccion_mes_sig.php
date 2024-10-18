<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/detallepedidos_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Ganancias Mensuales');

// Se instancia el modelo PedidosData para obtener los datos.
$pedido = new DetallePedidoData;

// Descripción del reporte
$pdf->setFont('Arial', '', 11);
$pdf->write(6, $pdf->encodeString('A continuación, se muestran las ganancias obtenidas de los últimos 6 meses'));
$pdf->ln(8);

// Obtener datos
$pedido->setId(6);
$dataP = $pedido->prediccionGanancia();

// Verificar si existen registros para mostrar
if ($dataP) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(155, 119, 74);
    $pdf->SetTextColor(225, 225, 225);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 13);

    // Se imprimen las celdas con los encabezados.
    $pdf->cell(95, 10, 'Nombre mes', 'B', 0, 'C', 1);
    $pdf->cell(95, 10, 'Ganancias mes', 'B', 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    $pdf->SetTextColor(0, 0, 0);

    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($dataP as $rowP) {
        // Verificar si las claves existen antes de usarlas
        $nombre_mes = isset($rowP['nombre_mes']) ? $rowP['nombre_mes'] : 'Desconocido';
        $ventas_mensuales = isset($rowP['ventas_mensuales']) ? $rowP['ventas_mensuales'] : 0;

        $pdf->cell(95, 10, $pdf->encodeString($nombre_mes), 'TB', 0, 'C');
        $pdf->cell(95, 10, '$' . number_format($ventas_mensuales, 2), 'TB', 1, 'C');
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay datos de ganancias para mostrar'), 1, 1);
}

// Espacio adicional para análisis
$pdf->ln(8);
$pdf->setFont('Arial', 'B', 12);
$pdf->write(6, $pdf->encodeString('Análisis de las ganancias mensuales'));
$pdf->ln(9);

// Análisis del reporte
$pdf->setFont('Arial', '', 11);
$pdf->write(6, $pdf->encodeString('Este reporte muestra las ganancias obtenidas mes a mes. Se recomienda revisar el patrón de crecimiento o disminución para ajustar las estrategias de ventas futuras.'));
$pdf->ln(9);

// Verificar si existen registros para mostrar
if ($dataP) {
    // Se toma solo el primer registro
    $rowP = $dataP[6];

    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(155, 119, 74);
    $pdf->SetTextColor(225, 225, 225);

    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 13);

    // Se imprimen las celdas con los encabezados
    $pdf->cell(95, 10, $pdf->encodeString('Siguiente mes'), 'B', 0, 'C', 1);
    $pdf->cell(95, 10, $pdf->encodeString('Predicción para el siguiente mes'), 'B', 1, 'C', 1);

    // Se establece un color de relleno para los datos.
    $pdf->setFillColor(240);
    $pdf->SetTextColor(0, 0, 0);

    // Se establece la fuente para los datos.
    $pdf->setFont('Arial', '', 11);

    // Verificar si las claves existen antes de usarlas
    $nombre_siguiente_mes = isset($rowP['nombre_siguiente_mes']) ? $rowP['nombre_siguiente_mes'] : 'Desconocido';
    $prediccion_siguiente_mes = isset($rowP['prediccion_siguiente_mes']) ? $rowP['prediccion_siguiente_mes'] : 0;

    // Imprimir la fila con dos columnas que ocupan todo el ancho de la página
    $pdf->cell(95, 10, $pdf->encodeString($nombre_siguiente_mes), 'TB', 0, 'C');
    $pdf->cell(95, 10, '$' . number_format($prediccion_siguiente_mes, 2), 'TB', 1, 'C');
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay datos de ganancias para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'reporte_ganancias.pdf');
