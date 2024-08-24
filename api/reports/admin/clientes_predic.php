<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/clientes_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Predicción de clientes para el siguiente mes');

// Se instancia el módelo para obtener los datos.
$cliente = new ClienteData;

// Espacio
$pdf->ln(8);

// Obtener datos
$dataP = $cliente->prediccionClientesRep();

// Verificar si existen registros para mostrar
if ($dataP) {

    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(155, 119, 74);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', '', 13);

    // Imprimir análisis de los datos
    $pdf->write(6, $pdf->encodeString('Análisis de clientes mensuales: El siguiente análisis muestra la cantidad de clientes registrados en los últimos seis meses.'));
    $pdf->ln(10);

    // Centrar la tabla
    $tableWidth = 190; // Suma de los anchos de las columnas
    $pdf->SetX(($pdf->GetPageWidth() - $tableWidth) / 2);

    // Se imprimen las celdas con los encabezados.
    $pdf->cell(95, 10, 'Nombre mes', '', 0, 'C', 1);
    $pdf->cell(95, 10, 'Cantidad clientes', '', 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.


    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($dataP as $rowP) {
        $nombre_mes = isset($rowP['nombre_mes']) ? $rowP['nombre_mes'] : 'Desconocido';
        $clientes_mensuales = isset($rowP['clientes_mensuales']) ? $rowP['clientes_mensuales'] : 0;

        // Centrar las celdas de datos
        $pdf->SetX(($pdf->GetPageWidth() - $tableWidth) / 2);
        $pdf->cell(95, 10, $pdf->encodeString($nombre_mes), 'TB', 0, 'C');
        $pdf->cell(95, 10, $clientes_mensuales, 'TB', 1, 'C');
    }

    // Espacio
    $pdf->ln(10);

    // Imprimir análisis de la predicción
    $pdf->write(6, $pdf->encodeString('Predicción para el siguiente mes:'));
    $pdf->ln(10);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(95, 10, 'Siguiente mes', '', 0, 'C', 1);
    $pdf->cell(95, 10, $pdf->encodeString('Predicción'), '', 1, 'C', 1);

    // Centrar las celdas de datos
    $nombre_siguiente_mes = isset($rowP['nombre_siguiente_mes']) ? $rowP['nombre_siguiente_mes'] : 'Desconocido';
    $prediccion_siguiente_mes = isset($rowP['prediccion_siguiente_mes']) ? $rowP['prediccion_siguiente_mes'] : 0;

    $pdf->SetX(($pdf->GetPageWidth() - $tableWidth) / 2);
    $pdf->cell(95, 10, $pdf->encodeString($nombre_siguiente_mes), 'TB', 0, 'C');
    $pdf->cell(95, 10, number_format($prediccion_siguiente_mes, 2), 'TB', 1, 'C');
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay datos de clientes para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'prediccion_clientes.pdf');
