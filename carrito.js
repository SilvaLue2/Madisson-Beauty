document.addEventListener("DOMContentLoaded", function () {
    const carritoContainer = document.getElementById("carrito-container");
  
    cargarCarrito();
    actualizarContadorCarrito();
  
    function cargarCarrito() {
      carritoContainer.innerHTML = "";
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
      carrito.forEach((producto, index) => {
        const productoHTML = document.createElement("div");
        productoHTML.classList.add("producto-carrito");
        productoHTML.dataset.id = producto.id;
        productoHTML.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <div class="detalle-producto">
              <h3>${producto.nombre}</h3>
              <p class="precio">$${producto.precio}</p>
              <div class="cantidad-control">
                  <button class="disminuir" data-index="${index}">-</button>
                  <span class="cantidad">${producto.cantidad}</span>
                  <button class="aumentar" data-index="${index}">+</button>
              </div>
          </div>
          <button class="eliminar" data-index="${index}">Eliminar</button>
        `;
        carritoContainer.appendChild(productoHTML);
      });
  
      actualizarTotales();
    }
  
    function actualizarCantidad(index, accion) {
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      if (!carrito[index]) return;
  
      if (accion === "aumentar") {
        carrito[index].cantidad++;
      } else if (accion === "disminuir") {
        carrito[index].cantidad--;
        if (carrito[index].cantidad < 1) {
          if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            carrito.splice(index, 1);
          } else {
            carrito[index].cantidad = 1;
          }
        }
      }
  
      localStorage.setItem("carrito", JSON.stringify(carrito));
      localStorage.setItem("carritoActualizado", Date.now());
      actualizarContadorCarrito();
      cargarCarrito();
    }
  
    function eliminarProducto(index) {
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      localStorage.setItem("carritoActualizado", Date.now());
      actualizarContadorCarrito();
      cargarCarrito();
    }
  
    function actualizarTotales() {
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      let subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
      let descuento = subtotal * 0.1;
      let delivery = carrito.length > 0 ? 10 : 0;
      let total = subtotal - descuento + delivery;
  
      document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
      document.getElementById("descuento").textContent = `-$${descuento.toFixed(2)}`;
      document.getElementById("delivery").textContent = `$${delivery.toFixed(2)}`;
      document.getElementById("total").textContent = `$${total.toFixed(2)}`;
    }
  
    carritoContainer.addEventListener("click", function (event) {
      if (event.target.classList.contains("aumentar")) {
        actualizarCantidad(event.target.dataset.index, "aumentar");
      } else if (event.target.classList.contains("disminuir")) {
        actualizarCantidad(event.target.dataset.index, "disminuir");
      } else if (event.target.classList.contains("eliminar")) {
        eliminarProducto(event.target.dataset.index);
      }
    });
  });
  
  // 🟡 Evento que solo escuchará cambios de otras pestañas (ej: index.html)
  window.addEventListener("storage", function (event) {
    if (event.key === "carritoActualizado") {
      actualizarContadorCarrito();
      cargarCarrito(); // se actualizará si estás en carrito.html
    }
  });
  
  function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) {
      contador.textContent = totalCantidad;
    }
  }
  

  window.addEventListener('storage', function (event) {
    if (event.key === 'carrito') {
      // Vuelve a cargar el carrito desde localStorage
      cargarCarrito(); // Asegúrate de que esta función renderiza el contenido del carrito en pantalla
    }
  });