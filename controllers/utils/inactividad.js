


let tiempoInactividad = 300000; // 10 minutos en milisegundos
let tiempoAdvertencia = 300000; // 9 minutos en milisegundos (para mostrar el mensaje de advertencia)
let tiempoUltimaActividad = Date.now();
let temporizador;

function resetearTemporizador() {
    clearTimeout(temporizador);
    tiempoUltimaActividad = Date.now();
    //document.getElementById('mensaje').style.display = 'none'; // Ocultar el mensaje
    temporizador = setTimeout(logOut2, tiempoInactividad);
    
}


function mostrarAdvertencia() {
   // document.getElementById('mensaje').style.display = 'block'; // Mostrar el mensaje
}

document.addEventListener('mousemove', resetearTemporizador);
document.addEventListener('keypress', resetearTemporizador);

// Mostrar mensaje de advertencia antes de cerrar la sesión
setTimeout(mostrarAdvertencia, tiempoAdvertencia);
temporizador = setTimeout(logOut2, tiempoInactividad);