<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/pedidos_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Datos de pedidos');
// Se instancia el módelo Categoría para obtener los datos.
$pedido = new PedidoData;

// Espacio
$pdf->ln(8);

// Se establece la fuente para los encabezados.
$pdf->setFont('Arial', 'B', 12);

$pdf->write(6, $pdf->encodeString('Clientes con más productos comprados'));
$pdf->ln(9);

// Descripción del reporte
$pdf->setFont('Arial', '', 11);
$pdf->write(6, $pdf->encodeString('A continuación, se podrán observar todos los pedidos que ya han finalizado, es decir que ya se le entrego al cliente su producto.'));
// Espacio
$pdf->ln(8);

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataP = $pedido->readEstadoPedidos()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(155, 119, 74);
    $pdf -> SetTextColor(225, 225, 225);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 13);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(50, 10, 'Nombre cliente', 'B', 0, 'C', 1);
    $pdf->cell(80, 10, 'Fecha del pedido', 'B', 0, 'C', 1);
    $pdf->cell(51, 10, 'Estado del pedido', 'B', 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    $pdf -> SetTextColor(0, 0, 0);

    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($dataP as $rowP) {
        // Se imprime una celda con el nombre de la categoría.
        $pdf->cell(50, 10, $pdf->encodeString($rowP['Nombre']), 'TB', 0,'C');
        $pdf->cell(80, 10, $pdf->encodeString($rowP['fecha_pedido']), 'TB', 0,'C');
        $pdf->cell(51, 10, $pdf->encodeString($rowP['estado_pedido']),'TB', 1,'C');
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay categorías para mostrar'), 1, 1);
}

// Espacio
$pdf->ln(8);

// Se establece la fuente para los encabezados.
$pdf->setFont('Arial', 'B', 12);

$pdf->write(6, $pdf->encodeString('Clientes con más pedidos realizados'));
$pdf->ln(9);

// Descripción del reporte
$pdf->setFont('Arial', '', 11);
$pdf->write(6, $pdf->encodeString('A continuación, se podrán el conteo total de los pedidos, de cuantos han sido entregados en total y cuantos aún se encuentra en pendientes o no entregados.'));
$pdf->ln(9);

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataP = $pedido->readEstadosTodosPedidos()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(155, 119, 74);
    $pdf -> SetTextColor(225, 225, 225);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 13);

    // Centrar la tabla
    $tableWidth = 120; // Suma de los anchos de las columnas
    $pdf->SetX(($pdf->GetPageWidth() - $tableWidth) / 2);

    // Se imprimen las celdas con los encabezados.
    $pdf->cell(60, 10, 'Estado Pedido', 'B', 0, 'C', 1);
    $pdf->cell(60, 10, 'Cantidad', 'B', 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    $pdf -> SetTextColor(0, 0, 0);

    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($dataP as $rowP) {
        // Centrar las celdas de datos
        $pdf->SetX(($pdf->GetPageWidth() - $tableWidth) / 2);
        $pdf->cell(60, 10, $pdf->encodeString($rowP['estado_pedido']), 'TB', 0,'C');
        $pdf->cell(60, 10, $pdf->encodeString($rowP['cantidad_pedidos']),'TB', 1,'C');
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay categorías para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'productos.pdf');
