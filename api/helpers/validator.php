<?php
/*
*	Clase para validar todos los datos de entrada del lado del servidor.
*/
class Validator
{
    /*
    *   Atributos para manejar algunas validaciones.
    */
    private static $filename = null;
    private static $search_value = null;
    private static $password_error = null;
    private static $file_error = null;
    private static $search_error = null;

    // Método para obtener el error al validar una contraseña.
    public static function getPasswordError()
    {
        return self::$password_error;
    }

    // Método para obtener el nombre del archivo validado.
    public static function getFilename()
    {
        return self::$filename;
    }

    // Método para obtener el error al validar un archivo.
    public static function getFileError()
    {
        return self::$file_error;
    }

    // Método para obtener el valor de búsqueda.
    public static function getSearchValue()
    {
        return self::$search_value;
    }

    // Método para obtener el error al validar una búsqueda.
    public static function getSearchError()
    {
        return self::$search_error;
    }

    /*
    *   Método para sanear todos los campos de un formulario (quitar los espacios en blanco al principio y al final).
    *   Parámetros: $fields (arreglo con los campos del formulario).
    *   Retorno: arreglo con los campos saneados del formulario.
    */
    public static function validateForm($fields)
    {
        foreach ($fields as $index => $value) {
            $value = trim($value);
            $fields[$index] = $value;
        }
        return $fields;
    }

