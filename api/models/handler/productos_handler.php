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
    protected $search = null;
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
    protected $combobdia = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/modelos/';

    /*
     *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    // Método para buscar productos según un criterio de búsqueda.
    public function searchRows()
    {
        $this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';

        $sql = 'SELECT id_producto,tipo_producto,descripcion_producto,horario_producto,precio_producto,
        imagen_producto,estado_producto
        FROM tb_productos 
        WHERE descripcion_producto like ?
        ORDER BY id_producto DESC';

        $params = array($this->search);
        return Database::getRows($sql, $params);
    }

    // Método para buscar modelos de productos según un valor específico.
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

    // Método para crear un nuevo producto en la base de datos.
    public function createRow()
    {
        $sql = '
        INSERT INTO tb_productos 
        (id_producto,tipo_producto,descripcion_producto,horario_producto,precio_producto,
        imagen_producto,estado_producto,lunes_producto,martes_producto,miercoles_producto,
        jueves_producto,viernes_producto,sabado_producto,domingo_producto) 
        VALUES((SELECT get_next_id("tb_productos")),?,?,?,?,?,?,?,?,?,?,?,?,?);';

        $params = array(
            $this->tipoproducto,
            $this->nombre,
            $this->horario,
            $this->precio
            ,
            $this->url,
            $this->estado,
            $this->lunes,
            $this->martes,
            $this->miercoles,
            $this->jueves
            ,
            $this->viernes,
            $this->sabado,
            $this->domingo
        );
        return Database::executeRow($sql, $params);
    }

    // Método para leer conjuntos de productos activos y disponibles según el día y horario actual.
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

    // Método para leer complementos de productos activos y disponibles según el día y horario actual.
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

    // Método para leer todos los productos activos en la base de datos.
    public function readAll()
    {
        $sql = 'SELECT id_producto,tipo_producto,descripcion_producto,horario_producto,precio_producto,
        imagen_producto,estado_producto
        FROM tb_productos 
        ORDER BY id_producto DESC';
        return Database::getRows($sql);
    }

    // Método para leer todos cuantos pedidos ha tenido cada producto.
    public function readPedidosProducto()
    {
        $sql = 'SELECT  p.descripcion_producto, SUM(dp.cantidad_pedido) AS cantidad_pedidos
                FROM tb_detalle_pedidos dp
                INNER JOIN tb_productos p ON dp.id_producto = p.id_producto
                GROUP BY p.descripcion_producto
                ORDER BY cantidad_pedidos DESC;';
        return Database::getRows($sql);
    }

    // Método para leer los últimos 8 modelos de productos activos junto con su marca asociada.
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

    // Método para leer todas las tallas y stock disponibles para un modelo específico.
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

    // Método para buscar productos "Conjunto" y "Complementario" según un valor de búsqueda y las condiciones de día y horario actuales.
    public function searchProductos($value)
    {
        $value = $value === '' ? '%%' : '%' . $value . '%';

        $sql = 'SELECT *
        FROM tb_productos
        WHERE estado_producto = 1 AND tipo_producto="Conjunto" AND descripcion_producto LIKE ? 
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
        )   ';

        $sql2 = 'SELECT *
            FROM tb_productos
            WHERE estado_producto = 1 AND tipo_producto="Complementario" AND descripcion_producto LIKE ? 
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
            )   ';

        $params = array($value);
        return array('conjunto' => Database::getRows($sql, $params), 'complementario' => Database::getRows($sql2, $params));
    }

    // Método para leer un producto específico según su ID.
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

    // Método para leer el nombre de archivo de imagen de un modelo específico.
    public function readFilename()
    {
        $sql = 'SELECT foto
                FROM prc_modelos
                WHERE id_modelo = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Método para actualizar un producto en la base de datos.
    public function updateRow()
    {
        $sql = 'UPDATE tb_productos SET
        tipo_producto = ?,descripcion_producto = ?,horario_producto = ?,precio_producto = ?,
        imagen_producto = ?,estado_producto = ?,lunes_producto = ?,martes_producto = ?,
        miercoles_producto = ?,jueves_producto = ?,viernes_producto = ?,sabado_producto = ?,
        domingo_producto = ? WHERE id_producto = ?;';
        $params = array(
            $this->tipoproducto,
            $this->nombre,
            $this->horario,
            $this->precio
            ,
            $this->url,
            $this->estado,
            $this->lunes,
            $this->martes,
            $this->miercoles,
            $this->jueves
            ,
            $this->viernes,
            $this->sabado,
            $this->domingo,
            $this->id
        );
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar un producto de la base de datos según su ID.
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_productos
                WHERE id_producto = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para leer todos los productos de una categoría específica ordenados por nombre.
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

    // Método para obtener la cantidad de modelos por marca más frecuentes.
    public function cantidadProductosCategoria()
    {
        $sql = 'SELECT descripcion_marca, COUNT(id_marca) cantidad
        FROM prc_modelos
        INNER JOIN ctg_marcas USING(id_marca)
        GROUP BY descripcion_marca ORDER BY cantidad DESC LIMIT 5';
        return Database::getRows($sql);
    }

    // Método para calcular el porcentaje de veces que se han pedido cada producto en comparación con el total de pedidos.
    public function porcentajeProductosCategoria()
    {
        $sql = '
        SELECT id_producto, descripcion_producto, COUNT(*) AS veces_pedidos,
        ROUND((COUNT(id_producto) * 100.0 / (SELECT COUNT(id_producto) FROM tb_productos)), 2)porcentaje
        FROM tb_detalle_pedidos
        INNER JOIN tb_productos USING(id_producto)
        GROUP BY id_producto, descripcion_producto
        ORDER BY veces_pedidos DESC
        LIMIT 5;';
        return Database::getRows($sql);
    }

    // Método para calcular como el top 5 de clientes que han realizado más compras, ordenados de mayor a menor
    public function topClientesCompras()
    {
        $sql = '
            SELECT c.nombre_cliente,COUNT(p.id_pedido) AS cantidad_pedidos
            FROM tb_pedidos p
            INNER JOIN tb_clientes c ON p.id_cliente = c.id_cliente
            GROUP BY c.nombre_cliente
            ORDER BY cantidad_pedidos DESC
            LIMIT 5';
        return Database::getRows($sql);
    }

    /*
     *   Métodos para generar reportes.
     */

    // Método para leer todos los productos de una categoría específica ordenados por nombre.
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


    //Metódo para leer todos los productos segun el item seleccionado.
    public function productosItem()
    {

        $sql = 'SELECT p.descripcion_producto, p.horario_producto, t.descripcion_tipo_item
                FROM tb_productos p
                INNER JOIN tb_detalle_productos dp ON p.id_producto = dp.id_producto
                INNER JOIN tb_items i ON dp.id_item = i.id_item
                INNER JOIN tb_tipo_items t ON i.id_tipo_item = t.id_tipo_item
                WHERE i.id_item = ?
                ORDER BY p.descripcion_producto';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    // Método para leer todos los productos segun el dia seleccionado
    public function productosDia()
    {
        $sql = '
        SELECT 
            p.id_producto, 
            p.descripcion_producto, 
            p.horario_producto, 
            p.precio_producto, 
            p.estado_producto 
        FROM 
            tb_productos p
        WHERE 
            (CASE 
                WHEN ? = "lunes" THEN p.lunes_producto
                WHEN ? = "martes" THEN p.martes_producto
                WHEN ? = "miercoles" THEN p.miercoles_producto
                WHEN ? = "jueves" THEN p.jueves_producto
                WHEN ? = "viernes" THEN p.viernes_producto
                WHEN ? = "sabado" THEN p.sabado_producto
                WHEN ? = "domingo" THEN p.domingo_producto
            END) = TRUE
            ORDER BY p.precio_producto ASC';

        $params = array($this->combobdia, $this->combobdia, $this->combobdia, $this->combobdia, $this->combobdia, $this->combobdia, $this->combobdia);
        return Database::getRows($sql, $params);
    }


}
