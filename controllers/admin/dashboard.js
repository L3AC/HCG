// Constante para completar la ruta de la API.
const MODELO_API = 'services/admin/productos.php',
    DETALLE_API= 'services/admin/detallepedidos.php',
    CLIENTE_API = 'services/admin/clientes.php',
    TIPO_ITEM_API = 'services/admin/tipoitems.php',
    PEDIDO_API = 'services/admin/pedidos.php';

//Constantes de variables
const LIST_1 = document.getElementById('list1'),
    LIST_2 = document.getElementById('list2'),
    LIST_3 = document.getElementById('list3'),
    LIST_4 = document.getElementById('list4'),
    LIST_5 = document.getElementById('list5'),
    LIST_6 = document.getElementById('list6');

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
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
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = `${greeting}, bienvenido`;
    // Llamada a la funciones que generan los gráficos en la página web.
    graficaTopConjuntos();
    graficaTopComplementos();
    graficaTopClientes();
    graficaTopCategorias();
    graficaGanancias();
    graficaHorarios();
    // Añadir eventos de cambio a los selectores para actualizar los gráficos.
    LIST_1.addEventListener('change', graficaTopConjuntos);
    LIST_2.addEventListener('change', graficaTopComplementos);
    LIST_3.addEventListener('change', graficaTopClientes);
    LIST_4.addEventListener('change', graficaTopCategorias);
    LIST_5.addEventListener('change', graficaGanancias);
    LIST_6.addEventListener('change', graficaHorarios);
});

/*
*   Función asíncrona para mostrar un gráfico de barras con la cantidad de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const graficaTopConjuntos = async () => {
    const FORM = new FormData();
    FORM.append('limit', LIST_1.value);
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(DETALLE_API, 'topConjuntos',FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a gráficar.
        let labels = [];
        let values = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            labels.push(row.descripcion_producto);
            values.push(row.cantidad_pedidos);
        });
        // Llamada a la función para generar y mostrar un gráfico de pastel. Se encuentra en el archivo components.js
        barBordGraph('chart1', labels, values);
    } else {
        document.getElementById('chart1').remove();
        console.log(DATA.error);
    }
}
const graficaTopComplementos = async () => {
    const FORM = new FormData();
    FORM.append('limit', LIST_2.value);
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(DETALLE_API, 'topPuntuacion',FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        let labels = [];
        let values = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            labels.push(row.descripcion_modelo);
            values.push(row.promedio_puntuacion);
        });
        // Llamada a la función para generar y mostrar un gráfico de barras. Se encuentra en el archivo components.js
        horBarGraph('chart2', labels, values, 'Modelos', 'Modelo');
    } else {
        document.getElementById('chart2').remove();
        console.log(DATA.error);
    }
}

const graficaTopClientes = async () => {
    //let num = LIST_1.value;
    const FORM = new FormData();
    FORM.append('limit', LIST_3.value);
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(DETALLE_API, 'topClientesR', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        let labels = [];
        let values = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            labels.push(row.cliente);
            values.push(row.total_productos_comprados);
        });
        // Llamada a la función para generar y mostrar un gráfico de barras. Se encuentra en el archivo components.js
        barGraph('chart3', labels, values, 'Productos', 'Clientes');
    } else {
        document.getElementById('chart3').remove();
        console.log(DATA.error);
    }
}
const graficaTopCategorias = async () => {
    const FORM = new FormData();
    FORM.append('limit', LIST_4.value);
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(DETALLE_API, 'topTallas',FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        let labels = [];
        let values = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            labels.push('Talla ' + row.descripcion_talla);
            values.push(row.total_cantidad_pedida);
        });
        // Llamada a la función para generar y mostrar un gráfico de barras. Se encuentra en el archivo components.js
        polarGraph('chart4', labels, values, 'Tallas', 'Talla');
    } else {
        document.getElementById('chart4').remove();
        console.log(DATA.error);
    }
}
const graficaGanancias = async () => {
    const FORM = new FormData();
    FORM.append('limit', LIST_5.value);
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(DETALLE_API, 'prediccionGanancia',FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        let labels = [];
        let values = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            labels.push(row.nombre_mes);
            values.push(row.ventas_mensuales);
        });
        labels.push(DATA.dataset[0].nombre_siguiente_mes);
        values.push(DATA.dataset[0].prediccion_siguiente_mes);
        // Llamada a la función para generar y mostrar un gráfico de barras. Se encuentra en el archivo components.js
        areaGraph('chart5', labels, values, 'Ganancias $', 'Mes');
    } else {
        document.getElementById('chart5').remove();
        console.log(DATA.error);
    }
}
const graficaHorarios = async () => {
    const FORM = new FormData();
    FORM.append('limit', LIST_4.value);
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(DETALLE_API, 'topTallas',FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        let labels = [];
        let values = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            labels.push('Talla ' + row.descripcion_talla);
            values.push(row.total_cantidad_pedida);
        });
        // Llamada a la función para generar y mostrar un gráfico de barras. Se encuentra en el archivo components.js
        polarGraph('chart5', labels, values, 'Tallas', 'Talla');
    } else {
        document.getElementById('chart6').remove();
        console.log(DATA.error);
    }
}
/*
*   Función asíncrona para mostrar un gráfico de pastel con el porcentaje de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/

