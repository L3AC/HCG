<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/items_handler.php');
/*
 *	Clase para manejar el encapsulamiento de los datos de la tabla PRODUCTO.
 */
class ItemData extends ItemHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;
    private $filename = null;

    /*
     *   Métodos para validar y establecer los datos.
     */

    // Método para establecer el ID del ítem.
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

    // Método para establecer el ID del tipo de ítem.
    public function setIdTipoItem($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idTipoItem = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
            return false;
        }
    }

    // Método para establecer el ID del producto.
    public function setIdProducto($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idProducto = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
            return false;
        }
    }

    // Método para establecer el nombre del ítem con validación de longitud.
    public function setNombre($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para establecer el nombre de la talla con validación de longitud.
    public function setNombretalla($value, $min = 1, $max = 2)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para establecer la descripción del ítem con validación de longitud.
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

    // Método para establecer el precio del ítem.
    public function setPrecio($value)
    {
        if (Validator::validateMoney($value)) {
            $this->precio = $value;
            return true;
        } else {
            $this->data_error = 'El precio debe ser un valor numérico';
            return false;
        }
    }

    // Método para establecer la cantidad de existencias del ítem.
    public function setTalla($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->existencias = $value;
            return true;
        } else {
            $this->data_error = 'El valor de las existencias debe ser numérico entero';
            return false;
        }
    }

    // Método para establecer la imagen del ítem.
    public function setImagen($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 500, 500)) {
            $this->imagen = Validator::getFileName();
            return true;
        } elseif (Validator::getFileError()) {
            return false;
        } elseif ($filename) {
            $this->imagen = $filename;
            return true;
        } else {
            $this->imagen = 'default.png';
            return true;
        }
    }

    // Método para establecer la categoría del ítem.
    public function setCategoria($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->categoria = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
            return false;
        }
    }

    // Método para establecer el estado del ítem.
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
