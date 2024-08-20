<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se verifica si existe un valor para el tipo de item, de lo contrario se muestra un mensaje.
if (isset($_GET['idTipoItem'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../models/data/tipoitems_data.php');
    require_once('../../models/data/productos_data.php');
    // Se instancian las entidades correspondientes.
    $tipoItem = new TipoItemData;
    $producto = new ProductoData;
    // Se establece el valor del tipo item, de lo contrario se muestra un mensaje.
    if ($tipoItem->setId($_GET['idTipoItem']) && $producto->setTipoItem($_GET['idTipoItem'])) {
        // Se verifica si la categoría existe, de lo contrario se muestra un mensaje.
        if ($rowTipoItem = $tipoItem->readOne()) {
            // Se inicia el reporte con el encabezado del documento.
            $pdf->startReport('Tipo Item: ' . $rowTipoItem['descripcion_tipo_item']);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Arial', 'B', 13);

            $pdf->write(6, $pdf->encodeString('Productos segun tipo de item'));
            $pdf->ln(9);

            // Descripción del reporte
            $pdf->setFont('Arial', '', 12);
            $pdf->write(6, $pdf->encodeString('A continuación, se podrán observar cuantos productos cuenta  el tipo item : " ' .$rowTipoItem['descripcion_tipo_item'] . '" .'));
            $pdf->ln(9);
            // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
            if ($dataProductos = $producto->productosTipoItem()) {
                // Se establece un color de relleno para los encabezados.
                $pdf->setFillColor(155, 119, 74);
                $pdf->SetTextColor(225, 225, 225);
                // Se establece la fuente para los encabezados.
                $pdf->setFont('Arial', 'B', 14);

                // Se imprimen las celdas con los encabezados.
                $pdf->cell(70, 10, 'Nombre', 'B', 0, 'C', 1);
                $pdf->cell(70, 10, 'Horario del producto', 'B', 0, 'C', 1);
                $pdf->cell(50, 10, 'Item', 'B', 1, 'C', 1);
                // Se establece la fuente para los datos de los productos.
                $pdf->setFont('Arial', '', 12);
                $pdf->SetTextColor(0, 0, 0);
                // Se recorren los registros fila por fila.
                foreach ($dataProductos as $rowProducto) {
                    $pdf->cell(70, 10, $pdf->encodeString($rowProducto['descripcion_producto']), 'TB', 0, 'C');
                    $pdf->cell(70, 10,  $pdf->encodeString($rowProducto['horario_producto']), 'TB', 0, 'C');
                    $pdf->cell(50, 10,  $pdf->encodeString($rowProducto['descripcion_item']), 'TB', 1, 'C');
                }
            } else {
                $pdf->cell(0, 10, $pdf->encodeString('No hay productos para este tipo de item'), 1, 1);
            }
            // Se llama implícitamente al método footer() y se envía el documento al navegador web.
            $pdf->output('I', 'TipoItem.pdf');
        } else {
            print('Tipo de item inexistente');
        }
    } else {
        print('Tipo de item incorrecto');
    }
} else {
    print('Debe seleccionar un item');
}
