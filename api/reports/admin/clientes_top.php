<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/clientes_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Clientes con más compras');
// Se instancia el módelo Categoría para obtener los datos.
$cliente = new ClienteData;
// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataP = $cliente->topClientes()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(204, 200, 170);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(155, 10, 'Cliente', 'B', 0, 'C', 1);
    $pdf->cell(31, 10, 'Productos', 'B', 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($dataP as $rowP) {
        // Se imprime una celda con el nombre de la categoría.
        $pdf->cell(155, 10, $pdf->encodeString($rowP['cliente']), 'TB', 0,'C');
        $pdf->cell(31, 10, $pdf->encodeString($rowP['total_productos_comprados']),'TB', 1,'C');
        // Se instancia el módelo Producto para procesar los datos.
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay categorías para mostrar'), 1, 1);
}
// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'productos.pdf');
