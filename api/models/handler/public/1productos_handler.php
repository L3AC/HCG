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
    public function searchProductos($value)
    {
        $value = !empty($value) ? '%' . $value . '%' : '%%';
        
        $sql = 'SELECT *
        FROM tb_productos
        WHERE estado_producto = 1 AND descripcion_producto LIKE ?';

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

    public function readConjunto()
    {
        $sql = 'SELECT *
        FROM tb_productos
        WHERE estado_producto = 1 AND tipo_producto="Conjunto"
        AND (
            (DAYOFWEEK(NOW()) = 1 AND domingo_producto = 1)
            OR (DAYOFWEEK(NOW()) = 2 AND lunes_producto = 1)
            OR (DAYOFWEEK(NOW()) = 3 AND martes_producto = 1)
            OR (DAYOFWEEK(NOW()) = 4 AND miercoles_producto = 1)
            OR (DAYOFWEEK(NOW()) = 5 AND jueves_producto = 1)
            OR (DAYOFWEEK(NOW()) = 6 AND viernes_producto = 1)
            OR (DAYOFWEEK(NOW()) = 7 AND sabado_producto = 1)
        )
        AND (
            (horario_producto = "Desayuno" AND TIME(NOW()) BETWEEN "06:00:00" AND "11:00:00")
            OR (horario_producto = "Almuerzo" AND TIME(NOW()) BETWEEN "11:00:00" AND "15:00:00")
            OR (horario_producto = "Típico" AND TIME(NOW()) BETWEEN "15:00:00" AND "18:00:00")
            OR (horario_producto = "Cena" AND TIME(NOW()) BETWEEN "18:00:00" AND "22:00:00")
            OR (horario_producto = "Todo el día")
            OR (horario_producto = "Desayuno y Almuerzo" AND (TIME(NOW()) BETWEEN "06:00:00" AND "11:00:00" OR TIME(NOW()) BETWEEN "11:00:00" AND "15:00:00"))
            OR (horario_producto = "Desayuno y Cena" AND (TIME(NOW()) BETWEEN "06:00:00" AND "11:00:00" OR TIME(NOW()) BETWEEN "18:00:00" AND "22:00:00"))
            OR (horario_producto = "Almuerzo y Cena" AND (TIME(NOW()) BETWEEN "11:00:00" AND "15:00:00" OR TIME(NOW()) BETWEEN "18:00:00" AND "22:00:00"))
            OR (horario_producto = "Típico y Desayuno" AND (TIME(NOW()) BETWEEN "06:00:00" AND "10:00:00" OR TIME(NOW()) BETWEEN "15:00:00" AND "18:00:00"))
            OR (horario_producto = "Típico y Almuerzo" AND (TIME(NOW()) BETWEEN "11:00:00" AND "15:00:00" OR TIME(NOW()) BETWEEN "18:00:00" AND "22:00:00"))
            OR (horario_producto = "Típico y Cena" AND (TIME(NOW()) BETWEEN "06:00:00" AND "10:00:00" OR TIME(NOW()) BETWEEN "15:00:00" AND "18:00:00"))
        )             
        ORDER BY id_producto DESC';
        return Database::getRows($sql);
    }
    public function readComplemento()
    {
        $sql = 'SELECT *
        FROM tb_productos
        WHERE estado_producto = 1 AND tipo_producto="Complementario"
        AND (
            (DAYOFWEEK(NOW()) = 1 AND domingo_producto = 1)
            OR (DAYOFWEEK(NOW()) = 2 AND lunes_producto = 1)
            OR (DAYOFWEEK(NOW()) = 3 AND martes_producto = 1)
            OR (DAYOFWEEK(NOW()) = 4 AND miercoles_producto = 1)
            OR (DAYOFWEEK(NOW()) = 5 AND jueves_producto = 1)
            OR (DAYOFWEEK(NOW()) = 6 AND viernes_producto = 1)
            OR (DAYOFWEEK(NOW()) = 7 AND sabado_producto = 1)
        )
        AND (
            (horario_producto = "Desayuno" AND TIME(NOW()) BETWEEN "06:00:00" AND "11:00:00")
            OR (horario_producto = "Almuerzo" AND TIME(NOW()) BETWEEN "11:00:00" AND "15:00:00")
            OR (horario_producto = "Típico" AND TIME(NOW()) BETWEEN "15:00:00" AND "18:00:00")
            OR (horario_producto = "Cena" AND TIME(NOW()) BETWEEN "18:00:00" AND "22:00:00")
            OR (horario_producto = "Todo el día")
            OR (horario_producto = "Desayuno y Almuerzo" AND (TIME(NOW()) BETWEEN "06:00:00" AND "11:00:00" OR TIME(NOW()) BETWEEN "11:00:00" AND "15:00:00"))
            OR (horario_producto = "Desayuno y Cena" AND (TIME(NOW()) BETWEEN "06:00:00" AND "11:00:00" OR TIME(NOW()) BETWEEN "18:00:00" AND "22:00:00"))
            OR (horario_producto = "Almuerzo y Cena" AND (TIME(NOW()) BETWEEN "11:00:00" AND "15:00:00" OR TIME(NOW()) BETWEEN "18:00:00" AND "22:00:00"))
            OR (horario_producto = "Típico y Desayuno" AND (TIME(NOW()) BETWEEN "06:00:00" AND "10:00:00" OR TIME(NOW()) BETWEEN "15:00:00" AND "18:00:00"))
            OR (horario_producto = "Típico y Almuerzo" AND (TIME(NOW()) BETWEEN "11:00:00" AND "15:00:00" OR TIME(NOW()) BETWEEN "18:00:00" AND "22:00:00"))
            OR (horario_producto = "Típico y Cena" AND (TIME(NOW()) BETWEEN "06:00:00" AND "10:00:00" OR TIME(NOW()) BETWEEN "15:00:00" AND "18:00:00"))
        )            
        ORDER BY id_producto DESC';
        return Database::getRows($sql);
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

}
