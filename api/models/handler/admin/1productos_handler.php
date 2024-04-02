<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class ProductoHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $nombre = null;
    protected $url = null;
    protected $tipoproducto = null;
    protected $horario = null;
    protected $precio = null;
    protected $estado = null;
    protected $lunes = null;
    protected $martes = null;
    protected $miercoles = null;
    protected $jueves = null;
    protected $viernes = null;
    protected $sabado = null;
    protected $domingo = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/modelos/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows($idMarca,$value)
    {
        $value = '%' . Validator::getSearchValue() . '%';

        $sql = 'SELECT id_modelo, descripcion_modelo,foto_modelo, estado_modelo,descripcion_marca as marca
        FROM prc_modelos 
        INNER JOIN ctg_marcas USING(id_marca)
        WHERE descripcion_modelo LIKE ? OR descripcion_marca LIKE ?
        ORDER BY descripcion_modelo';

        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }
    public function searchModelos($value)
    {
        $value = !empty($value) ? '%' . $value . '%' : '%%';
        
        $sql = 'SELECT id_modelo, descripcion_modelo,foto_modelo, estado_modelo,descripcion_marca as marca
        FROM prc_modelos 
        INNER JOIN ctg_marcas USING(id_marca)
        WHERE estado_modelo=true AND descripcion_modelo like ?
        ORDER BY descripcion_modelo';

        $params = array($value);
        return Database::getRows($sql, $params);
    }


    public function createRow()
    {
        $sql = '
        INSERT INTO tb_productos (id_producto,tipo_producto,descripcion_producto,horario_producto,precio_producto,
        imagen_producto,estado_producto,lunes_producto,martes_producto,miercoles_producto,jueves_producto,
        viernes_producto,sabado_producto,domingo_producto) 
        VALUES((SELECT get_next_id("tb_productos")),?,?,?,?,?,?,?,?,?,?,?,?,?);';

        $params = array($this->tipoproducto, $this->nombre, $this->horario, $this->precio
        , $this->url, $this->estado, $this->lunes, $this->martes, $this->miercoles, $this->jueves
        , $this->viernes, $this->sabado, $this->domingo);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_producto,tipo_producto,descripcion_producto,horario_producto,precio_producto,
        imagen_producto,estado_producto
        FROM tb_productos 
        ORDER BY id_producto DESC';
        return Database::getRows($sql);
    }
    public function readDesc()
    {
        $sql = 'SELECT id_modelo, descripcion_modelo, foto_modelo, estado_modelo, descripcion_marca AS marca
        FROM prc_modelos
        INNER JOIN ctg_marcas USING(id_marca)
        WHERE estado_marca=true AND estado_modelo=true
        ORDER BY id_modelo DESC
        LIMIT 8';
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
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT id_producto,tipo_producto,descripcion_producto,horario_producto,precio_producto,
        imagen_producto,estado_producto,lunes_producto,martes_producto,miercoles_producto,jueves_producto,
        viernes_producto,sabado_producto,domingo_producto
        FROM tb_productos
        WHERE id_producto=? 
        ORDER BY id_producto DESC';
        $params = array($this->id);
        $data = Database::getRow($sql, $params);
        $_SESSION['idprod'] = $data['id_producto'];
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
        $params = array($this->url, $this->nombre, $this->estado, $this->id, $this->id);
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
        $sql = 'SELECT id_modelo, descripcion_modelo,foto_modelo, estado_modelo,descripcion_marca as marca
        FROM prc_modelos 
        INNER JOIN ctg_marcas USING(id_marca)
        WHERE estado_modelo=true and id_marca=?
        ORDER BY descripcion_modelo';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    /*
    *   Métodos para generar gráficos.
    */
    public function cantidadProductosCategoria()
    {
        $sql = 'SELECT descripcion_marca, COUNT(id_marca) cantidad
        FROM prc_modelos
        INNER JOIN ctg_marcas USING(id_marca)
        GROUP BY descripcion_marca ORDER BY cantidad DESC LIMIT 5';
        return Database::getRows($sql);
    }

    public function porcentajeProductosCategoria()
    {
        $sql = 'SELECT descripcion_marca, ROUND((COUNT(id_modelo) * 100.0 / (SELECT COUNT(id_modelo) FROM prc_modelos)), 2)
        porcentaje
        FROM prc_modelos mo
        INNER JOIN ctg_marcas ma USING(id_marca)
        GROUP BY descripcion_marca ORDER BY porcentaje DESC';
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
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }
}
