<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/admin/1productos_handler.php');
/*
 *	Clase para manejar el encapsulamiento de los datos de la tabla PRODUCTO.
 */
class ProductoData extends ProductoHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;
    private $filename = null;

    /*
     *   Métodos para validar y establecer los datos.
     */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
            return false;
        }
    }

    /*
 * Establece el nombre del modelo.
 */
    public function setNombre($value, $min = 2, $max = 50)
    {
        // Validación del nombre.
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
    public function setTipoProducto($value)
    {
        $this->tipoproducto = $value;
        return true;
    }

    public function setHorario($value)
    {
        $this->horario = $value;
        return true;
    }

    public function setURL($value)
    {
        $this->url = $value;
        return true;
    }

    /*
 * Establece la descripción del modelo.
 */
    public function setDescripcion($value, $min = 2, $max = 250)
    {
        // Validación de la descripción.
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

    /*
 * Establece el precio del modelo.
 */
    public function setPrecio($value)
    {
        // Validación del precio.
        if (Validator::validateMoney($value)) {
            $this->precio = $value;
            return true;
        } else {
            $this->data_error = 'El precio debe ser un valor numérico';
            return false;
        }
    }

    /*
 * Establece las existencias del modelo.
 */
    public function setExistencias($value)
    {
        // Validación de las existencias.
        if (Validator::validateNaturalNumber($value)) {
            $this->existencias = $value;
            return true;
        } else {
            $this->data_error = 'El valor de las existencias debe ser numérico entero';
            return false;
        }
    }

    /*
 * Establece la imagen del modelo.
 */
    public function setImagen($file, $filename = null)
    {
        // Validación de la imagen.
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

    /*
 * Establece la categoría del modelo.
 */
    public function setCategoria($value)
    {
        // Validación del identificador de la categoría.
        if (Validator::validateNaturalNumber($value)) {
            $this->categoria = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
            return false;
        }
    }

    /*
 * Establece el estado del modelo.
 */
    public function setEstado($value)
    {
        // Validación del estado.
        if (Validator::validateBoolean($value)) {
            $this->estado = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }
    public function setLunes($value)
    {
        // Validación del estado.
        if (Validator::validateBoolean($value)) {
            $this->lunes = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }
    public function setMartes($value)
    {
        // Validación del estado.
        if (Validator::validateBoolean($value)) {
            $this->martes = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }
    public function setMiercoles($value)
    {
        // Validación del estado.
        if (Validator::validateBoolean($value)) {
            $this->miercoles = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }
    public function setJueves($value)
    {
        // Validación del estado.
        if (Validator::validateBoolean($value)) {
            $this->jueves = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }
    public function setViernes($value)
    {
        // Validación del estado.
        if (Validator::validateBoolean($value)) {
            $this->viernes = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }
    public function setSabado($value)
    {
        // Validación del estado.
        if (Validator::validateBoolean($value)) {
            $this->sabado = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }
    public function setDomingo($value)
    {
        // Validación del estado.
        if (Validator::validateBoolean($value)) {
            $this->domingo = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }

    /*
 * Establece el nombre de archivo.
 */
    public function setFilename()
    {
        // Obtiene el nombre de archivo desde la lectura.
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
    public function getDataError()
    {
        return $this->data_error;
    }

    public function getFilename()
    {
        return $this->filename;
    }
}
