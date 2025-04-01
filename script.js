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

//1️ Agregar un Evento al Botón

document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll(".boton"); // Seleccionamos todos los botones de añadir al carrito

    botones.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const producto = e.target.closest(".card"); // Obtener el contenedor del producto
            const nombre = producto.querySelector(".toptitulo").textContent;
            const precio = producto.querySelector(".actual").textContent.replace("$", ""); // Quitamos el símbolo $
            const imagen = producto.querySelector("img").src;
            
            const productoObj = {
                nombre,
                precio: parseFloat(precio),
                imagen,
                cantidad: 1
            };

            agregarAlCarrito(productoObj);
        });
    });
});

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || []; // Obtener carrito actual

    // Verificar si el producto ya está en el carrito
    let index = carrito.findIndex(item => item.nombre === producto.nombre);
    
    if (index !== -1) {
        carrito[index].cantidad += 1; // Si existe, aumentamos la cantidad
    } else {
        carrito.push(producto); // Si no, lo agregamos al array
    }

    localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardamos en LocalStorage
    alert("Producto añadido al carrito");
}

