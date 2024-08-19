<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class TipoItemHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $search = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $precio = null;
    protected $existencias = null;
    protected $imagen = null;
    protected $categoria = null;
    protected $estado = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/productos/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    // Método para buscar filas en la tabla de tipo_items.
    public function searchRows()
    {
        $this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';
        $sql = 'SELECT id_tipo_item, descripcion_tipo_item, estado_tipo_item
                FROM tb_tipo_items
                WHERE descripcion_tipo_item LIKE ? 
                ORDER BY descripcion_tipo_item';
        $params = array($this->search);
        return Database::getRows($sql, $params);
    }

    // Método para crear una nueva fila en la tabla de tipo_items.
    public function createRow()
    {
        $sql = 'INSERT INTO tb_tipo_items(id_tipo_item,descripcion_tipo_item,estado_tipo_item)
                VALUES((SELECT get_next_id("tb_tipo_items")),?,?)';
        $params = array($this->nombre, $this->estado);
        return Database::executeRow($sql, $params);
    }

    // Método para leer todos los registros de tipo_items.
    public function readAll()
    {
        $sql = 'SELECT id_tipo_item, descripcion_tipo_item,estado_tipo_item
                FROM tb_tipo_items
                ORDER BY estado_tipo_item DESC, descripcion_tipo_item;' ;
        return Database::getRows($sql);
    }

    // Método para contar cuantos items tiene cada tipo item.
    public function readItemsTipoI()
    {
        $sql = 'SELECT ti.descripcion_tipo_item AS nombre_tipo_item, COUNT(i.id_item) AS cantidad_items
                FROM tb_tipo_items ti
                LEFT JOIN tb_items i ON ti.id_tipo_item = i.id_tipo_item
                GROUP BY ti.descripcion_tipo_item;';
        return Database::getRows($sql);
    }

    // Método para contar el tipo items con mas resgistros.
    public function readItemsTipoIMax()
    {
        $sql = 'SELECT ti.descripcion_tipo_item AS nombre_tipo_item, COUNT(i.id_item) AS cantidad_items
                FROM tb_tipo_items ti
                LEFT JOIN tb_items i ON ti.id_tipo_item = i.id_tipo_item
                GROUP BY ti.descripcion_tipo_item
                ORDER BY cantidad_items DESC
                LIMIT 1;';
        return Database::getRows($sql);
    }

    // Método para leer todos los registros activos de tipo_items.
    public function readAllActive()
    {
        $sql = 'SELECT id_tipo_item, descripcion_tipo_item,estado_tipo_item
                FROM tb_tipo_items where estado_tipo_item=true' ;
        return Database::getRows($sql);
    }

    // Método para leer un único registro de tipo_item por su ID.
    public function readOne()
    {
        $sql = 'SELECT id_tipo_item, descripcion_tipo_item,estado_tipo_item
                FROM tb_tipo_items
                WHERE id_tipo_item = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT imagen_producto
                FROM producto
                WHERE id_producto = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Método para actualizar los datos de un registro de tipo_item específico.
    public function updateRow()
    {
        $sql = 'UPDATE tb_tipo_items
                SET descripcion_tipo_item = ?, estado_tipo_item = ?
                WHERE id_tipo_item = ?';
        $params = array( $this->nombre, $this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar un registro de tipo_item de la tabla.
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_tipo_items 
                WHERE id_tipo_item = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para leer productos relacionados con una categoría específica de tipo_item.
    public function readProductosCategoria()
    {
        $sql = 'SELECT id_producto, imagen_producto, nombre_producto, descripcion_producto, precio_producto, existencias_producto
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                WHERE id_categoria = ? AND estado_producto = true
                ORDER BY nombre_producto';
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
