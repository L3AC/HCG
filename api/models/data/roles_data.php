<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/roles_handler.php');
/*
 *	Clase para manejar el encapsulamiento de los datos de la tabla PRODUCTO.
 */
class RolData extends RolHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;
    private $filename = null;

    /*
     *   Métodos para validar y establecer los datos.
     */

     // Método para establecer el ID del rol.
    public function setId($value)
    {
        // Validar si el valor es un número natural.
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
            return false;
        }
    }

    // Método para establecer el término de búsqueda.
    public function setSearch($value)
    {
        $this->search= $value;
        return true;
    }

    // Método para establecer la descripción del rol con validación de longitud.
    public function setDescripcion($value, $min = 2, $max = 250)
    {
        if (!Validator::validateString($value)) {
            $this->data_error = 'La descripción contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->descripcion = $value;
            return true;
        } else {
            $this->data_error = 'La descripción debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para establecer el estado del rol.
    public function setEstado($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->estado = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }

    // Método para establecer el permiso de acceso a productos.
    public function setProducto($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->productos = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }

    // Método para establecer el permiso de acceso a pedidos.
    public function setPedido($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->pedidos = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }

    // Método para establecer el permiso de acceso a tipos de ítems.
    public function setTipoItem($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->tipoitems = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }

    // Método para establecer el permiso de acceso a ítems.
    public function setItem($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->items = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }

    // Método para establecer el permiso de acceso a clientes.
    public function setCliente($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->clientes = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }
    
    // Método para establecer el permiso de acceso a usuarios.
    public function setUsuario($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->usuarios = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }

    // Método para establecer el permiso de acceso a roles.
    public function setRol($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->roles = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }

    // Método para establecer el nombre del archivo de la imagen.
    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['imagen_producto'];
            return true;
        } else {
            $this->data_error = 'Producto inexistente';
            return false;
        }
    }

    /*
     *  Métodos para obtener los atributos adicionales.
     */

     // Método para obtener el mensaje de error.
    public function getDataError()
    {
        return $this->data_error;
    }

    // Método para obtener el nombre del archivo de la imagen.
    public function getFilename()
    {
        return $this->filename;
    }
}
