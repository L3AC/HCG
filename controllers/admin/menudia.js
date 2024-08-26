const MENU_API = 'services/admin/productos.php';
const CONJUNTOS = document.getElementById('conjuntos');
const COMPLEMENTOS = document.getElementById('complementos');
const FECHA = document.getElementById('MAIN_TITLE');
const TIME_TEXT = document.getElementById('TIME');


document.addEventListener('DOMContentLoaded', async () => {
    // Constante para obtener el número de horas.
    const HOUR = new Date().getHours();
    let greeting = '';
    if (HOUR < 12) {
        greeting = 'Buenos días';
    } else if (HOUR < 19) {
        greeting = 'Buenas tardes';
    } else if (HOUR <= 23) {
        greeting = 'Buenas noches';
    }
    FECHA.textContent = `${greeting}`;

    const TIME = new Date().getHours();
    let time = '';
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
    if (DATA.status) {
        CONJUNTOS.innerHTML = '';
        const conjuntosLength = DATA.dataset.conjunto.length;

        // Iterar de dos en dos
        for (let i = 0; i < conjuntosLength; i += 2) {
            const activeClass = i === 0 ? 'active' : '';
            const row1 = DATA.dataset.conjunto[i];
            const row2 = i + 1 < conjuntosLength ? DATA.dataset.conjunto[i + 1] : null; // Verificar si existe el segundo elemento

            CONJUNTOS.innerHTML += `
                <div class="carousel-item ${activeClass}">
                    <div class="menu-item">
                        <img src="${row1.imagen_producto}" alt="${row1.descripcion_producto}" style="width: 200px; height: 200px; border-radius: 20px;">
                        <p>${row1.descripcion_producto}</p>
                        <p class="price">$${row1.precio_producto}</p>
                    </div>
                    ${row2 ? `
                    <div class="menu-item">
                        <img src="${row2.imagen_producto}" alt="${row2.descripcion_producto}" style="width: 200px; height: 200px; border-radius: 20px;">
                        <p>${row2.descripcion_producto}</p>
                        <p class="price">$${row2.precio_producto}</p>
                    </div>
                    ` : ''}
                </div>
            `;
        }


        COMPLEMENTOS.innerHTML = '';
        DATA.dataset.complementario.forEach((row, index) => {
            const activeClass = index === 0 ? 'active' : '';
            COMPLEMENTOS.innerHTML += `
                <div class="carousel-item ${activeClass}">
                    <div class="menu-item">
                    <img src="${row.imagen_producto}" alt"${row.descripcion_producto}" style="width: 200px; height: 200px;     border-radius: 20px;
">
                    <p>${row.descripcion_producto}</p>
                        <p class="price">$${row.precio_producto}</p>
                    </div>
                </div>
            `;
        });
    } else {
        // Manejo de errores si no hay datos
    }
});