<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se verifica si existe un valor para el item, de lo contrario se muestra un mensaje.
if (isset($_GET['idItem'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../models/data/items_data.php');
    require_once('../../models/data/productos_data.php');
    // Se instancian las entidades correspondientes.
    $item = new ItemData;
    $producto = new ProductoData;
    // Se establece el valor del item, de lo contrario se muestra un mensaje.
    if ($item->setId($_GET['idItem']) && $producto->setItem($_GET['idItem'])) {
        // Se verifica si la categoría existe, de lo contrario se muestra un mensaje.
        if ($rowItem = $item->readOne()) {
            // Se inicia el reporte con el encabezado del documento.
            $pdf->startReport('Item: ' . $rowItem['descripcion_item']);
            // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
            if ($dataProductos = $producto->productosItem()) {
                // Se establece un color de relleno para los encabezados.
                $pdf->setFillColor(155, 119, 74);
                $pdf->SetTextColor(225, 225, 225);
                // Se establece la fuente para los encabezados.
                $pdf->setFont('Arial', 'B', 16);

                // Se imprimen las celdas con los encabezados.
                $pdf->cell(90, 10, 'Nombre', 'B', 0, 'C', 1);
                $pdf->cell(60, 10, 'Horario del producto', 'B', 0, 'C', 1);
                $pdf->cell(40, 10, 'Tipo de item', 'B', 1, 'C', 1);
                // Se establece la fuente para los datos de los productos.
                $pdf->setFont('Arial', '', 15);
                $pdf->SetTextColor(0, 0, 0);
                // Se recorren los registros fila por fila.
                foreach ($dataProductos as $rowProducto) {
                    $pdf->cell(90, 10, $pdf->encodeString($rowProducto['descripcion_producto']), 'TB', 0, 'C');
                    $pdf->cell(60, 10,  $pdf->encodeString($rowProducto['horario_producto']), 'TB', 0, 'C');
                    $pdf->cell(40, 10,  $pdf->encodeString($rowProducto['descripcion_tipo_item']), 'TB', 1, 'C');
                }
            } else {
                $pdf->cell(0, 10, $pdf->encodeString('No hay productos para este item'), 1, 1);
            }
            // Se llama implícitamente al método footer() y se envía el documento al navegador web.
            $pdf->output('I', 'item.pdf');
        } else {
            print('Item inexistente');
        }
    } else {
        print('Item incorrecta');
    }
} else {
    print('Debe seleccionar un item');
}
