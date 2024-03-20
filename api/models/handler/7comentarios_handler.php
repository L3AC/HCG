<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class ComentarioHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $idModelo = null;
    protected $idDetalle = null;
    protected $puntuacion = null;
    protected $mensaje = null;

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

        $sql = 'select id_comentario,id_detalle,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        CONCAT(descripcion_marca," ",descripcion_modelo) as modelo,contenido_comentario,
        puntuacion_comentario,estado_comentario,
        DATE_FORMAT(cm.fecha_comentario, "%d-%m-%Y - %h:%i %p") AS fecha_comentario
        from prc_comentarios cm
        INNER JOIN prc_detalle_pedidos dp USING(id_detalle)
        INNER JOIN prc_pedidos p USING(id_pedido)
        INNER JOIN prc_clientes c USING(id_cliente)
        INNER JOIN prc_modelo_tallas mt USING (id_modelo_talla)
        INNER JOIN prc_modelos mo USING (id_modelo)
        INNER JOIN ctg_marcas ma USING (id_marca)
        WHERE CONCAT(descripcion_marca," ",descripcion_modelo) like ?
        ORDER BY fecha_comentario DESC, estado_comentario DESC';

        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        
        $sql = 'INSERT INTO prc_comentarios(id_detalle,contenido_comentario,puntuacion_comentario,
        fecha_comentario,estado_comentario) VALUES(?,?,?,now(),true)';
        $params = array($this->idDetalle,$this->mensaje ,$this->puntuacion);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'select id_comentario,id_detalle,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        CONCAT(descripcion_marca," ",descripcion_modelo) as modelo,contenido_comentario,
        puntuacion_comentario,estado_comentario,
        DATE_FORMAT(cm.fecha_comentario, "%d-%m-%Y - %h:%i %p") AS fecha_comentario
        from prc_comentarios cm
        INNER JOIN prc_detalle_pedidos dp USING(id_detalle)
        INNER JOIN prc_pedidos p USING(id_pedido)
        INNER JOIN prc_clientes c USING(id_cliente)
        INNER JOIN prc_modelo_tallas mt USING (id_modelo_talla)
        INNER JOIN prc_modelos mo USING (id_modelo)
        INNER JOIN ctg_marcas ma USING (id_marca)
        ORDER BY fecha_comentario DESC, estado_comentario DESC';
        return Database::getRows($sql);
    }
    public function readAllActive()
    {
        $sql = 'select id_modelo,id_comentario,id_detalle,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        CONCAT(descripcion_marca," ",descripcion_modelo) as modelo,contenido_comentario,
        puntuacion_comentario,estado_comentario,
        DATE_FORMAT(fecha_comentario, "%d-%m-%Y - %h:%i %p") AS fecha_comentario
        from prc_comentarios 
        INNER JOIN prc_detalle_pedidos dp USING(id_detalle)
        INNER JOIN prc_pedidos p USING(id_pedido)
        INNER JOIN prc_clientes c USING(id_cliente)
        INNER JOIN prc_modelo_tallas mt USING (id_modelo_talla)
        INNER JOIN prc_modelos mo USING (id_modelo)
        INNER JOIN ctg_marcas ma USING (id_marca)
        WHERE id_modelo = ? AND estado_comentario=true
        ORDER BY puntuacion_comentario DESC';
        //echo $this->idModelo. ' que';
        $params = array($this->idModelo);

        return Database::getRows($sql, $params);
    }
    public function readByIdDetalle()
    {
        $sql = 'select id_modelo,id_comentario,id_detalle,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        CONCAT(descripcion_marca," ",descripcion_modelo) as modelo,contenido_comentario,
        puntuacion_comentario,estado_comentario,
        DATE_FORMAT(fecha_comentario, "%d-%m-%Y - %h:%i %p") AS fecha_comentario
        from prc_comentarios 
        INNER JOIN prc_detalle_pedidos dp USING(id_detalle)
        INNER JOIN prc_pedidos p USING(id_pedido)
        INNER JOIN prc_clientes c USING(id_cliente)
        INNER JOIN prc_modelo_tallas mt USING (id_modelo_talla)
        INNER JOIN prc_modelos mo USING (id_modelo)
        INNER JOIN ctg_marcas ma USING (id_marca)
        WHERE id_detalle = ?';
        //echo $this->idModelo. ' que';
        $params = array($this->idDetalle);

        return Database::getRows($sql, $params);
    }
    public function readByIdComentario()
    {
        $sql = 'select id_modelo,id_comentario,id_detalle,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        CONCAT(descripcion_marca," ",descripcion_modelo) as modelo,contenido_comentario,
        puntuacion_comentario,estado_comentario,
        DATE_FORMAT(fecha_comentario, "%d-%m-%Y - %h:%i %p") AS fecha_comentario
        from prc_comentarios 
        INNER JOIN prc_detalle_pedidos dp USING(id_detalle)
        INNER JOIN prc_pedidos p USING(id_pedido)
        INNER JOIN prc_clientes c USING(id_cliente)
        INNER JOIN prc_modelo_tallas mt USING (id_modelo_talla)
        INNER JOIN prc_modelos mo USING (id_modelo)
        INNER JOIN ctg_marcas ma USING (id_marca)
        WHERE id_comentario = ? ';
        //echo $this->idModelo. ' que';
        $params = array($this->id);

        return Database::getRows($sql, $params);
    }


    public function readOne()
    {
        $sql = 'select id_comentario,id_detalle,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        CONCAT(descripcion_marca," ",descripcion_modelo) as modelo,contenido_comentario,
        puntuacion_comentario,estado_comentario,
        DATE_FORMAT(cm.fecha_comentario, "%d-%m-%Y - %h:%i %p") AS fecha_comentario
        from prc_comentarios cm
        INNER JOIN prc_detalle_pedidos dp USING(id_detalle)
        INNER JOIN prc_pedidos p USING(id_pedido)
        INNER JOIN prc_clientes c USING(id_cliente)
        INNER JOIN prc_modelo_tallas mt USING (id_modelo_talla)
        INNER JOIN prc_modelos mo USING (id_modelo)
        INNER JOIN ctg_marcas ma USING (id_marca)
        WHERE id_comentario = ?
        ORDER BY fecha_comentario DESC, estado_comentario DESC';
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
        $sql = 'UPDATE prc_comentarios
                SET estado_comentario = ?
                WHERE id_comentario = ?';
        $params = array($this->estado,  $this->id);
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
