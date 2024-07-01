<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class DetallePedidoHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $id_pedido = null;
    protected $cantidad = null;
    protected $nota = null;
    protected $search = null;
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

    // Método para buscar filas que coincidan con el valor de búsqueda.
    public function searchRows($value)
    {
        $value = $value === '' ? '%%' : '%' . $value . '%';

        $sql = 'select id_detalle_pedido,id_pedido,id_producto,cantidad_pedido,
        descripcion_producto,imagen_producto,precio_producto,
        precio_producto * cantidad_pedido AS total_pedido,nota_pedido
        from tb_detalle_pedidos
        INNER JOIN tb_productos USING(id_producto)
        WHERE id_pedido=? AND descripcion_producto like ?
        ORDER BY tipo_producto';

        $params = array($this->id,$value);
        return Database::getRows($sql, $params);
    }

    // Método para buscar el historial de pedidos finalizados.
    public function searchHistorial()
    {
        $this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';

        $sql = 'SELECT id_cliente,id_detalle_pedido,id_producto,id_pedido,cantidad_pedido, 
        DATE_FORMAT(fecha_pedido, "%h:%i %p - %e %b %Y") AS fecha_pedido,
		descripcion_producto,precio_producto,cantidad_pedido,imagen_producto,
		(precio_producto*cantidad_pedido) as subtotal
        from tb_detalle_pedidos
        INNER JOIN tb_pedidos USING (id_pedido)
        INNER JOIN tb_productos USING (id_producto)
        WHERE estado_pedido ="Finalizado" AND id_cliente=? AND (descripcion_producto like ?)
        ORDER BY descripcion_producto';

        $params = array($_SESSION['idCliente'],$this->search);
        return Database::getRows($sql, $params);
    }

    // Método para buscar detalles de pedido por ID de pedido.
    public function searchByPedido()
    {
        //$this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';

        $sql = 'SELECT id_cliente,id_detalle_pedido,id_producto,id_pedido,cantidad_pedido, 
        DATE_FORMAT(fecha_pedido, "%h:%i %p - %e %b %Y") AS fecha_pedido,
		descripcion_producto,precio_producto,cantidad_pedido,imagen_producto,
		(precio_producto*cantidad_pedido) as subtotal
        from tb_detalle_pedidos
        INNER JOIN tb_pedidos USING (id_pedido)
        INNER JOIN tb_productos USING (id_producto) 
        WHERE id_pedido=?
        ORDER BY descripcion_producto';

        $params = array($this->id_pedido/*,$this->search*/);
        return Database::getRows($sql, $params);
    }

    // Método para crear un nuevo registro.
    public function createRow()
    {
        $sql = 'INSERT INTO prc_modelo_tallas(id_talla, id_modelo, stock_modelo_talla, precio_modelo_talla)
                VALUES(?, ?, ?, ?)';
        $params = array($this->idTalla, $this->idModelo, $this->existencias, $this->precio);
        return Database::executeRow($sql, $params);
    }

    // Método para leer todas las filas de la tabla.
    public function readAll()
    {
        $sql = 'select mt.id_modelo_talla,mt.id_talla,mt.id_modelo,mt.stock_modelo_talla,
        mt.precio_modelo_talla,t.descripcion_talla as talla
        from prc_modelo_tallas mt 
        INNER JOIN ctg_tallas t USING(id_talla)
        INNER JOIN prc_modelos m USING(id_modelo)
        WHERE mt.id_modelo = ?
        ORDER BY t.descripcion_talla';
        //echo $this->idModelo. ' que';
        $params = array($this->idModelo);
        
        return Database::getRows($sql, $params);
    }
    
    // Método para leer una fila específica de detalle_pedidos.
    public function readOne()
    {
        $sql ='select * from tb_detalle_pedidos where id_detalle_pedido=?';
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

    // Método para actualizar una fila de detalle_pedidos.
    public function updateRow()
    {
        $sql = 'UPDATE tb_detalle_pedidos 
                SET cantidad_pedido = ?, nota_pedido = ?
                WHERE id_detalle_pedido = ?';
        $params = array($this->cantidad, $this->nota,$this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar una fila de detalle_pedidos.
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_detalle_pedidos
                WHERE id_detalle_pedido = ?';
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
