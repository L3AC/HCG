<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class ItemHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $idProducto = null;
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
        $value = ($value === '') ? '%%' : '%' . $value . '%';

        $sql = 'SELECT id_item, descripcion_item, estado_item
                FROM tb_items
                WHERE descripcion_item LIKE  ? 
                ORDER BY CAST(descripcion_item AS UNSIGNED)';

        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO tb_items(descripcion_item, estado_item)
                VALUES(?, ?)';
        $params = array($this->nombre, $this->estado);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_item,id_tipo_item,descripcion_item,descripcion_tipo_item,estado_item
        FROM tb_items 
        INNER JOIN tb_tipo_items USING (id_tipo_item)
        ORDER BY descripcion_tipo_item;';
        return Database::getRows($sql);
    }
    public function readAllActive()
    {
        $sql = 'SELECT id_item, descripcion_tipo_item,descripcion_item, estado_item
        FROM tb_items
        INNER JOIN tb_tipo_items USING(id_tipo_item)
        WHERE estado_item=true and estado_tipo_item=true
        ORDER BY CAST(descripcion_tipo_item AS UNSIGNED)';
        return Database::getRows($sql);
    }
    public function readAllNot($value)
    {
        $value = ($value === '') ? '%%' : '%' . $value . '%';
        $sql = 'SELECT id_item, descripcion_tipo_item,descripcion_item, estado_item 
        FROM tb_items 
        INNER JOIN tb_tipo_items USING(id_tipo_item)
        WHERE id_item NOT IN (
            SELECT id_item
            FROM tb_detalle_productos
            WHERE id_producto = ?
        ) 
        AND estado_item=true and estado_tipo_item=true 
        AND descripcion_item like ?
        ORDER BY CAST(descripcion_tipo_item AS UNSIGNED);';
        $params = array($this->idProducto,$value);
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql ='SELECT id_item,id_tipo_item,descripcion_item,descripcion_tipo_item,estado_item
        FROM tb_items 
        INNER JOIN tb_tipo_items USING (id_tipo_item)
        WHERE id_item=? ';
        $params = array($this->id);
        return Database::getRow($sql, $params);
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
        $sql = 'UPDATE tb_items
                SET descripcion_item = ?,estado_item = ?
                WHERE id_item = ?';
        $params = array($this->nombre,$this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_items
                WHERE id_item = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function readProductosCategoria()
    {
        $sql = 'SELECT mo.id_modelo, mo.descripcion,mo.foto, mo.estado,ma.descripcion as marca
        FROM prc_modelos mo
        INNER JOIN tb_marcas ma USING(id_marca)
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
