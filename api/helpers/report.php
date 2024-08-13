<?php
// Se incluye la clase para generar archivos PDF.
require_once('../../libraries/fpdf185/fpdf.php');

/*
*   Clase para definir las plantillas de los reportes del sitio privado.
*   Para más información http://www.fpdf.org/
*/
class Report extends FPDF
{
    // Constante para definir la ruta de las vistas del sitio privado.
    const CLIENT_URL = 'http://localhost/HCG/views/admin/';
    // Propiedad para guardar el título del reporte.
    private $title = null;
    // Propiedad para guardar el subtítulo del reporte.
    private $subtitle = null;

    /*
    *   Método para iniciar el reporte con el encabezado del documento.
    *   Parámetros: $title (título del reporte).
    *   Retorno: ninguno.
    */
    public function startReport($title, $subtitle = '')
    {
        // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en los reportes.
        session_start();
        // Se verifica si un administrador ha iniciado sesión para generar el documento, de lo contrario se direcciona a la página web principal.
        if (isset($_SESSION['idUsuario'])) {
            // Se asigna el título del documento a la propiedad de la clase.
            $this->title = $title;
            $this->subtitle = $subtitle;
            // Se establece el título del documento (true = utf-8).
            $this->setTitle('HCG - Reporte', true);
            $this->setTitle('HCG - Reporte', true);
            // Se establecen los margenes del documento (izquierdo, superior y derecho).
            $this->setMargins(15, 15, 15);
            // Se añade una nueva página al documento con orientación vertical y formato carta, llamando implícitamente al método header()
            $this->addPage('p', 'letter');
            // Se define un alias para el número total de páginas que se muestra en el pie del documento.
            $this->aliasNbPages();
        } elseif(isset($_SESSION['idCliente'])) {
            // Se asigna el título del documento a la propiedad de la clase.
            $this->title = $title;
            $this->subtitle = $subtitle;
            // Se establece el título del documento (true = utf-8).
            $this->setTitle('HCG - Reporte', true);
            $this->setTitle('HCG - Reporte', true);
            // Se establecen los margenes del documento (izquierdo, superior y derecho).
            $this->setMargins(15, 15, 15);
            // Se añade una nueva página al documento con orientación vertical y formato carta, llamando implícitamente al método header()
            $this->addPage('p', 'letter');
            // Se define un alias para el número total de páginas que se muestra en el pie del documento.
            $this->aliasNbPages();
        }
        else{
            header('location:' . self::CLIENT_URL);
        }
    }

    /*
    *   Método para codificar una cadena de alfabeto español a UTF-8.
    *   Parámetros: $string (cadena).
    *   Retorno: cadena convertida.
    */
    public function encodeString($string)
    {
        return mb_convert_encoding($string, 'ISO-8859-1', 'utf-8');
    }

    /*
    *   Se sobrescribe el método de la librería para establecer la plantilla del encabezado de los reportes.
    *   Se llama automáticamente en el método addPage()
    */
    public function header()
    {
        // Se establece la imagen de fondo (el tamaño puede necesitar ajustes según tu imagen y formato de página).
        $this->image('../../images/bgreport.png', 0, 0, 216, 279);
        // Se establece el logo.
        $this->image('../../images/logo.png', 8, 10, 30);
        // Se ubica la fecha y hora del servidor.
        $this->setFont('Arial', 'I', 13);
        $this->cell(0, 10, 'Fecha: ' . date('d-m-Y') .'     '. 'Hora: ' . date('H:i:s'), 0, 1, 'C');
        // Se ubica el título.
        $this->setFont('Arial', 'B', 20);
        $this->cell(0, 10, $this->encodeString($this->title), 0, 1, 'C');
        // Subtítulo
        if ($this->subtitle) {
            $this->setFont('Arial', '', 15);
            $this->cell(0, 10, $this->encodeString($this->subtitle), 0, 1, 'C');
        }

        $solicitud='';
        if (isset($_SESSION['idUsuario'])) {
            // Si la variable de sesión está establecida, asigna su valor a $solicitud
            $solicitud = $_SESSION['usuarion'];
        } elseif (isset($_SESSION['idCliente'])){
            $solicitud = $_SESSION['usuarioc'];
        }
        else {
            $solicitud = '';
        }
        $this->setFont('Arial', 'I', 10);
        $this->cell(0, 10, 'Solicitado por ' . $solicitud,0, 1, 'C');
        // Se agrega un salto de línea para mostrar el contenido principal del documento.
        $this->ln(7);
    }


    /*
    *   Se sobrescribe el método de la librería para establecer la plantilla del pie de los reportes.
    *   Se llama automáticamente en el método output()
    */
    public function footer()
    {
        // Se establece la posición para el número de página (a 15 milímetros del final).
        $this->setY(-12);
        $this->setX(200);
        // Se establece la fuente para el número de página.
        $this->setFont('Arial', 'I', 20);
        $this->SetTextColor(237, 237, 237);
        // Se imprime una celda con el número de página.
        $this->cell(0, 10, $this->encodeString('Página ') . $this->pageNo() . '/{nb}', 0, 0, 'C');
    }
}
?>
