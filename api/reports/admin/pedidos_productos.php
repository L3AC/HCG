<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/productos_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Cantidad de pedidos por producto');
// Se instancia el módelo Producto para obtener los datos.
$producto = new ProductoData;

// Espacio
$pdf->ln(5);

// Se establece la fuente para los encabezados.
$pdf->setFont('Arial', 'B', 12);

// Descripción del reporte
$pdf->setFont('Arial', '', 11);
$pdf->write(6, $pdf->encodeString('A continuación, se podrán observar el total de veces que se ha pedido un producto en específico.'));
// Espacio
$pdf->ln(10);

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataP = $producto->readPedidosProducto()) {
    // Obtener el producto más pedido
    $productoMasPedido = $dataP[0]; // El primer registro, ya que está ordenado por cantidad descendentemente

    // Mostrar texto en negrita sobre el producto más pedido, centrado
    $pdf->setFont('Arial', 'B', 12);
    $textoProductoMasPedido = sprintf('El producto con mayor cantidad de pedidos es "%s" con %d pedidos.', 
    $pdf->encodeString($productoMasPedido['descripcion_producto']),
    $productoMasPedido['cantidad_pedidos']);
    $w = $pdf->GetStringWidth($textoProductoMasPedido) + 6; // Obtener ancho del texto
    $pdf->SetX(($pdf->GetPageWidth() - $w) / 2); // Calcular la posición X para centrar el texto
    $pdf->cell($w, 10, $textoProductoMasPedido, 0, 1, 'C');
    $pdf->ln(10); // Espacio después del texto


    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(155, 119, 74);
    $pdf->SetTextColor(225, 225, 225);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 13);

    // Centrar la tabla
    $tableWidth = 120; // Suma de los anchos de las columnas
    $pdf->SetX(($pdf->GetPageWidth() - $tableWidth) / 2);

    // Se imprimen las celdas con los encabezados.
    $pdf->cell(60, 10, 'Producto', 'B', 0, 'C', 1);
    $pdf->cell(60, 10, 'Pedidos totales', 'B', 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    $pdf->SetTextColor(0, 0, 0);

    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($dataP as $rowP) {
        // Centrar las celdas de datos
        $pdf->SetX(($pdf->GetPageWidth() - $tableWidth) / 2);
        $pdf->cell(60, 10, $pdf->encodeString($rowP['descripcion_producto']), 'TB', 0, 'C');
        $pdf->cell(60, 10, $pdf->encodeString($rowP['cantidad_pedidos']), 'TB', 1, 'C');
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay categorías para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'productos.pdf');
?>
