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
    protected $nombre = null;
    protected $descripcion = null;
    protected $precio = null;
    protected $existencias = null;
    protected $imagen = null;
    protected $categoria = null;
    protected $estado = null;

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
        $sql = 'INSERT INTO prc_modelos(descripcion_modelo, id_marca, foto_modelo, estado_modelo)
                VALUES(?, ?, ?, ?)';
        $params = array($this->descripcion, $this->id, $this->imagen, $this->estado);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT p.id_pedido,CONCAT(c.nombre_cliente," ",c.apellido_cliente) as cliente,
        p.forma_pago_pedido,DATE_FORMAT(p.fecha_pedido, "%d-%m-%Y") AS fecha,p.estado_pedido
        FROM prc_pedidos p
        INNER JOIN prc_clientes c USING(id_cliente)
        ORDER BY p.fecha_pedido DESC, p.estado_pedido DESC';
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
        $sql = 'SELECT p.id_pedido,CONCAT(c.nombre_cliente," ",c.apellido_cliente) as cliente,
        p.forma_pago_pedido,DATE_FORMAT(p.fecha_pedido, "%d-%m-%Y") AS fecha,p.estado_pedido
        from prc_pedidos p
        inner join prc_clientes c USING(id_cliente)
        WHERE p.id_pedido =?';
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
