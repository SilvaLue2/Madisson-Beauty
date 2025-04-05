let index = 0;
const cards = document.querySelectorAll(".carousel .card");
const visibleCards = 4;
const totalCards = cards.length;
const carousel = document.getElementById("carousel");

function mover(direccion) {
  const maxIndex = totalCards - visibleCards;
  index += direccion;

  if (index < 0) index = maxIndex;
  if (index > maxIndex) index = 0;

  carousel.style.transform = `translateX(${-index * (100 / visibleCards)}%)`;
}

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();

  const botones = document.querySelectorAll(".boton");

  botones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const producto = e.target.closest(".card");
      const nombre = producto.querySelector(".toptitulo").textContent;
      const precio = producto
        .querySelector(".actual")
        .textContent.replace("$", "");
      const imagen = producto.querySelector("img").src;

      const productoObj = {
        nombre,
        precio: parseFloat(precio),
        imagen,
        cantidad: 1,
      };

      agregarAlCarrito(productoObj);
    });
  });

  // Si estamos en carrito.html, cargar productos al iniciar
  if (window.location.pathname.includes("carrito.html")) {
    cargarCarrito();
  }
});

function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  let index = carrito.findIndex((item) => item.nombre === producto.nombre);

  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push(producto);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("carritoActualizado", Date.now()); // clave para evento
  alert("Producto añadido al carrito");

  actualizarContadorCarrito();
}

// Contador
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    contador.textContent = totalCantidad;
  }
}

// Evento de sincronización entre pestañas
window.addEventListener("storage", function (event) {
  if (event.key === "carritoActualizado") {
    actualizarContadorCarrito();
    if (typeof cargarCarrito === "function") {
      cargarCarrito();
    }
  }
});

// Renderizar carrito en carrito.html
function cargarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedor = document.getElementById("contenedor-carrito");
  if (!contenedor) return;

  contenedor.innerHTML = ""; // Limpiar

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío.</p>";
    return;
  }

  carrito.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.innerHTML = `
      <img src="${item.imagen}" width="50" />
      <span>${item.nombre}</span>
      <span>$${item.precio}</span>
      <span>Cantidad: ${item.cantidad}</span>
    `;
    contenedor.appendChild(div);
  });
}
