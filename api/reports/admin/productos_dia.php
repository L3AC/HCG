
<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se verifica si existe un valor para el cliente, de lo contrario se muestra un mensaje.
if (isset($_GET['listDay'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../models/data/productos_data.php');
    // Se instancian las entidades correspondientes.
    $productos = new ProductoData;
    // Se establece el valor del cliente, de lo contrario se muestra un mensaje.
    if ($productos->setComboBdia($_GET['listDay'])) {
        // Se verifica si el cliente existe, de lo contrario se muestra un mensaje.
        // Se inicia el reporte con el encabezado del documento.
        $pdf->startReport('Productos del día ' . $_GET['listDay']);

        // Descripción del reporte
        $pdf->setFont('Arial', '', 13);
        $pdf->write(8, $pdf->encodeString('         A continuación, se podrá observar cada producto que está disponible según el día seleccionado.'));
        // Espacio
        $pdf->ln(10);
        $pdf->write(8, $pdf->encodeString('         Los productos mostrados están ordenados según su precio, se han ordenado de menor a mayor los datos.'));
        // Espacio
        $pdf->ln(15);

        // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
        if ($dataProductos = $productos->productosDia()) {
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(155, 119, 74);
            $pdf->SetTextColor(255, 255, 255);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Arial', 'B', 16);

            // Se imprimen las celdas con los encabezados.
            $pdf->cell(70, 10, 'Nombre', 'B', 0, 'C', 1);
            $pdf->cell(70, 10, 'Horario', 'B', 0, 'C', 1);
            $pdf->cell(50, 10, 'Precio', 'B', 1, 'C', 1);

            // Se establece la fuente para los datos de los productos.
            $pdf->setFont('Arial', '', 13);
            $pdf->SetTextColor(0, 0, 0);

            // Se recorren los registros fila por fila.
            foreach ($dataProductos as $rowProducto) {
                $pdf->cell(70, 10, $pdf->encodeString($rowProducto['descripcion_producto']), 'TB', 0, 'C');
                $pdf->cell(70, 10,  $pdf->encodeString($rowProducto['horario_producto']), 'TB', 0, 'C');
                $pdf->cell(50, 10,  '$'. $pdf->encodeString($rowProducto['precio_producto']), 'TB', 1, 'C');
            }
        } else {
            $pdf->cell(0, 10, $pdf->encodeString('No hay productos de este dia '), 1, 1);
        }
        // Se llama implícitamente al método footer() y se envía el documento al navegador web.
        $pdf->output('I', 'Producto Pedidos.pdf');
    } else {
        print('Dia incorrecto');
    }
} else {
    print('Debe seleccionar un dia');
}
