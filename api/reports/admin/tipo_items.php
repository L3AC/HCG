<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/tipoitems_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Datos de tipos ítems');
// Se instancia el módelo Categoría para obtener los datos.
$tipoItem = new TipoItemData;

// Espacio
$pdf->ln(8);

// Se establece la fuente para los encabezados.
$pdf->setFont('Arial', 'B', 12);

$pdf->write(6, $pdf->encodeString('Conteo total del uso de tipo ítems'));
$pdf->ln(9);

// Descripción del reporte
$pdf->setFont('Arial', '', 11);
$pdf->write(6, $pdf->encodeString('A continuación, se podrán observar cuantos ítems pertenecen a los diferentes tipo de ítems que se tiene registrados.'));
$pdf->ln(9);

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataP = $tipoItem->readItemsTipoI()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(155, 119, 74);
    $pdf->SetTextColor(225, 225, 225);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 13);

    // Centrar la tabla
    $tableWidth = 120; // Suma de los anchos de las columnas
    $pdf->SetX(($pdf->GetPageWidth() - $tableWidth) / 2);

    // Se imprimen las celdas con los encabezados.
    $pdf->cell(60, 10, $pdf->encodeString('Nombre del tipo ítem'), 'B', 0, 'C', 1);
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
        $pdf->cell(60, 10, $pdf->encodeString($rowP['nombre_tipo_item']), 'TB', 0,'C');
        $pdf->cell(60, 10, $pdf->encodeString($rowP['cantidad_items']),'TB', 1,'C');
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay categorías para mostrar'), 1, 1);
}

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataP = $tipoItem->readItemsTipoIMax()) {
    $pdf->ln(9);

    // Descripción del reporte
    $pdf->setFont('Arial', 'B', 12);
    $pdf->write(6, $pdf->encodeString('Tipo de ítems con más ítems agregados'));
    $pdf->ln(9);
    
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 13);

    // Se recorren los registros fila por fila.
    foreach ($dataP as $rowP) {
            // Centrar la tabla
    $tableWidth = 120; // Suma de los anchos de las columnas
        $pdf->SetX(($pdf->GetPageWidth() - $tableWidth) / 2);

        // Se imprimen las celdas con los encabezados.
        $pdf->setFillColor(155, 119, 74);
        $pdf->SetTextColor(225, 225, 225);
        $pdf->cell(60, 10, $pdf->encodeString($rowP['nombre_tipo_item']), 0, 0, 'C', 1);

        $pdf->setFillColor(229, 178, 115);
        $pdf->setTextColor(176, 93, 0 );
        $pdf->cell(60, 10, $pdf->encodeString($rowP['cantidad_items']), 0, 1, 'C', 1);
    }
    $pdf->ln(6);

    // Descripción del reporte
    $pdf->setFont('Arial', '', 11);
    $pdf->setTextColor(0);
    $pdf->write(6, $pdf->encodeString('Tiene un total de '.  $pdf->encodeString($rowP['cantidad_items']) . ' ítem que pertenecen a este tipo ítem'));
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay categorías para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'productos.pdf');
