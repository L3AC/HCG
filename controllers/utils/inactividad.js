const tiempoInactividad = 10000; // 10 segundos en milisegundos
const tiempoAdvertencia = 5000; // 5 segundos en milisegundos (para mostrar el mensaje de advertencia)
let temporizador;
let temporizadorAdvertencia;
let tiempoUltimaActividad = Date.now();
let advertenciaMostrada = false;

function resetearTemporizador() {
    clearTimeout(temporizador);
    clearTimeout(temporizadorAdvertencia);
    document.getElementById('mensaje').style.display = 'none'; // Ocultar el mensaje
    tiempoUltimaActividad = Date.now(); // Actualizar el tiempo de la última actividad
    advertenciaMostrada = false; // Restablecer el estado de advertencia

    // Configurar los temporizadores
    temporizadorAdvertencia = setTimeout(mostrarAdvertencia, tiempoInactividad - tiempoAdvertencia);
    temporizador = setTimeout(logOut2, tiempoInactividad);
}

function mostrarAdvertencia() {
    if (!advertenciaMostrada) {
        advertenciaMostrada = true;
        sweetAlert(4, 'Tu sesión está a punto de expirar. Por favor, haz clic para seguir activo.', false);
    }
}

function manejarVisibilidad() {
    if (document.visibilityState === 'visible') {
        resetearTemporizador();
    }
}


function comprobarInactividad() {
    if (Date.now() - tiempoUltimaActividad > tiempoInactividad) {
        logOut2();
    }
}

// Configurar los eventos
document.addEventListener('mousemove', resetearTemporizador);
document.addEventListener('keypress', resetearTemporizador);
document.addEventListener('visibilitychange', manejarVisibilidad);

// Iniciar los temporizadores
resetearTemporizador(); // Configura los temporizadores al cargar la página

// Revisar la inactividad en intervalos regulares
setInterval(comprobarInactividad, 1000); // Comprobar cada segundo
