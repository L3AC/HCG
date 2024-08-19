
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
            $pdf->startReport('Cliente: ' . $rowCliente['nombre_cliente'] . ' ' . $rowCliente['apellido_cliente']);

            // Descripción del reporte
            $pdf->setFont('Arial', '', 16);
            $pdf->write(6, $pdf->encodeString('A continuación, se mostraran los datos de los pedidos realizados por el cliente. '));
            // Espacio
            $pdf->ln(10);
            // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
            if ($dataClientes = $cliente->readPedidosClienteID()) {
                // Se establece un color de relleno para los encabezados.
                $pdf->setFillColor(155, 119, 74);
                $pdf->SetTextColor(255, 255, 255);
                // Se establece la fuente para los encabezados.
                $pdf->setFont('Arial', 'B', 14);

                // Se imprimen las celdas con los encabezados.
                $pdf->cell(40, 10, 'Codigo', 'B', 0, 'C', 1);
                $pdf->cell(30, 10, 'Cantidad', 'B', 0, 'C', 1);
                $pdf->cell(50, 10, 'Fecha', 'B', 0, 'C', 1);
                $pdf->cell(70, 10, 'Productos solicitados', 'B', 1, 'C', 1);

                // Se establece la fuente para los datos de los productos.
                $pdf->setFont('Arial', '', 13);
                $pdf->SetTextColor(0, 0, 0);

                // Se recorren los registros fila por fila.
                foreach ($dataClientes as $rowPedido) {
                    // Imprimir la primera celda
                    $pdf->cell(40, 10, $pdf->encodeString($rowPedido['codigoPedido']), 0, 0, 'C');
                    // Imprimir la celda de cantidad
                    $pdf->cell(30, 10, $pdf->encodeString($rowPedido['cantidad_productos_pedidos']), 0, 0, 'C');
                    // Imprimir la celda de fecha
                    $pdf->cell(50, 10, $pdf->encodeString($rowPedido['fecha_registro']), 0, 0, 'C');

                    // Imprimir la celda de productos solicitados con MultiCell
                    $pdf->MultiCell(65, 10, $pdf->encodeString($rowPedido['productos_pedidos']), 0, 'C');
                    // Ajusta la posición de la siguiente fila después de usar MultiCell
                    $pdf->SetXY($pdf->GetX(), $pdf->GetY()); // Mantén la posición actual después de MultiCell
                    // Opcional: Imprime un borde al final de la fila
                    $pdf->Cell(0, 10, '', 'T', 1); // Línea de separación al final de la fila
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