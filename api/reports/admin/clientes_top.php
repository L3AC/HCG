<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/clientes_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Datos de clientes');
// Se instancia el módelo Categoría para obtener los datos.
$cliente = new ClienteData;

// Espacio
$pdf->ln(8);

// Se establece la fuente para los encabezados.
$pdf->setFont('Arial', 'B', 12);

$pdf->write(6, $pdf->encodeString('Clientes con más productos comprados'));
$pdf->ln(9);

// Descripción del reporte
$pdf->setFont('Arial', '', 11);
$pdf->write(6, $pdf->encodeString('A continuación, se podrán observar el total de productos que los clientes han comprado (siendo estos la suma total de productos a lo largo de todos los pedidos).'));
// Espacio
$pdf->ln(8);

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataP = $cliente->topClientes()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(155, 119, 74);
    $pdf -> SetTextColor(225, 225, 225);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 13);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(50, 10, 'Cliente', 'B', 0, 'C', 1);
    $pdf->cell(100, 10, 'Correo', 'B', 0, 'C', 1);
    $pdf->cell(31, 10, 'Productos', 'B', 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    $pdf -> SetTextColor(0, 0, 0);

    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($dataP as $rowP) {
        // Se imprime una celda con el nombre de la categoría.
        $pdf->cell(50, 10, $pdf->encodeString($rowP['cliente']), 'TB', 0,'C');
        $pdf->cell(100, 10, $pdf->encodeString($rowP['correo_cliente']), 'TB', 0,'C');
        $pdf->cell(31, 10, $pdf->encodeString($rowP['total_productos_comprados']),'TB', 1,'C');
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
$pdf->write(6, $pdf->encodeString('A continuación, se podrán observar el total de pedidos que han hecho los clientes. Mostrando únicamente los que se han completado hasta el momento en que se generó este reporte.'));
$pdf->ln(9);

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataP = $cliente->readClientesPedidos()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(155, 119, 74);
    $pdf -> SetTextColor(225, 225, 225);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 13);

    // Centrar la tabla
    $tableWidth = 120; // Suma de los anchos de las columnas
    $pdf->SetX(($pdf->GetPageWidth() - $tableWidth) / 2);

    // Se imprimen las celdas con los encabezados.
    $pdf->cell(60, 10, 'Cliente', 'B', 0, 'C', 1);
    $pdf->cell(60, 10, 'Pedidos totales', 'B', 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    $pdf -> SetTextColor(0, 0, 0);

    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($dataP as $rowP) {
        // Centrar las celdas de datos
        $pdf->SetX(($pdf->GetPageWidth() - $tableWidth) / 2);
        $pdf->cell(60, 10, $pdf->encodeString($rowP['nombre']), 'TB', 0,'C');
        $pdf->cell(60, 10, $pdf->encodeString($rowP['cantidad_pedidos']),'TB', 1,'C');
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay categorías para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'productos.pdf');
