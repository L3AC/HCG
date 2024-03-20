<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class ModeloTallaHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $idModelo = null;
    protected $idTalla = null;
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
    public function searchRows($valor)
    {
        $valor='';
        $value = '%' . Validator::getSearchValue() . '%';

        $sql='select mt.id_modelotalla,mt.id_talla,mt.id_modelo,mt.stock,mt.precio,t.descripcion as talla
        from prc_modelo_tallas mt 
        INNER JOIN ctg_tallas t USING(id_talla)
        INNER JOIN prc_modelos m USING(id_modelo)
        WHERE t.descripcion LIKE ? AND mt.id_modelo=?
        ORDER BY t.descripcion';

        $params = array($value,$this->idModelo);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO prc_modelo_tallas(id_talla, id_modelo, stock_modelo_talla, precio_modelo_talla)
                VALUES(?, ?, ?, ?)';
        $params = array($this->idTalla, $this->idModelo, $this->existencias, $this->precio);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'select mt.id_modelo_talla,mt.id_talla,mt.id_modelo,mt.stock_modelo_talla,
        mt.precio_modelo_talla,t.descripcion_talla as talla
        from prc_modelo_tallas mt 
        INNER JOIN ctg_tallas t USING(id_talla)
        INNER JOIN prc_modelos m USING(id_modelo)
        WHERE mt.id_modelo = ?
        ORDER BY t.descripcion_talla';
        $params = array($this->idModelo); 
        return Database::getRows($sql, $params);
    }
    public function readAllActive()
    {
        $sql = 'select id_modelo_talla,id_talla,id_modelo,stock_modelo_talla,
        precio_modelo_talla,descripcion_talla as talla
        from prc_modelo_tallas 
        INNER JOIN ctg_tallas USING(id_talla)
        INNER JOIN prc_modelos USING(id_modelo)
        WHERE estado_talla=true AND id_modelo = ? AND stock_modelo_talla>0
        ORDER BY descripcion_talla';
        $params = array($this->idModelo); 
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql ='select mt.id_modelo_talla,mt.id_talla,mt.id_modelo,mt.stock_modelo_talla,
        mt.precio_modelo_talla,t.descripcion_talla as talla
        from prc_modelo_tallas mt 
        INNER JOIN ctg_tallas t USING(id_talla)
        INNER JOIN prc_modelos m USING(id_modelo)
        WHERE mt.id_modelo_talla =?
        ORDER BY t.descripcion_talla ';
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
        $sql = 'UPDATE prc_modelo 
                SET foto = ?, descripcion = ?,estado = ?, id_marca = ?
                WHERE id_modelo = ?';
        $params = array($this->imagen, $this->nombre,$this->estado, $this->categoria, $this->id);
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
