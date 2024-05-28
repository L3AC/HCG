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
    protected $idCliente = null;
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

    public function readAll()
    {
        $sql = 'SELECT id_pedido,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        DATE_FORMAT(fecha_pedido, "%h:%i %p - %e %b %Y") AS fecha,estado_pedido
        FROM tb_pedidos 
        INNER JOIN tb_clientes USING(id_cliente)
        WHERE estado_pedido = "Pendiente"
        ORDER BY fecha_pedido DESC;';
        return Database::getRows($sql);
    }
    public function readsubAll()
    {
        $sql = 'select mt.id_modelo_talla,mt.id_talla,mt.id_modelo,
        mt.stock_modelo_talla,mt.precio_modelo_talla,t.descripcion_talla as talla
        from prc_modelo_tallas mt 
        INNER JOIN ctg_tallas t USING(id_talla)
        INNER JOIN prc_modelos m USING(id_modelo)
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
                FROM prc_modelos
                WHERE id_modelo = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE prc_modelos 
                SET foto_modelo = ?, descripcion_modelo = ?,estado_modelo = ?, id_marca = ?
                WHERE id_modelo = ?';
        $params = array($this->imagen, $this->nombre, $this->estado, $this->categoria, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM prc_modelos
                WHERE id_modelo = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function readProductosCategoria()
    {
        $sql = 'SELECT mo.id_modelo, mo.descripcion,mo.foto, mo.estado,ma.descripcion as marca
        FROM prc_modelos mo
        INNER JOIN ctg_marcas ma USING(id_marca)
        WHERE mo.id_marca LIKE ? OR estado="A"
        ORDER BY mo.descripcion';
            /*'SELECT id_producto, imagen_producto, nombre_producto, descripcion_producto, precio_producto, existencias_producto
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                WHERE id_categoria = ? AND estado_producto = true
                ORDER BY nombre_producto'*/;
        $params = array($this->categoria);
        return Database::getRows($sql, $params);
    }

    /*
    *   Métodos para generar gráficos.
    */
    public function cantidadProductosCategoria()
    {
        $sql = 'SELECT nombre_categoria, COUNT(id_producto) cantidad
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                GROUP BY nombre_categoria ORDER BY cantidad DESC LIMIT 5';
        return Database::getRows($sql);
    }

    public function porcentajeProductosCategoria()
    {
        $sql = 'SELECT nombre_categoria, ROUND((COUNT(id_producto) * 100.0 / (SELECT COUNT(id_producto) FROM producto)), 2) porcentaje
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                GROUP BY nombre_categoria ORDER BY porcentaje DESC';
        return Database::getRows($sql);
    }

    /*
    *   Métodos para generar reportes.
    */
    public function productosCategoria()
    {
        $sql = 'SELECT nombre_producto, precio_producto, estado_producto
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                WHERE id_categoria = ?
                ORDER BY nombre_producto';
        $params = array($this->categoria);
        return Database::getRows($sql, $params);
    }
}
