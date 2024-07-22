<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/clientes_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class ClienteData extends ClienteHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
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
        $this->search= $value;
        return true;
    }
    public function setNombre($value, $min = 2, $max = 50)
    {
        // Valida que el nombre sea alfabético y tenga la longitud correcta.
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El nombre debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setApellido($value, $min = 2, $max = 50)
    {
        // Valida que el apellido sea alfabético y tenga la longitud correcta.
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El apellido debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->apellido = $value;
            return true;
        } else {
            $this->data_error = 'El apellido debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setCorreo($value, $min = 8, $max = 100)
    {
        // Valida que el correo tenga el formato adecuado y la longitud correcta.
        if (!Validator::validateEmail($value)) {
            $this->data_error = 'El correo no es válido';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->email= $value;
            return true;
        } else {
            $this->data_error = 'El correo debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }
    public function setCorreoNew($value, $min = 8, $max = 100)
    {
        // Valida que el nuevo correo tenga el formato adecuado y la longitud correcta.
        if (!Validator::validateEmail($value)) {
            $this->data_error = 'El correo no es válido';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->newemail= $value;
            return true;
        } else {
            $this->data_error = 'El correo debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setUsuario($value, $min = 6, $max = 25)
    {
        // Valida que el nuevo correo tenga el formato adecuado y la longitud correcta.
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El usuario debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->usuario = $value;
            return true;
        } else {
            $this->data_error = 'El usuario tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }
    public function setTelefono($value)
    {
        // Valida que el teléfono tenga el formato correcto.
        if (Validator::validatePhone($value)) {
            $this->telefono = $value;
            return true;
        } else {
            $this->data_error = 'El teléfono debe tener el formato (2, 6, 7)###-####';
            return false;
        }
    }
    public function setPin($value)
    {
        // Valida que el teléfono tenga el formato correcto.
        if (Validator::validatePin($value)) {
            $this->pin = $value;
            return true;
        } else {
            $this->data_error = 'El pin contiene caractéres inválidos';
            return false;
        }
    }
    public function setDireccion($value, $min = 2, $max = 250)
    {
        // Valida que la dirección no tenga caracteres prohibidos y tenga la longitud correcta.
        if (!Validator::validateString($value)) {
            $this->data_error = 'La dirección contiene caracteres prohibidos';
            return false;
        } elseif(Validator::validateLength($value, $min, $max)) {
            $this->direccion = $value;
            return true;
        } else {
            $this->data_error = 'La dirección debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setClave($value)
    {
        // Valida y encripta la clave si es válida.
        if (Validator::validatePassword($value)) {
            //echo $value;
            $this->clave = password_hash($value, PASSWORD_DEFAULT);
            //echo $this->clave.' ';
            return true;
        } else {
            $this->data_error = Validator::getPasswordError();
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
