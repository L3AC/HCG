<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class DetalleProductoHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $idItem = null;
    protected $idProducto = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $precio = null;
    protected $cantidad = null;
    protected $imagen = null;
    protected $categoria = null;
    protected $estado = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/modelos/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    // Método para buscar filas que coincidan con el valor de búsqueda.
    public function searchRows($valor)
    {
        $valor = '';
        $value = '%' . Validator::getSearchValue() . '%';

        $sql = 'select mt.id_modelotalla,mt.id_talla,mt.id_modelo,mt.stock,mt.precio,t.descripcion as talla
        from prc_modelo_tallas mt 
        INNER JOIN ctg_tallas t USING(id_talla)
        INNER JOIN prc_modelos m USING(id_modelo)
        WHERE t.descripcion LIKE ? AND mt.id_modelo=?
        ORDER BY t.descripcion';

        $params = array($value, $this->idProducto);
        return Database::getRows($sql, $params);
    }

    // Método para crear una nueva fila en la tabla detalle_productos.
    public function createRow()
    {
        $sql = 'INSERT INTO tb_detalle_productos(id_detalle_producto,id_item,id_producto,cantidad_item) 
            VALUES((SELECT get_next_id("tb_detalle_productos")),?,
            (SELECT MAX(id_producto) AS id_producto FROM tb_productos),?)';
        $params = array($this->idItem, $this->cantidad);
        return Database::executeRow($sql, $params);
    }

    // Método para crear una fila en detalle_productos con id de producto específico.
    public function subcreateRow()
    {
        $sql = 'INSERT INTO tb_detalle_productos(id_detalle_producto,id_item,id_producto,cantidad_item) 
            VALUES((SELECT get_next_id("tb_detalle_productos")),?,?,?)';
        $params = array($this->idItem, $this->idProducto, $this->cantidad);
        return Database::executeRow($sql, $params);
    }

    // Método para actualizar una fila de detalle_productos.
    public function updateRow()
    {
        $sql = 'UPDATE tb_detalle_productos 
                SET cantidad_item = ?
                WHERE id_detalle_producto = ?';
        $params = array($this->cantidad, $this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para leer todas las filas de modelo_tallas.
    public function readAll()
    {
        $sql = 'select mt.id_modelo_talla,mt.id_talla,mt.id_modelo,mt.stock_modelo_talla,
        mt.precio_modelo_talla,t.descripcion_talla as talla
        from prc_modelo_tallas mt 
        INNER JOIN ctg_tallas t USING(id_talla)
        INNER JOIN prc_modelos m USING(id_modelo)
        WHERE mt.id_modelo = ?
        ORDER BY t.descripcion_talla';
        $params = array($this->idProducto);
        return Database::getRows($sql, $params);
    }

    // Método para leer todas las filas activas de modelo_tallas.
    public function readAllActive()
    {
        $sql = 'select id_modelo_talla,id_talla,id_modelo,stock_modelo_talla,
        precio_modelo_talla,descripcion_talla as talla
        from prc_modelo_tallas 
        INNER JOIN ctg_tallas USING(id_talla)
        INNER JOIN prc_modelos USING(id_modelo)
        WHERE estado_talla=true AND id_modelo = ? AND stock_modelo_talla>0
        ORDER BY descripcion_talla';
        $params = array($this->idProducto);
        return Database::getRows($sql, $params);
    }

    // Método para leer detalles de productos por ID de producto.
    public function readByProducto()
    {
        $sql = 'SELECT id_detalle_producto,id_item,id_producto,cantidad_item,
        id_item, descripcion_tipo_item,descripcion_item, estado_item
        FROM tb_detalle_productos
        INNER JOIN tb_items USING(id_item)
        INNER JOIN tb_tipo_items USING(id_tipo_item)
        INNER JOIN tb_productos USING(id_producto)
        WHERE id_producto=?
        ORDER BY CAST(descripcion_tipo_item AS UNSIGNED);';
        $params = array($this->idProducto);
        return Database::getRows($sql, $params);
    }

    // Método para leer detalles y la información del producto por ID de producto.
    public function readByProducto2()
    {
        $sql1 = 'SELECT id_producto,tipo_producto,descripcion_producto,horario_producto,precio_producto,
        imagen_producto,estado_producto,lunes_producto,martes_producto,miercoles_producto,jueves_producto,
        viernes_producto,sabado_producto,domingo_producto
        FROM tb_productos
        WHERE id_producto=?';
        $params1 = array($this->idProducto);

        $sql2 = 'SELECT id_detalle_producto,id_item,id_producto,cantidad_item,
        id_item, descripcion_tipo_item,descripcion_item, estado_item
        FROM tb_detalle_productos
        INNER JOIN tb_items USING(id_item)
        INNER JOIN tb_tipo_items USING(id_tipo_item)
        INNER JOIN tb_productos USING(id_producto)
        WHERE id_producto=?
        ORDER BY CAST(descripcion_tipo_item AS UNSIGNED);';
        $params2 = array($this->idProducto);

        return array("info" =>Database::getRow($sql1, $params1),"detalles" => Database::getRows($sql2, $params2));
    }

    // Método para leer una fila específica de detalle_productos.
    public function readOne()
    {
        $sql = 'SELECT id_detalle_producto,id_item,id_producto,cantidad_item,nota_producto
        FROM tb_detalle_productos
        WHERE id_detalle_producto=?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Método para leer el nombre de archivo de la imagen de un modelo.
    public function readFilename()
    {
        $sql = 'SELECT foto
                FROM prc_modelos
                WHERE id_modelo = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Método para eliminar una fila de detalle_productos.
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_detalle_productos
                WHERE id_detalle_producto = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para leer productos por categoría.
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

    // Método para obtener productos por categoría.
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
