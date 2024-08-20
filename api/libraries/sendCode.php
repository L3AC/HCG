
<?php
//require_once('../../PHPMailer/PHPMailerAutoload.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require_once('./PHPMailer/src/Exception.php');
require_once('./PHPMailer/src/PHPMailer.php');
require_once('./PHPMailer/src/SMTP.php');
//include_once('./config.php');

header('Content-type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
header("Access-Control-Allow-Methods: GET,PUT,POST,DELETE,PATCH,OPTIONS");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    die();
}
$user = isset($_POST['user']) ? $_POST['user'] : '';
$pin = isset($_POST['pin']) ? $_POST['pin'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';

//ENVIO DE CORREO PARA NOTIFICACION DE ASIGNACION
ini_set("sendmail_from", "noreply@gi-sv.com");
//extracion de la informacion que se quiere enviar

/*********************************************************/
//Create a new PHPMailer instance
//if (isset($_GET['accion'])=='M') {
try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPDebug = 0;
    //Ask for HTML-friendly debug output
    $mail->Debugoutput = 'html';

    $mail->setFrom("leac.2xy@gmail.com"); //$email; //remitente
    //$mail->setFrom($email, "MUSA"); //$email; //remitente
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'ssl'; // 'STARTTLS'; //seguridad
    //Set the hostname of the mail server
    $mail->Host = "smtp.gmail.com"; //"smtp.office365.com"; // servidor smtp, para este caso es el de office, se podria cambiar al de gmail o yahoo
    //Set the SMTP port number - likely to be 25, 465 or 587
    $mail->Port = 465; // 587; //puerto
    $mail->Username = "leac.2xy@gmail.com"; //nombre usuario
    $mail->Password = "achzpgqiuozwabhd"; //contraseña

    //Set who the message is to be sent to
    $mail->addAddress($email/*"email de los destinatarios", "nombre para que se refleje en el correo"*/); //destinatario
    //$mail->SMTPDebug = SMTP::DEBUG_SERVER; //sirve para que envie la traza de las acciones que realiza el API

    $mail->Subject = 'Recuperacion de contraseña';

    $mail->isHTML(true); //permite que el contenido del correo sea HTML
    $mail->CharSet = 'utf-8'; //para que acepte caracteres en español
    $html = "
<html>
<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #f4f1ee, #d8cfc4);
            color: #333;
            text-align: center;
            padding: 50px;
            margin: 0;
        }
        .container {
            background: #d7bd9c;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            max-width: 450px;
            margin: auto;
            border: 1px solid #e1cbb8;
        }
        .header {
            font-size: 26px;
            font-weight: bold;
            color: #1f1f1f;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        .icon {
            margin: 20px 0;
        }
        .icon img {
            width: 120px;
            border-radius: 50%;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .greeting {
            font-size: 18px;
            color: #1f1f1f;
            margin-bottom: 10px;
        }
        .pin {
            font-size: 42px;
            letter-spacing: 8px;
            padding: 15px;
            background: linear-gradient(135deg, #dda35d, #d28a33);
            color: #fff;
            border-radius: 8px;
			border-width: 5px;
			border-color: #333;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            display: inline-block;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999;
        }
        .footer img {
            width: 120px;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>Recuperación de clave</div>
        <div class='greeting'>Hola $user, aquí tienes tu PIN de seguridad para que puedas recuperar el acceso rápidamente.

			Si necesitas más ayuda, estamos aquí para asistirte.
			
			Saludos</div>
        <div class='greeting'>PIN DE SEGURIDAD</div>
        <div class='pin'>$pin</div>
        <div class='footer'>
            <img src='data:image/png;base64,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' alt=''>
        </div>
    </div>
</body>
</html>
";
    $mail->msgHTML($html);
    //echo $html;

    //envío del correo y captura de errores
    if (!$mail->send()) {
        $json = array("status" => 0, "info" => "Correo no se pudo enviar.<br>" . $mail->ErrorInfo);
    } else {
        $json = array("status" => 1, "info" => "Correo enviado.");
    }
} catch (Exception $e) { //manejo de errores
    if (strstr(strtoupper($conn->error), "ERROR")) {
        $json = array("status" => 0, "info" => $e->getMessage() . "(90003)");
        //sendMsg('[MyPets][Nombre del servicio-opcion]ERROR: colocar un error entendible (90032) (colocar las variables del error)');
    } else {
        $json = array("status" => 0, "info" => $e->getMessage() . " No se encontró la cuenta de correo (90004)");
        //sendMsg('[MyPets][Nombre del servicio-opcion]ERROR: colocar un error entendible (90032) (colocar las variables del error)');
    }
}
/*} else {

}*/