    /*
    *   Método para validar un número natural como por ejemplo llave primaria, llave foránea, entre otros.
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public static function validateNaturalNumber($value)
    {
        // Se verifica que el valor sea un número entero mayor o igual a uno.
        if (filter_var($value, FILTER_VALIDATE_INT, array('options' => array('min_range' => 1)))) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un archivo de imagen.
    *   Parámetros: $file (archivo de un formulario), $max_width (ancho máximo para la imagen) y $max_heigth (alto máximo para la imagen).
    *   Retorno: booleano (true si el archivo es correcto o false en caso contrario).
    */
    public static function validateImageFile($file, $max_width, $max_heigth)
    {
        if (is_uploaded_file($file['tmp_name'])) {
            // Se obtienen los datos de la imagen.
            $image = getimagesize($file['tmp_name']);
            // Se comprueba si el archivo tiene un tamaño mayor a 2MB.
            if ($file['size'] > 2097152) {
                self::$file_error = 'El tamaño de la imagen debe ser menor a 2MB';
                return false;
            } elseif ($image[0] > $max_width || $image[1] > $max_heigth) {
                self::$file_error = 'La dimensión de la imagen es incorrecta';
                return false;
            } elseif ($image['mime'] == 'image/jpeg' || $image['mime'] == 'image/png') {
                // Se obtiene la extensión del archivo (.jpg o .png) y se convierte a minúsculas.
                $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                // Se establece un nombre único para el archivo.
                self::$filename = uniqid() . '.' . $extension;
                return true;
            } else {
                self::$file_error = 'El tipo de imagen debe ser jpg o png';
                return false;
            }
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un correo electrónico.
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public static function validateEmail($value)
    {
        if (filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un dato booleano.
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public static function validateBoolean($value)
    {
        if ($value == 1 || $value == 0) {
            return true;
        } else {
            return false;
        }
    }
    /*
    *   Método para validar un dato char de un digito.
    *   Parámetros: $value (dato a validar).
    *   Retorno: Char (A si el valor es activo o I en caso que este inactivo).
    */
    public static function validateChar($value)
    {
        if ($value == "A" || $value == "I") {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar una cadena de texto (letras, digitos, espacios en blanco y signos de puntuación).
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public static function validateString($value)
    {
        // Se verifica el contenido y la longitud de acuerdo con la base de datos.
        if (preg_match('/^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s\,\;\.\/]+$/', $value)) {
            return true;
        } else {
            return false;
        }
    }    
    public static function validatePin($value)
    {
        // Se verifica el contenido y la longitud de acuerdo con la base de datos.
        if (preg_match('/^[a-zA-Z0-9]+$/', $value)) {
            return true;
        } else {
            return false;
        }
    }
    private static $forbiddenWords = [
        'puta',
        'mierda',
        'perra',
        'pendejo',
        'imbecil',
        'malparido',
        // Añade aquí las palabras soeces o no permitidas
    ];
    private static function normalize($string) {
        $replacements = [
            'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u',
            'à' => 'a', 'è' => 'e', 'ì' => 'i', 'ò' => 'o', 'ù' => 'u',
            'ä' => 'a', 'ë' => 'e', 'ï' => 'i', 'ö' => 'o', 'ü' => 'u',
            'â' => 'a', 'ê' => 'e', 'î' => 'i', 'ô' => 'o', 'û' => 'u',
            'ã' => 'a', 'õ' => 'o', 'ñ' => 'n', 'ç' => 'c',
            '0' => 'o', '1' => 'i', '2' => 'z', '3' => 'e', '4' => 'a',
            '5' => 's', '6' => 'b', '7' => 't', '8' => 'b', '9' => 'g',
            '@' => 'a', '$' => 's', '!' => 'i'
        ];
        $string = strtolower($string); // Convertir a minúsculas
        return strtr($string, $replacements); // Reemplazar caracteres
    }

    public static function validateWord($value)
    {
        $normalizedValue = self::normalize($value);
        foreach (self::$forbiddenWords as $word) {
            $normalizedWord = self::normalize($word);
            if (strpos($normalizedValue, $normalizedWord) !== false) {
                return false;
            }
        }
        return true;
    }

    /*
    *   Método para validar un dato alfabético (letras y espacios en blanco).
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public static function validateAlphabetic($value)
    {
        // Se verifica el contenido y la longitud de acuerdo con la base de datos.
        if (preg_match('/^[a-zA-ZñÑáÁéÉíÍóÓúÚ\s]+$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un dato alfanumérico (letras, dígitos y espacios en blanco).
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public static function validateAlphanumeric($value)
    {
        // Se verifica el contenido y la longitud de acuerdo con la base de datos.
        if (preg_match('/^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s]+$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar la longitud de una cadena de texto.
    *   Parámetros: $value (dato a validar), $min (longitud mínima) y $max (longitud máxima).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public static function validateLength($value, $min, $max)
    {
        // Se verifica la longitud de la cadena de texto.
        if (strlen($value) >= $min && strlen($value) <= $max) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un dato monetario.
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public static function validateMoney($value)
    {
        // Se verifica que el número tenga una parte entera y como máximo dos cifras decimales.
        if (preg_match('/^[0-9]+(?:\.[0-9]{1,2})?$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar una contraseña.
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */

    public static function validatePassword($value, $userData = [])
    {
        // Verificar longitud mínima de 8 caracteres.
        if (strlen($value) < 8) {
            self::$password_error = 'La contraseña es menor a 8 caracteres';
            return false;
        }

        // Verificar longitud máxima de 72 caracteres.
        if (strlen($value) > 72) {
            self::$password_error = 'La contraseña es mayor a 72 caracteres';
            return false;
        }

        // Verificar si la contraseña contiene espacios en blanco.
        if (preg_match('/\s/', $value)) {
            self::$password_error = 'La contraseña no debe contener espacios en blanco';
            return false;
        }

        // Verificar al menos 3 caracteres especiales.
        if (preg_match_all('/[!@#$%^&*(),.?":{}|<>]/', $value) < 1) {
            self::$password_error = 'La contraseña debe contener al menos 1 caracter especial';
            return false;
        }

        // Verificar que la contraseña no contenga datos del usuario.
        foreach ($userData as $data) {
            if (stripos($value, $data) !== false) {
                self::$password_error = 'La contraseña no debe contener datos del usuario (nombre, apellido, alias, correo)';
                return false;
            }
        }

        // Si todas las validaciones pasan, la contraseña es válida.
        return true;
    }
    /*
    *   Método para validar el formato del DUI (Documento Único de Identidad).
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public static function validateDUI($value)
    {
        // Se verifica que el número tenga el formato 00000000-0.
        if (preg_match('/^[0-9]{8}[-][0-9]{1}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un número telefónico.
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public static function validatePhone($value)
    {
        // Se verifica que el número tenga el formato 0000-0000 y que inicie con 2, 6 o 7.
        if (preg_match('/^[2,6,7]{1}[0-9]{3}[-][0-9]{4}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar una fecha.
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public static function validateDate($value)
    {
        // Se dividen las partes de la fecha y se guardan en un arreglo con el siguiene orden: año, mes y día.
        $date = explode('-', $value);
        if (checkdate($date[1], $date[2], $date[0])) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un valor de búsqueda.
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public static function validateSearch($value)
    {
        if (trim($value) == '') {
            self::$search_error = 'Ingrese un valor para buscar';
            return false;
        } elseif(str_word_count($value) > 3) {
            self::$search_error = 'La búsqueda contiene más de 3 palabras';
            return false;
        } elseif (self::validateString($value)) {
            self::$search_value = $value;
            return true;
        } else {
            self::$search_error = 'La búsqueda contiene caracteres prohibidos';
            return false;
        }
    }

    /*
    *   Método para validar un archivo al momento de subirlo al servidor.
    *   Parámetros: $file (archivo), $path (ruta del archivo) y $name (nombre del archivo).
    *   Retorno: booleano (true si el archivo fue subido al servidor o false en caso contrario).
    */
    public static function saveFile($file, $path)
    {
        if (!$file) {
            return false;
        } elseif (move_uploaded_file($file['tmp_name'], $path . self::$filename)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar el cambio de un archivo en el servidor.
    *   Parámetros: $file (archivo), $path (ruta del archivo) y $old_filename (nombre del archivo anterior).
    *   Retorno: booleano (true si el archivo fue subido al servidor o false en caso contrario).
    */
    public static function changeFile($file, $path, $old_filename)
    {
        if (!self::saveFile($file, $path)) {
            return false;
        } elseif (self::deleteFile($path, $old_filename)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un archivo al momento de borrarlo del servidor.
    *   Parámetros: $path (ruta del archivo) y $filename (nombre del archivo).
    *   Retorno: booleano (true si el archivo fue borrado del servidor o false en caso contrario).
    */
    public static function deleteFile($path, $filename)
    {
        if ($filename == 'default.png') {
            return true;
        } elseif (@unlink($path . $filename)) {
            return true;
        } else {
            return false;
        }
    }
}
