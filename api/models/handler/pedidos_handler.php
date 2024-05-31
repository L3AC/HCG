<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class PedidoHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $id_cliente = null;
    protected $id_producto = null;
    protected $cantidad = null;

    protected $nombre = null;
    protected $descripcion = null;
    protected $precio = null;
    protected $existencias = null;
    protected $imagen = null;
    protected $categoria = null;
    protected $estado = null;
    protected $search = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/modelos/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    public function searchRows()
    {
        $this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';

        $sql = 'SELECT id_pedido,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        id_cliente,correo_cliente,codigo_pedido,
        DATE_FORMAT(fecha_pedido, "%h:%i %p - %e %b %Y") AS fecha,estado_pedido
        FROM tb_pedidos 
        INNER JOIN tb_clientes USING(id_cliente)
        WHERE estado_pedido = ? AND
        CONCAT(nombre_cliente," ",apellido_cliente) LIKE ?
        ORDER BY fecha_pedido DESC';
        $params = array($this->estado,$this->search);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO tb_modelos(descripcion_modelo, id_marca, foto_modelo, estado_modelo)
                VALUES(?, ?, ?, ?)';
        $params = array($this->descripcion, $this->id, $this->imagen, $this->estado);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_pedido,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        id_cliente,correo_cliente,codigo_pedido,
        DATE_FORMAT(fecha_pedido, "%h:%i %p - %e %b %Y") AS fecha,estado_pedido
        FROM tb_pedidos 
        INNER JOIN tb_clientes USING(id_cliente)
        WHERE estado_pedido = "Pendiente"
        ORDER BY fecha_pedido DESC;';
        return Database::getRows($sql);
    }
    public function readsubAll()
    {
        $sql = 'select mt.id_producto,mt.id_talla,mt.id_modelo,
        mt.stock_modelo_talla,mt.precio_modelo_talla,t.descripcion_talla as talla
        from tb_modelo_tallas mt 
        INNER JOIN ctg_tallas t USING(id_talla)
        INNER JOIN tb_modelos m USING(id_modelo)
        WHERE mt.id_modelo = ?
        ORDER BY t.descripcion_talla';
        //echo $this->idModelo. ' que';
        $params = array($this->id);

        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT id_pedido,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        DATE_FORMAT(fecha_pedido, "%h:%i %p - %e %b %Y") AS fecha,estado_pedido
        FROM tb_pedidos 
        INNER JOIN tb_clientes USING(id_cliente)
        WHERE id_pedido=?';
        $params = array($this->id);
        $data = Database::getRow($sql, $params);
        //$_SESSION['idmod'] = $data['id_modelo'];

        return $data;
    }

    public function readFilename()
    {
        $sql = 'SELECT foto
                FROM tb_modelos
                WHERE id_modelo = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_pedidos
                WHERE id_pedido = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
    public function confirmRow()
    {
        $sql = 'UPDATE tb_pedidos SET estado_pedido = "Finalizado"
                WHERE id_pedido = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function getOrder()
    {
        $this->estado = 'Pendiente';
        $sql = 'SELECT id_pedido FROM tb_pedidos
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
            $sql = 'INSERT INTO tb_pedidos(id_pedido,id_cliente,fecha_pedido,codigo_pedido,estado_pedido)
                    VALUES((SELECT get_next_id("tb_pedidos")),?,now(),generar_codigo(),"Pendiente")';
            $params = array($_SESSION['idCliente']);
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

        $sql = 'select * from tb_detalle_pedidos
        WHERE id_pedido=? AND id_producto=?;';
        $params = array($_SESSION['idPedido'], $this->id_producto);
        $result = Database::getRow($sql, $params);
        $mensaje = null;

        if ($result) {
            $this->cantidad = $this->cantidad + $result['cantidad_pedido'];
            if ($this->cantidad < 7) {
                $sql = 'UPDATE tb_detalle_pedidos 
                SET cantidad_pedido= ? WHERE id_detalle_pedido=?';
                $params = array($this->cantidad, $result['id_detalle_pedido']);
                if (Database::executeRow($sql, $params)) {
                    $mensaje = 1;
                    //$mensaje = 'Registro exitoso';
                }
            } else {
                $mensaje = 2;
                //$mensaje = 'Solo se permite tener 3 existencias por producto';
            }
        } else {

            $sql = 'INSERT INTO tb_detalle_pedidos(id_producto, cantidad_pedido, id_pedido)
                VALUES(?, ?, ?)';
            $params = array($this->id_producto, $this->cantidad, $_SESSION['idPedido']);
            if (Database::executeRow($sql, $params)) {
                $mensaje = 1;
                //$mensaje = 'Registro exitoso';
            }
        }
        return $mensaje;
    }

    // Método para obtener los productos que se encuentran en el carrito de compras.
    public function readDetail()
    {
        $sql = 'select id_producto,id_cliente,id_pedido,precio_producto,cantidad_pedido,imagen_producto,descripcion_producto
        from tb_detalle_pedidos
        INNER JOIN tb_pedidos USING(id_pedido)
        INNER JOIN tb_productos USING(id_producto)
        WHERE id_pedido = ?';
        $params = array($_SESSION['idPedido']);
        return Database::getRows($sql, $params);
    }

    public function getOrderM()
    {
        $this->estado = 'Pendiente';
        $sql = 'SELECT id_pedido FROM tb_pedidos
            WHERE estado_pedido = ? AND id_cliente = ?';

        $params = array($this->estado, $this->id_cliente);
        $data = Database::getRow($sql, $params);

        if ($data) {
            return $data['id_pedido'];
        } else {
            return null;
        }
    }

    public function startOrderM()
    {
        if ($this->getOrderM()) {
            return true;
        } else {
            $sql = 'INSERT INTO tb_pedidos(id_cliente, forma_pago_pedido, fecha_pedido, estado_pedido)
                VALUES (?, ?, now(), "Pendiente")';
            $params = array($this->id_cliente, "Efectivo");

            if ($idPedido = Database::getLastRow($sql, $params)) {
                return $idPedido;
            } else {
                return null;
            }
        }
    }

    public function createDetailM()
    {
        $clientId = $this->id_cliente;
        $idProducto = $this->id_producto;
        $cantidadProducto = $this->cantidad;

        $idPedido = $this->getOrderM($clientId);
        $mensaje = null;

        if ($idPedido) {
            $sql = 'SELECT * FROM tb_detalle_pedidos
                WHERE id_pedido = ? AND id_producto = ?';
            $params = array($idPedido, $idProducto);
            $result = Database::getRow($sql, $params);

            if ($result) {
                $cantidad = $cantidadProducto + $result['cantidad_detalle_pedido'];
                if ($cantidad < 4) {
                    $sql = 'UPDATE tb_detalle_pedidos 
                        SET cantidad_detalle_pedido = ? WHERE id_detalle = ?';
                    $params = array($cantidad, $result['id_detalle']);
                    if (Database::executeRow($sql, $params)) {
                        $mensaje = array('status' => 1, 'idPedido' => $idPedido);
                    }
                } else {
                    $mensaje = array('status' => 2);
                }
            } else {
                $sql = 'INSERT INTO tb_detalle_pedidos(id_producto, cantidad_detalle_pedido, id_pedido)
                    VALUES (?, ?, ?)';
                $params = array($idProducto, $cantidadProducto, $idPedido);
                if (Database::executeRow($sql, $params)) {
                    $mensaje = array('status' => 1, 'idPedido' => $idPedido);
                }
            }
        }

        return $mensaje;
    }


    // Método para finalizar un pedido por parte del cliente.
    public function finishOrder()
    {
        $this->estado = 'Finalizado';
        $sql = 'UPDATE tb_pedidos
                SET estado_pedido = ?
                WHERE id_pedido = ?';
        $params = array($this->estado, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para actualizar la cantidad de un producto agregado al carrito de compras.
    /*public function updateDetail()
    {
        //echo $this->cantidad." ".$this->id_detalle." ".$_SESSION['idPedido'];
        $sql = 'UPDATE tb_detalle_pedidos
                SET cantidad_detalle_pedido = ?
                WHERE id_detalle = ? AND id_pedido = ?';
        $params = array($this->cantidad, $this->id_detalle, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar un producto que se encuentra en el carrito de compras.
    public function deleteDetail()
    {
        $sql = 'DELETE FROM tb_detalle_pedidos
                WHERE id_detalle = ? AND id_pedido = ?';
        $params = array($this->id_detalle, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }*/
}
