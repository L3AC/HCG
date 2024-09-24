<?php
// Encabezado para permitir solicitudes de cualquier origen.
header('Access-Control-Allow-Origin: *');
// Se establece la zona horaria local para la fecha y hora del servidor.
date_default_timezone_set('America/El_Salvador');
// Constantes para establecer las credenciales de conexión con el servidor de bases de datos.
define('SERVER', 'localhost');
define('DATABASE', 'db_hcg');
//define('USERNAME', 'hcguser');
//define('PASSWORD', 'hcguser');
define('USERNAME', 'root');
<<<<<<< HEAD
define('PASSWORD', 'pasf2'); 
//define('USERNAME', 'root');
//define('PASSWORD', '');

=======
define('PASSWORD', '');
>>>>>>> d810b7c4cad9b9619a36881adc6341b4da3540dc
?>
