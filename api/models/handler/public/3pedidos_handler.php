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
    protected $id_producto = null;
    protected $id_cliente = null;
    protected $nota = null;
    protected $estado = null;
    protected $codigo = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $telefono = null;
    protected $correo = null;

    protected $descripcion = null;
    protected $precio = null;
    protected $existencias = null;
    protected $imagen = null;
    protected $categoria = null;


    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/modelos/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    public function getOrder()
    {
        $this->estado = 'Pendiente';
        $sql = 'SELECT id_pedido FROM tb_pedidos
         WHERE estado_pedido = ? AND id_cliente = ?';

        $params = array($this->estado, $_SESSION['id_cliente']);
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
            $params = array($_SESSION['id_cliente']);
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

            $sql = 'INSERT INTO tb_detalle_pedidos(id_detalle_pedido,id_producto, cantidad_pedido,nota_pedido, id_pedido)
                VALUES((SELECT get_next_id("tb_detalle_pedidos")),?, ?,?, ?)';
            $params = array($this->id_producto, $this->cantidad,$this->nota, $_SESSION['idPedido']);
            if (Database::executeRow($sql, $params)) {
                $mensaje = 1;
                //$mensaje = 'Registro exitoso';
            }
        }
        return $mensaje;
    }

    public function searchRows($value)
    {
        if ($value === '') {
            $value = '%%';
        } else {
            $value = '%' . $value . '%';
        }

        $sql = 'SELECT p.id_pedido,CONCAT(c.nombre_cliente," ",c.apellido_cliente) as cliente,
        p.forma_pago_pedido,DATE_FORMAT(p.fecha_pedido, "%d-%m-%Y") AS fecha,p.estado_pedido
        FROM prc_pedidos p
        INNER JOIN prc_clientes c USING(id_cliente)
        WHERE CONCAT(c.nombre_cliente,c.apellido_cliente) LIKE ?
        ORDER BY p.fecha_pedido DESC, p.estado_pedido DESC';

        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        // Verificar si el cliente existe
        $sql = 'SELECT id_cliente FROM tb_clientes WHERE telefono_cliente = ? 
        OR correo_cliente = ?;';
        $params = array($this->telefono, $this->correo);
        $result = Database::getRow($sql, $params);
        $id_cliente=null;
        if ($result) {
            // El cliente ya existe, obtener su ID
            $id_cliente = $result['id_cliente'];
        } else {
            // El cliente no existe, crear nuevo cliente y obtener su ID
            $sql = 'INSERT INTO tb_clientes (id_cliente,usuario_cliente,clave_cliente,telefono_cliente, correo_cliente, nombre_cliente, apellido_cliente)
                VALUES ((SELECT get_next_id("tb_clientes")),"deafult","deafult",?, ?, ?, ?);';
            $params = array($this->telefono, $this->correo, $this->nombre, $this->apellido);
            Database::executeRow($sql, $params);
            $sql = 'SELECT IFNULL(MAX(id_cliente), 0) as id_cliente FROM tb_clientes;';
            $result = Database::getRow($sql);
            $id_cliente = $result['id_cliente'];
        }
        // Insertar el pedido
        $sql = 'INSERT INTO tb_pedidos (id_pedido,id_cliente, fecha_pedido, codigo_pedido, estado_pedido)
            VALUES ((SELECT get_next_id("tb_pedidos")),?, now(), generar_codigo(), "Pendiente");';
        $params = array($id_cliente);
        Database::executeRow($sql, $params);

        $sql = 'SELECT IFNULL(MAX(id_pedido), 0) as id_pedido FROM tb_pedidos;';
        $result = Database::getRow($sql);

        return $result['id_pedido'];
    }

}
