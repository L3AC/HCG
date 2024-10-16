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

	$mail->Subject = 'Pedido listo';

	$mail->isHTML(true); //permite que el contenido del correo sea HTML
	$mail->CharSet = 'utf-8'; //para que acepte caracteres en español
	$html = "
<html>
<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #d29967;
            color: #333;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* Aseguramos que el body ocupe toda la ventana */
        }
        .container {
            background-color: #d29967;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            max-width: 300px;
            border: 1px solid #e1cbb8;
            text-align: center; /* Para centrar el texto y las imágenes dentro del contenedor */
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #333;
            margin-bottom: 15px;
        }
        .image-container {
            background-color: transparent;
            width: 120px;
            height: 120px;
            border-radius: 15px;
            margin: 20px auto;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .image-container img {
            width: 100px;
            height: 100px;
            border-radius: 12px;
        }
        .footer {
            margin-top: 30px;
        }
        .footer img {
            width: 100px;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>Pedido</div>
        <div class='message'>Ya está listo su pedido</div>
        <div class='image-container'>
            <img src='https://media.tenor.com/ddQyyssPlO4AAAAi/dinkdonk-peepo.gif' alt='Pedido'>
        </div>
        <div class='footer'>
            <img src='https://i.ibb.co/4p96gTW/hcg.jpg' alt='HCG'>
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
