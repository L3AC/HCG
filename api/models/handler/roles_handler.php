<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class RolHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $estado = null;
    protected $descripcion = null;
    protected $productos = null;
    protected $pedidos = null;
    protected $tipoitems = null;
    protected $items = null;
    protected $clientes = null;
    protected $usuarios = null;
    protected $roles = null;
    protected $search = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/modelos/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';

        $sql = 'SELECT id_rol, descripcion_rol, estado_rol, productos_opc, pedidos_opc, 
        tipo_items_opc, items_opc, clientes_opc, usuarios_opc, roles_opc
        FROM tb_roles
        WHERE id_rol != (SELECT MIN(id_rol) as id_rol FROM tb_roles)  AND descripcion_rol like ?
        ORDER BY descripcion_rol';

        $params = array($this->search);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'insert into tb_roles (id_rol, descripcion_rol, estado_rol, 
        productos_opc, pedidos_opc, tipo_items_opc, items_opc, clientes_opc,
         usuarios_opc, roles_opc) 
        values((SELECT get_next_id("tb_roles")), ?, ?, ?, ?, ?, ?, ?, ?, false);';
        $params = array(
            $this->descripcion, $this->estado, $this->productos, $this->pedidos, $this->tipoitems,
            $this->items,$this->clientes, $this->usuarios
        );
        return Database::executeRow($sql, $params);
    }
    public function fillSelect()
    {
        $sql = 'SELECT id_rol, descripcion_rol, estado_rol, productos_opc, pedidos_opc, 
        tipo_items_opc, items_opc, clientes_opc, usuarios_opc, roles_opc
        FROM tb_roles
        WHERE id_rol != (SELECT MIN(id_rol) as id_rol FROM tb_roles)
        and id_rol!=? AND estado_rol=true
        ORDER BY descripcion_rol';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }


    public function readAll()
    {
        $sql = 'SELECT id_rol, descripcion_rol, estado_rol, productos_opc, pedidos_opc, 
        tipo_items_opc, items_opc, clientes_opc, usuarios_opc, roles_opc
        FROM tb_roles
        WHERE id_rol !=(SELECT MIN(id_rol) as id_rol FROM tb_roles)
        ORDER BY estado_rol DESC;';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_rol, descripcion_rol, estado_rol, productos_opc, pedidos_opc, 
        tipo_items_opc, items_opc, clientes_opc, usuarios_opc, roles_opc
        FROM tb_roles
        WHERE id_rol=? ';
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
        $sql = 'UPDATE tb_roles
                SET descripcion_rol = ?,estado_rol = ?,productos_opc = ?, pedidos_opc = ?, tipo_items_opc = ?,
                 items_opc = ?, clientes_opc= ?,usuarios_opc= ?
                WHERE id_rol = ?';
        $params = array($this->descripcion, $this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_roles
                WHERE id_rol = ?';
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
        $params = array($this->id);
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
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }
}
