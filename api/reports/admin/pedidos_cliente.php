<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se verifica si existe un valor para el cliente, de lo contrario se muestra un mensaje.
if (isset($_GET['idCliente'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../models/data/8clientes_data.php');
    require_once('../../models/data/4pedidos_data.php');
    // Se instancian las entidades correspondientes.
    $cliente = new ClienteData;
    $pedido = new PedidoData;
    // Se establece el valor de la categoría, de lo contrario se muestra un mensaje.
    if ($cliente->setId($_GET['idCliente']) && $pedido->setIdCliente($_GET['idCliente'])) {
        // Se verifica si la categoría existe, de lo contrario se muestra un mensaje.
        if ($rowOne = $cliente->readOne()) {
            // Se inicia el reporte con el encabezado del documento.
            $pdf->startReport('Pedidos realizados de ' . $rowOne['nombre']);
            // Ajustar los márgenes a 1.5 cm
            $pdf->setMargins(15, 0, 15);
            // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
            if ($dataP = $pedido->searchByClienteR()) {
                // Se establece un color de relleno para los encabezados.
                $pdf->setFillColor(204, 200, 170);
                // Se establece la fuente para los encabezados.
                $pdf->setFont('Arial', 'B', 11);
                // Se imprimen las celdas con los encabezados.
                $pdf->cell(62, 10, 'Fecha', 'B', 0, 'C', 1);
                $pdf->cell(62, 10, 'Forma pago', 'B', 0, 'C', 1);
                $pdf->cell(62, 10, 'Estado', 'B', 1, 'C', 1);
                // Se establece la fuente para los datos de los productos.
                $pdf->setFont('Arial', '', 11);
                // Se recorren los registros fila por fila.
                foreach ($dataP as $rowP) {
                    //($rowP['estado_producto']) ? $estado = 'Activo' : $estado = 'Inactivo';
                    // Se imprimen las celdas con los datos de los productos.
                    $pdf->cell(62, 10, $pdf->encodeString($rowP['fecha']), 'TB', 0, 'C');
                    $pdf->cell(62, 10, $pdf->encodeString($rowP['forma_pago_pedido']), 'TB', 0, 'C');
                    $pdf->cell(62, 10, $pdf->encodeString($rowP['estado_pedido']), 'TB', 1, 'C');
                }
            } else {
                $pdf->cell(0, 10, $pdf->encodeString('No ha realizado pedidos'), 1, 1);
            }
            // Se llama implícitamente al método footer() y se envía el documento al navegador web.
            $pdf->output('I', 'categoria.pdf');
        } else {
            print('Cliente inexistente');
        }
    } else {
        print('Cliente incorrecta');
    }
} else {
    print('Debe seleccionar un cliente');
}
