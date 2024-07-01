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
    protected $idTipoItem = null;
    protected $idProducto = null;
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

    // Método para buscar filas en la base de datos.
    public function searchRows()
    {
        $this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';

        $sql = 'SELECT id_item,id_tipo_item,descripcion_item,descripcion_tipo_item,estado_item
        FROM tb_items 
        INNER JOIN tb_tipo_items USING (id_tipo_item)
        WHERE descripcion_item like ?
        ORDER BY descripcion_tipo_item;';

        $params = array($this->search);
        return Database::getRows($sql, $params);
    }

    // Método para insertar una nueva fila en la base de datos.
    public function createRow()
    {
        $sql = 'INSERT INTO tb_items(id_item,id_tipo_item,descripcion_item, estado_item)
                VALUES((SELECT get_next_id("tb_items")),?,?, ?)';
        $params = array($this->idTipoItem,$this->nombre, $this->estado);
        return Database::executeRow($sql, $params);
    }

    // Método para leer todas las filas de la tabla tb_items.
    public function readAll()
    {
        $sql = 'SELECT id_item,id_tipo_item,descripcion_item,descripcion_tipo_item,estado_item
        FROM tb_items 
        INNER JOIN tb_tipo_items USING (id_tipo_item)
        ORDER BY descripcion_tipo_item;';
        return Database::getRows($sql);
    }

    // Método para leer todas las filas activas de la tabla tb_items.
    public function readAllActive()
    {
        $sql = 'SELECT id_item, descripcion_tipo_item,descripcion_item, estado_item
        FROM tb_items
        INNER JOIN tb_tipo_items USING(id_tipo_item)
        WHERE estado_item=true and estado_tipo_item=true
        ORDER BY CAST(descripcion_tipo_item AS UNSIGNED)';
        return Database::getRows($sql);
    }

    // Método para leer filas que no están asociadas a un valor específico.
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

    // Método para leer una sola fila basada en el ID.
    public function readOne()
    {
        $sql ='SELECT id_item,id_tipo_item,descripcion_item,descripcion_tipo_item,estado_item
        FROM tb_items 
        INNER JOIN tb_tipo_items USING (id_tipo_item)
        WHERE id_item=? ';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Método para leer el nombre de archivo de un registro específico.
    public function readFilename()
    {
        $sql = 'SELECT foto
                FROM prc_modelos
                WHERE id_modelo = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Método para actualizar una fila en la base de datos.
    public function updateRow()
    {
        $sql = 'UPDATE tb_items
                SET descripcion_item = ?,estado_item = ?,id_tipo_item=?
                WHERE id_item = ?';
        $params = array($this->nombre,$this->estado,$this->idTipoItem, $this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar una fila de la base de datos.
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_items
                WHERE id_item = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para leer productos basados en una categoría específica.
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

    // Método para obtener la cantidad de productos por categoría.
    public function cantidadProductosCategoria()
    {
        $sql = 'SELECT nombre_categoria, COUNT(id_producto) cantidad
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                GROUP BY nombre_categoria ORDER BY cantidad DESC LIMIT 5';
        return Database::getRows($sql);
    }

    // Método para obtener el porcentaje de productos por categoría.
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
    // Método para obtener detalles de productos por categoría.
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
