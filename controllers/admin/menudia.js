const MENU_API = 'services/admin/productos.php';
const CONJUNTOS = document.getElementById('conjuntos');
const COMPLEMENTOS = document.getElementById('complementos');
const FECHA = document.getElementById('MAIN_TITLE');
const TIME_TEXT = document.getElementById('TIME');


document.addEventListener('DOMContentLoaded', async () => {

    // Constante para obtener el número de horas.
    const HOUR = new Date().getHours();
    // Se define una variable para guardar un saludo.
    let greeting = '';
    // Dependiendo del número de horas transcurridas en el día, se asigna un saludo para el usuario.
    if (HOUR < 12) {
        greeting = 'Buenos días';
    } else if (HOUR < 19) {
        greeting = 'Buenas tardes';
    } else if (HOUR <= 23) {
        greeting = 'Buenas noches';
    }
    // Petición para obtener las categorías disponible
    FECHA.textContent = `${greeting}`;

    // Constante para obtener el número de horas.
    const TIME = new Date().getHours();
    let time = '';
    // Dependiendo del número de horas transcurridas en el día, se asigna un saludo para el usuario.
    if (TIME < 12) {
        time = 'el desayuno';
    } else if (TIME < 19) {
        time = 'el almuerzo';
    } else if (TIME <= 23) {
        time = 'la cena';
    }

    TIME_TEXT.textContent = `Platillos de ${time}`;

    const DATA = await fetchData(MENU_API, 'menuProductos');
    console.log(DATA);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializa el contenedor de categorías.
        CONJUNTOS.innerHTML = '';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.conjunto.forEach(row => {
            // Se crean y concatenan las tarjetas con los datos de cada categoría.
            CONJUNTOS.innerHTML += `
            <div class="menu-item">
                <p>${row.descripcion_producto}</p>
                <p class="price">$${row.precio_producto}</p>
            </div>
                `;
        });
        // Se inicializa el contenedor de categorías.
        COMPLEMENTOS.innerHTML = '';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.complementario.forEach(row => {
            // Se crean y concatenan las tarjetas con los datos de cada categoría.
            /*col-sm-12 col-md-6 col-lg-3*/
            COMPLEMENTOS.innerHTML += `
                <div class="menu-item">
                <p>${row.descripcion_producto}</p>
                <p class="price">$${row.precio_producto}</p>
            </div>`;
        });
    }
    else {
        // Se asigna al título del contenido de la excepción cuando no existen datos para mostrar.

    }

});