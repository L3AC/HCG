<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se verifica si existe un valor para el cliente, de lo contrario se muestra un mensaje.
if (isset($_GET['idCliente'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../models/data/clientes_data.php');
    require_once('../../models/data/pedidos_data.php');
    // Se instancian las entidades correspondientes.
    $cliente = new ClienteData;
    $pedido = new PedidoData;
    // Se establece el valor del cliente, de lo contrario se muestra un mensaje.
    if ($cliente->setId($_GET['idCliente']) && $pedido->setIdCliente($_GET['idCliente'])) {
        // Se verifica si el cliente existe, de lo contrario se muestra un mensaje.
        if ($rowCliente = $cliente->readOne()) {
            // Se inicia el reporte con el encabezado del documento.
            $pdf->startReport('Cliente: ' . $rowCliente['nombre_cliente'] . $rowCliente['apellido_cliente']);

            // Descripción del reporte
            $pdf->setFont('Arial', '', 11);
            $pdf->write(6, $pdf->encodeString('A continuación, se mostraran los datos de los pedidos realizados por.'));
            // Espacio
            $pdf->ln(8);
            // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
            if ($dataPedidos = $pedido->readPedidosClienteID()) {
                // Se establece un color de relleno para los encabezados.
                $pdf->setFillColor(155, 119, 74);
                $pdf->SetTextColor(225, 225, 225);
                // Se establece la fuente para los encabezados.
                $pdf->setFont('Arial', 'B', 16);

                // Se imprimen las celdas con los encabezados.
                $pdf->cell(40, 10, 'Codigo del pedido', 'B', 0, 'C', 1);
                $pdf->cell(60, 10, 'Productos solicitados', 'B', 0, 'C', 1);
                $pdf->cell(40, 10, 'Cantidad', 'B', 0, 'C', 1);
                $pdf->cell(40, 10, 'Fecha', 'B', 1, 'C', 1);

                // Se establece la fuente para los datos de los productos.
                $pdf->setFont('Arial', '', 15);
                $pdf->SetTextColor(0, 0, 0);

                // Se recorren los registros fila por fila.
                foreach ($dataPedidos as $rowPedido) {
                    $pdf->cell(90, 10, $pdf->encodeString($rowPedido['codigoPedido']), 'TB', 0, 'C');
                    $pdf->cell(60, 10, $pdf->encodeString($rowPedido['productos_pedidos']), 'TB', 0, 'C');
                    $pdf->cell(40, 10, $pdf->encodeString($rowPedido['cantidad_productos_pedidos']), 'TB', 0, 'C');
                    $pdf->cell(40, 10, $pdf->encodeString($rowPedido['fecha_registro']), 'TB', 1, 'C');
                }
            } else {
                $pdf->cell(0, 10, $pdf->encodeString('No hay pedidos de este cliente'), 1, 1);
            }
            // Se llama implícitamente al método footer() y se envía el documento al navegador web.
            $pdf->output('I', 'Cliente Pedidos.pdf');
        } else {
            print ('Cliente inexistente');
        }
    } else {
        print ('Cliente incorrecto');
    }
} else {
    print ('Debe seleccionar un cliente');
}
