<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/detallepedidos_handler.php');
/*
 *	Clase para manejar el encapsulamiento de los datos de la tabla PRODUCTO.
 */
class DetallePedidoData extends DetallePedidoHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null; // Para almacenar errores de validación.
    private $filename = null; // Para almacenar el nombre del archivo de imagen.

    /*
     *   Métodos para validar y establecer los datos.
     */
    public function setId($value)
    {
        // Valida que el ID sea un número natural.
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
            return false;
        }
    }
    public function setIdPedido($value)
    {
        // Valida que el ID del pedido sea un número natural.
        if (Validator::validateNaturalNumber($value)) {
            $this->id_pedido = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
            return false;
        }
    }
    public function setCantidad($value)
    {
        // Valida que la cantidad sea un número entero.
        if (Validator::validateNaturalNumber($value)) {
            $this->cantidad = $value;
            return true;
        } else {
            $this->data_error = 'La cantidad debe ser un numero entero';
            return false;
        }
    }
    public function setNota($value, $min = 2, $max = 250)
    {
        // Valida que la nota cumpla con los requisitos de formato y longitud.
        if(empty($value)){
            $value='Nota vacía';
            $this->nota = $value;
            return true;
        }
        elseif (!Validator::validateString($value)) {
            $this->data_error = 'La nota contiene caracteres prohibidos';
            return false;
        } elseif (!Validator::validateLength($value, $min, $max)) {
            $this->data_error = 'La nota debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }  elseif (!Validator::validateWord($value)) {
            $this->data_error = 'La nota contiene palabras prohibidas';
            return false;
        }else {
            $this->nota = $value;
            return true;
        }
    }
    public function setIdModelo($value)
    {
        // Valida que el ID del modelo sea un número natural.
        if (Validator::validateNaturalNumber($value)) {
            $this->idModelo = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del modelo es incorrecto';
            return false;
        }
    }
    public function setIdTalla($value)
    {
        // Valida que el ID de la talla sea un número natural.
        if (Validator::validateNaturalNumber($value)) {
            $this->idTalla = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
            return false;
        }
    }
    public function setPrecio($value)
    {
        // Valida que el precio sea un valor numérico adecuado.
        if (Validator::validateMoney($value)) {
            $this->precio = $value;
            return true;
        } else {
            $this->data_error = 'El precio debe ser un valor numérico';
            return false;
        }
    }

    public function setExistencias($value)
    {
        // Valida que el valor de existencias sea un número entero.
        if (Validator::validateNaturalNumber($value)) {
            $this->existencias = $value;
            return true;
        } else {
            $this->data_error = 'El valor de las existencias debe ser numérico entero';
            return false;
        }
    }


    public function setNombre($value, $min = 2, $max = 50)
    {
        // Valida que el nombre sea alfanumérico y tenga la longitud correcta.
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

    public function setDescripcion($value, $min = 2, $max = 250)
    {
        // Valida que la descripción no tenga caracteres prohibidos y tenga la longitud correcta.
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


    public function setImagen($file, $filename = null)
    {
        // Valida y maneja la carga de la imagen.
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

    public function setCategoria($value)
    {
        // Valida que la categoría sea un número natural.
        if (Validator::validateNaturalNumber($value)) {
            $this->categoria = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
            return false;
        }
    }

    public function setEstado($value)
    {
        // Valida que el estado sea un booleano.
        if (Validator::validateBoolean($value)) {
            $this->estado = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }

    public function setSearch($value)
    {
        // Asigna el valor de búsqueda.
        $this->search = $value;
        return true;
    }

    public function setFilename()
    {
        // Obtiene el nombre del archivo de imagen si el producto existe.
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
