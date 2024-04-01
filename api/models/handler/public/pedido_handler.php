<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de las tablas PEDIDO y DETALLE_PEDIDO.
*/
class PedidoHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id_pedido = null;
    protected $id_detalle = null;
    protected $cliente = null;
    protected $producto = null;
    protected $cantidad = null;
    protected $estado = null;

    /*
    *   ESTADOS DEL PEDIDO
    *   Pendiente (valor por defecto en la base de datos). Pedido en proceso y se puede modificar el detalle.
    *   Finalizado. Pedido terminado por el cliente y ya no es posible modificar el detalle.
    *   Entregado. Pedido enviado al cliente.
    *   Anulado. Pedido cancelado por el cliente después de ser finalizado.
    */

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    // Método para verificar si existe un pedido en proceso con el fin de iniciar o continuar una compra.
    public function searchRows($value)
    {
        $value = ($value === '') ? '%%' : '%' . $value . '%';

        $sql = 'SELECT id_cliente,id_detalle, id_modelo_talla,estado_pedido,
                descripcion_marca,descripcion_modelo,descripcion_talla,
                precio_modelo_talla, cantidad_detalle_pedido,foto_modelo,
                DATE_FORMAT(fecha_pedido, "%d-%m-%Y - %h:%i %p") AS fecha_pedido
                FROM prc_detalle_pedidos
                INNER JOIN prc_pedidos USING(id_pedido)
                INNER JOIN prc_modelo_tallas USING(id_modelo_talla)
                INNER JOIN ctg_tallas USING(id_talla)
                INNER JOIN prc_modelos USING(id_modelo)
                INNER JOIN ctg_marcas USING(id_marca)
                INNER JOIN prc_clientes USING(id_cliente)
                WHERE id_cliente =? AND estado_pedido!="Pendiente" AND estado_pedido!="Anulado"
                AND CONCAT(descripcion_marca," ",descripcion_modelo," ",descripcion_talla) like ?';

        $params = array($_SESSION['idCliente'],$value);
        return Database::getRows($sql, $params);
    }

    public function getOrder()
    {
        $this->estado = 'Pendiente';
        $sql = 'SELECT id_pedido FROM prc_pedidos
         WHERE estado_pedido = ? AND id_cliente = ?';

        $params = array($this->estado, $_SESSION['idCliente']);
        if ($data = Database::getRow($sql, $params)) {
            $_SESSION['idPedido'] = $data['id_pedido'];
            return true;
        } else {
            return false;
        }
    }

    // Método para iniciar un pedido en proceso.
    public function startOrder()
    {
        if ($this->getOrder()) {
            return true;
        } else {
            $sql = 'INSERT INTO prc_pedidos(id_cliente,forma_pago_pedido,fecha_pedido,estado_pedido)
                    VALUES(?,?,now(),"Pendiente")';
            $params = array($_SESSION['idCliente'],"Efectivo");
            // Se obtiene el ultimo valor insertado de la llave primaria en la tabla pedido.
            if ($_SESSION['idPedido'] = Database::getLastRow($sql, $params)) {
                return true;
            } else {
                return false;
            }
        }
    }

    // Método para agregar un producto al carrito de compras.
    public function createDetail()
    {
        // Se realiza una subconsulta para obtener el precio del producto.

        $sql = 'INSERT INTO prc_detalle_pedidos(id_modelo_talla, cantidad_detalle_pedido, id_pedido)
                VALUES(?, ?, ?)';
        $params = array($this->producto, $this->cantidad, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para obtener los productos que se encuentran en el carrito de compras.
    public function readDetail()
    {
        $sql = 'SELECT id_detalle, id_modelo_talla, foto_modelo,
        descripcion_marca,descripcion_modelo,descripcion_talla,
                precio_modelo_talla, cantidad_detalle_pedido
                FROM prc_detalle_pedidos
                INNER JOIN prc_pedidos USING(id_pedido)
                INNER JOIN prc_modelo_tallas USING(id_modelo_talla)
                INNER JOIN ctg_tallas USING(id_talla)
                INNER JOIN prc_modelos USING(id_modelo)
                INNER JOIN ctg_marcas USING(id_marca)
                WHERE id_pedido = ?';
        $params = array($_SESSION['idPedido']);
        return Database::getRows($sql, $params);
    }

    // Método para finalizar un pedido por parte del cliente.
    public function finishOrder()
    {
        $this->estado = 'Finalizado';
        $sql = 'UPDATE prc_pedidos
                SET estado_pedido = ?
                WHERE id_pedido = ?';
        $params = array($this->estado, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para actualizar la cantidad de un producto agregado al carrito de compras.
    public function updateDetail()
    {
        //echo $this->cantidad." ".$this->id_detalle." ".$_SESSION['idPedido'];
        $sql = 'UPDATE prc_detalle_pedidos
                SET cantidad_detalle_pedido = ?
                WHERE id_detalle = ? AND id_pedido = ?';
        $params = array($this->cantidad, $this->id_detalle, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar un producto que se encuentra en el carrito de compras.
    public function deleteDetail()
    {
        $sql = 'DELETE FROM prc_detalle_pedidos
                WHERE id_detalle = ? AND id_pedido = ?';
        $params = array($this->id_detalle, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }
}
