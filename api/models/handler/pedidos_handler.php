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
    protected $nota = null;
    protected $clave = null;
    protected $descripcion = null;
    protected $categoria = null;
    protected $estado = null;
    protected $search = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/modelos/';

    /*
     *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    // Método para buscar pedidos basado en criterios de búsqueda.
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
        $params = array($this->estado, $this->search);
        return Database::getRows($sql, $params);
    }

    // Método para buscar pedidos por cliente.
    public function searchByCliente()
    {
        $this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';

        $sql = 'SELECT id_pedido,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        id_cliente,correo_cliente,codigo_pedido,
        DATE_FORMAT(fecha_pedido, "%h:%i %p - %e %b %Y") AS fecha,estado_pedido
        FROM tb_pedidos 
        INNER JOIN tb_clientes USING(id_cliente)
        WHERE estado_pedido = ? AND
        codigo_pedido LIKE ? AND id_cliente = ?
        ORDER BY fecha_pedido DESC';
        $params = array($this->estado, $this->search, $_SESSION['idCliente']);
        return Database::getRows($sql, $params);
    }

    // Método para obtener todos los pedidos pendientes.
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

    public function readEstadoPedidos()
    {
        $sql = 'SELECT CONCAT(c.nombre_cliente, " " ,c.apellido_cliente) AS Nombre, p.fecha_pedido, p.codigo_pedido, p.estado_pedido
                FROM tb_pedidos p
                JOIN tb_clientes c ON p.id_cliente = c.id_cliente
                WHERE estado_pedido = "Finalizado"
                ORDER BY p.fecha_pedido DESC;';
        return Database::getRows($sql);
    }

    public function readEstadosTodosPedidos()
    {
        $sql = 'SELECT estado_pedido, COUNT(*) AS cantidad_pedidos
                FROM tb_pedidos
                GROUP BY estado_pedido;';
        return Database::getRows($sql);
    }

    // Método para obtener todos los detalles de un pedido específico.
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

    // Método para obtener un pedido específico por su ID.
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

    // Método para obtener el nombre de un archivo asociado a un pedido (actualmente no usado en el código proporcionado).
    public function readFilename()
    {
        $sql = 'SELECT foto
                FROM tb_modelos
                WHERE id_modelo = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Método para eliminar un pedido por su ID.
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_pedidos
                WHERE id_pedido = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para confirmar la finalización de un pedido.
    public function confirmRow()
    {
        $sql = 'UPDATE tb_pedidos SET estado_pedido = "Finalizado"
                WHERE id_pedido = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para obtener el ID de un pedido en curso.
    public function getOrder()
    {
        $this->estado = 'No escogido';
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
            $sql = 'INSERT INTO tb_pedidos(id_pedido, id_cliente, fecha_pedido, codigo_pedido, estado_pedido)
                VALUES((SELECT get_next_id("tb_pedidos")), ?, now(), generar_codigo(), "No escogido")';
            $params = array($_SESSION['idCliente']);

            if (Database::executeRow($sql, $params)) {
                $sql = 'SELECT id_pedido FROM tb_pedidos
                ORDER BY id_pedido DESC LIMIT 1;';
                $params = array();

                if ($data = Database::getRow($sql, $params)) {
                    $_SESSION['idPedido'] = $data['id_pedido'];
                    return true;
                } else {
                    return false;
                }
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
                SET cantidad_pedido= ?, nota_pedido=? WHERE id_detalle_pedido=?';
                $params = array($this->cantidad, $this->nota, $result['id_detalle_pedido']);
                if (Database::executeRow($sql, $params)) {
                    $mensaje = 1;
                    //$mensaje = 'Registro exitoso';
                }
            } else {
                $mensaje = 2;
                //$mensaje = 'Solo se permite tener 3 existencias por producto';
            }
        } else {

            $sql = 'INSERT INTO tb_detalle_pedidos(id_detalle_pedido, id_producto, cantidad_pedido, nota_pedido,id_pedido)
                VALUES((SELECT get_next_id("tb_detalle_pedidos")), ?, ?,?, ?)';
            $params = array($this->id_producto, $this->cantidad, $this->nota, $_SESSION['idPedido']);
            if (Database::executeRow($sql, $params)) {
                $mensaje = 1;
                //$mensaje = 'Registro exitoso';
            }
        }
        return $mensaje;
    }

    /*public function getOrder()
    {
        $this->estado = 'No escogido';
        $sql = 'SELECT id_pedido FROM tb_pedidos WHERE estado_pedido = ? AND id_cliente = ?';
        $params = array($this->estado, $_SESSION['idCliente']);
    
        $data = Database::getRow($sql, $params);
        if ($data) {
            $_SESSION['idPedido'] = $data['id_pedido'];
            return true;
        } else {
            error_log('No se encontró un pedido con el estado "No escogido" para el cliente con ID ' . $_SESSION['idCliente']);
            return false;
        }
    }
    
    
    public function startOrder()
{
    // Verificar si existe un pedido actual en la sesión
    if ($this->getOrder()) {
        return true;
    } else {
        // Intentar crear un nuevo pedido
        $sql = 'INSERT INTO tb_pedidos(id_pedido, id_cliente, fecha_pedido, codigo_pedido, estado_pedido)
                VALUES((SELECT get_next_id("tb_pedidos")), ?, now(), generar_codigo(), "No escogido")';
        $params = array($_SESSION['idCliente']);

        // Registrar el intento de inserción
        error_log('Intentando insertar un nuevo pedido para el cliente con ID ' . $_SESSION['idCliente']);

        // Verificar si la inserción fue exitosa
        if (Database::executeRow($sql, $params)) {
            // Obtener el último ID insertado utilizando la función propia de MariaDB/MySQL
            $sql = 'SELECT LAST_INSERT_ID() as id_pedido';
            $data = Database::getRow($sql);
            if ($data && isset($data['id_pedido']) && $data['id_pedido'] != 0) {
                $_SESSION['idPedido'] = $data['id_pedido'];
                error_log('Nuevo pedido creado con ID ' . $_SESSION['idPedido']);
                return true;
            } else {
                error_log('Error al obtener el último ID insertado para el pedido. Datos devueltos: ' . print_r($data, true));
                return false;
            }
        } else {
            error_log('Error al insertar el pedido en la base de datos. SQL: ' . $sql . ' Params: ' . print_r($params, true));
            return false;
        }
    }
}


public function createDetail()
{
    // Verificar que idPedido está presente y válido
    if (!isset($_SESSION['idPedido']) || $_SESSION['idPedido'] == 0) {
        error_log('No hay un idPedido válido en la sesión');
        return 'No hay un idPedido válido en la sesión';
    }

    $sql = 'SELECT * FROM tb_detalle_pedidos WHERE id_pedido = ? AND id_producto = ?';
    $params = array($_SESSION['idPedido'], $this->id_producto);
    $result = Database::getRow($sql, $params);
    $mensaje = null;

    if ($result) {
        $this->cantidad += $result['cantidad_pedido'];
        if ($this->cantidad < 7) {
            $sql = 'UPDATE tb_detalle_pedidos SET cantidad_pedido = ? WHERE id_detalle_pedido = ?';
            $params = array($this->cantidad, $result['id_detalle_pedido']);
            if (Database::executeRow($sql, $params)) {
                $mensaje = 1;
            }
        } else {
            $mensaje = 2;
        }
    } else {
        $sql = 'INSERT INTO tb_detalle_pedidos(id_detalle_pedido, id_producto, cantidad_pedido, id_pedido)
                VALUES((SELECT get_next_id("tb_detalle_pedidos")), ?, ?, ?)';
        $params = array($this->id_producto, $this->cantidad, $_SESSION['idPedido']);
        if (Database::executeRow($sql, $params)) {
            $mensaje = 1;
        }
    }
    return $mensaje;
}*/



    // Método para obtener los productos que se encuentran en el carrito de compras.
    public function readDetail()
    {
        $sql = 'CALL sp_verificar_y_obtener_detalles_pedido(); ';
        $params = array();
        Database::getRow($sql, $params);

        $sql = 'select id_detalle_pedido,id_producto,id_cliente,id_pedido,precio_producto,
        cantidad_pedido,imagen_producto,descripcion_producto
        from tb_detalle_pedidos
        INNER JOIN tb_pedidos USING(id_pedido)
        INNER JOIN tb_productos USING(id_producto)
        WHERE id_pedido = ?';
        $params = array($_SESSION['idPedido']);
        return Database::getRows($sql, $params);
    }

    // Método para obtener un pedido pendiente por parte del cliente.
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

    // Método para iniciar un nuevo pedido por parte del cliente si no hay uno pendiente.
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

    // Método para crear un detalle de pedido más complejo (actualmente no se usa en el código proporcionado).
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
        $this->estado = 'Pendiente';
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

    // Método para generar reporte : Cantidad de pedidos por un cliente
    public function readPedidosClienteID()
    {
        $sql = 'SELECT p.id_pedido, p.fecha_pedido AS fecha_registro, c.nombre_cliente, p.codigo_pedido AS codigoPedido, GROUP_CONCAT(DISTINCT pr.descripcion_producto ORDER BY pr.descripcion_producto ASC SEPARATOR ", ") AS productos_pedidos, SUM(dp.cantidad_pedido) AS cantidad_productos_pedidos
                    FROM tb_pedidos p
                    INNER JOIN tb_clientes c ON p.id_cliente = c.id_cliente
                    INNER JOIN tb_detalle_pedidos dp ON p.id_pedido = dp.id_pedido
                    INNER JOIN tb_productos pr ON dp.id_producto = pr.id_producto
                    WHERE c.id_cliente = ?
                    GROUP BY p.id_pedido, p.fecha_pedido, c.nombre_cliente, p.codigo_pedido;
            ';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }
}
