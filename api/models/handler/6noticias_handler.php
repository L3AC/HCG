<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class NoticiaHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $precio = null;
    protected $idtiponoticia = null;
    protected $existencias = null;
    protected $imagen = null;
    protected $categoria = null;
    protected $estado = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/noticias/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';

        $sql = 'SELECT mo.id_modelo, mo.descripcion,mo.foto, mo.estado,ma.descripcion as marca
        FROM prc_modelos mo
        INNER JOIN ctg_marcas ma USING(id_marca)
        WHERE mo.descripcion LIKE ? OR ma.descripcion LIKE ?
        ORDER BY mo.descripcion';

        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO prc_noticias( titulo_noticia, foto_noticia, contenido_noticia, estado_noticia, fecha_noticia)
                VALUES(?, ?, ?, ?, ?, now())';
        $params = array($this->nombre, $this->imagen, $this->descripcion, $this->estado);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'select n.id_noticia,n.id_tipo_noticia,n.titulo_noticia,
        n.foto_noticia,n.contenido_noticia,n.estado_noticia,
        DATE_FORMAT(n.fecha_noticia, "%d-%m-%Y") AS fecha from prc_noticias n
        INNER JOIN ctg_tipo_noticias tn USING(id_tipo_noticia)
        ORDER BY n.titulo_noticia';
        return Database::getRows($sql);
    }
    public function readAllActive()
    {
        $sql = 'select id_noticia,id_tipo_noticia,titulo_noticia,
        foto_noticia,contenido_noticia,estado_noticia,
        DATE_FORMAT(n.fecha_noticia, "%d-%m-%Y") AS fecha from prc_noticias n
        INNER JOIN ctg_tipo_noticias tn USING(id_tipo_noticia)
        WHERE estado_noticia=true
        ORDER BY n.titulo_noticia';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql ='select n.id_noticia,n.id_tipo_noticia,n.titulo_noticia,
        n.foto_noticia,n.contenido_noticia,n.estado_noticia,
        DATE_FORMAT(n.fecha_noticia, "%d-%m-%Y") AS fecha from prc_noticias n
        INNER JOIN ctg_tipo_noticias tn USING(id_tipo_noticia)
        WHERE n.id_noticia=?
        ORDER BY n.titulo_noticia';
        $params = array($this->id);
        $data = Database::getRow($sql, $params);
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
