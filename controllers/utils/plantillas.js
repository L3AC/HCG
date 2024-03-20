const HEADER = document.querySelector('header');
const FOOTER = document.querySelector('footer');


HEADER.innerHTML = `
<nav class="navbar">
<div class="container-fluid position-absolute top-0 start-0">
  <a class="navbar-brand" href="#">
    <img class="btn" src="../../resources/img/logo.png" alt="Bootstrap" width="90" height="80" type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
    <a href="../../views/admin/perfil.html"><img src="../../resources/img/Perfilito.png" id="io" class="position-absolute top-0 end-0" width="40" height="40"></a>
    <div class="offcanvas offcanvas-start" style=" background-color: #F1EFEF; border-top-right-radius: 30px; border-bottom-right-radius: 30px;" data-bs-backdrop="static" tabindex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
        <div class="offcanvas-header">
          <h3 class="offcanvas-title" id="staticBackdropLabel">Categorias</h3>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
            <div class="offcanvas-body">
                <ul class="list-group list-group-flush" >
                <li class="list-group-item" id="po"><a href="prueba.html">Inicio</a></li>
                <li class="list-group-item" id="po"><a href="1marcas.html">Marcas</a></li>
                <li class="list-group-item" id="po"><a href="2modelos.html">Modelos</a></li>
                <li class="list-group-item" id="po"><a href="3tallas.html">Tallas</a></li>
                <li class="list-group-item" id="po"><a href="4pedidos.html">Pedidos</a></li>
                <li class="list-group-item" id="po"><a href="5tiponoticia.html">Tipo Noticias</a></li>
                <li class="list-group-item" id="po"><a href="6noticias.html">Noticias</a></li>
                <li class="list-group-item" id="po"><a href="7comentarios.html">Comentarios</a></li>
                <li class="list-group-item" id="po"><a href="8clientes.html">Clientas</a></li>
                <li class="list-group-item" id="po"><a href="9usuarios.html">Usuarios</a></li>
                <li class="list-group-item" id="po"><a href="10roles.html">Roles</a></li>
                  </ul>
            </div>
        </div>
      </div>
  </a>
</div>
</nav>`;

FOOTER.innerHTML = `
<nav class="navbar fixed-bottom" id="foot">
        <div class="container-fluid">
            <div>
                <h6>YNWA</h6>
                <p><i class="bi bi-c-square"></i>2024 Todos los derechos reservados</p>
            </div>
            <div>
                <h6>Contáctanos</h6>
                <p><i class="bi bi-envelope"></i> YNWA@gmail.com</p>
            </div>
        </div>
    </nav>
    `;