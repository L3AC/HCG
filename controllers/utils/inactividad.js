const tiempoInactividad = 60000; // 1 minuto en milisegundos (total de inactividad permitida)
const tiempoAdvertencia = 50000; // 50 segundos en milisegundos (cuando se debe mostrar la advertencia)
const tiempoRestanteAdvertencia = tiempoInactividad - tiempoAdvertencia; // Tiempo restante después de la advertencia (10 segundos)

let temporizador;
let temporizadorAdvertencia;
let tiempoUltimaActividad = Date.now();
let advertenciaMostrada = false;
let countdownInterval;

function resetearTemporizador() {
    clearTimeout(temporizador);
    clearTimeout(temporizadorAdvertencia);
    clearInterval(countdownInterval); // Limpiar el temporizador de cuenta atrás
    document.getElementById('mensaje').style.display = 'none'; // Ocultar el mensaje
    tiempoUltimaActividad = Date.now(); // Actualizar el tiempo de la última actividad
    advertenciaMostrada = false; // Restablecer el estado de advertencia

    // Configurar los temporizadores
    // Temporizador para mostrar la advertencia después de 50 segundos
    temporizadorAdvertencia = setTimeout(mostrarAdvertencia, tiempoAdvertencia);

    // Temporizador para cerrar la sesión después de 1 minuto total de inactividad
    temporizador = setTimeout(cerrarSesion, tiempoInactividad);
}

function mostrarAdvertencia() {
    if (!advertenciaMostrada) {
        advertenciaMostrada = true;

        // Calcular el tiempo restante para el cierre de sesión después de mostrar la advertencia
        const tiempoRestante = Math.max(0, Math.ceil((tiempoInactividad - Date.now() + tiempoUltimaActividad) / 1000));
        
        // Mostrar advertencia utilizando sweetAlert2
        Swal.fire({
            title: 'Tu sesión está a punto de expirar',
            html: `Por favor, haz clic para seguir activo.<br><br><b>Tiempo restante: <span id="countdown">${tiempoRestante}</span> segundos</b>`,
            timer: tiempoRestante * 1000, // Convertir segundos a milisegundos
            timerProgressBar: true,
            didOpen: () => {
                const countdownDisplay = Swal.getContent().querySelector('#countdown');
                countdownInterval = setInterval(() => {
                    const tiempoRestante = Math.max(0, Math.ceil(Swal.getTimerLeft() / 1000));
                    countdownDisplay.textContent = tiempoRestante;
                }, 1000);

                Swal.showLoading();
            },
            willClose: () => {
                clearInterval(countdownInterval); // Limpiar el temporizador de cuenta atrás
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Recargar la página cuando se acepte la advertencia
                resetearTemporizador();
            } else {
                // Si no se acepta la advertencia, recargar la página después del tiempo restante
                setTimeout(() => {
                    location.reload(); // Recargar la página después de que pase el tiempo total
                }, tiempoRestante * 1000); // Convertir segundos a milisegundos
            }
        });
    }
}

const cerrarSesion = async () => {
    // Se verifica la respuesta del mensaje.
    // Petición para eliminar la sesión.
    const DATA = await fetchData(USER_API, 'logOut');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        Swal.fire({
            icon: 'success',
            title: DATA.message,
            allowOutsideClick: false
        }).then(() => {
            location.href = 'index.html';
        });
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'La sesión será cerrada por inactividad',
            text: 'Mueve el mouse para volver',
            allowOutsideClick: false
        });
    }
}

function manejarVisibilidad() {
    if (document.visibilityState === 'visible') {
        resetearTemporizador();
    }
}

function comprobarInactividad() {
    if (Date.now() - tiempoUltimaActividad > tiempoInactividad) {
        cerrarSesion();
    }
}

function manejarScroll() {
    // Si hay scroll, actualizar el tiempo de la última actividad
    tiempoUltimaActividad = Date.now();
}

// Configurar los eventos
document.addEventListener('mousemove', resetearTemporizador);
document.addEventListener('keypress', resetearTemporizador);
document.addEventListener('visibilitychange', manejarVisibilidad);
document.addEventListener('scroll', manejarScroll);

// Iniciar los temporizadores
resetearTemporizador(); // Configura los temporizadores al cargar la página

// Revisar la inactividad en intervalos regulares
setInterval(comprobarInactividad, 1000); // Comprobar cada segundo
