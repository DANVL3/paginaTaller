
// Cargar los textos del protocolo desde JSON
async function cargarContenido() {
    try {
        const respuesta = await fetch("contenido/textos.json");

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const contenido = await respuesta.json();

        // Insertar los párrafos
        document.querySelectorAll("[data-contenido]").forEach((elemento) => {
            const clave = elemento.dataset.contenido;
            elemento.textContent = contenido[clave] ?? "";
        });

        // Generar la lista de temas principales
        const listaTemas = document.querySelector("[data-lista='temas']");

        if (listaTemas && Array.isArray(contenido.temas)) {
            contenido.temas.forEach((tema) => {
                const elemento = document.createElement("li");
                elemento.textContent = tema;
                listaTemas.appendChild(elemento);
            });
        }

    } catch (error) {
        console.error("No se pudo cargar el contenido:", error);

        document.querySelectorAll("[data-contenido]").forEach((elemento) => {
            elemento.textContent = "Contenido no disponible.";
        });
    }
}

// Animar las secciones al entrar en pantalla
function activarAnimaciones() {
    const secciones = document.querySelectorAll(".seccion");

    // Respetar la preferencia de movimiento reducido
    const movimientoReducido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (movimientoReducido || !("IntersectionObserver" in window)) {
        return;
    }

    document.body.classList.add("animaciones-activas");

    const observador = new IntersectionObserver((entradas, observer) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
                observer.unobserve(entrada.target);
            }
        });
    }, {
        threshold: window.matchMedia("(max-width: 768px)").matches ? 0.08 : 0.25,
    rootMargin: window.matchMedia("(max-width: 768px)").matches
        ? "0px 0px -10% 0px"
        : "0px 0px -40% 0px"
    });

    secciones.forEach((seccion) => {
        observador.observe(seccion);
    });
}

// Inicialización
cargarContenido();
activarAnimaciones();



//Funcion contador de visitas

async function cargarContadorVisitas() {
    const contador = document.getElementById("total-visitas");

    if (!contador) return;

    const api = "https://countapi.mileshilliard.com/api/v1";
    const clave = "danvl3-pagina-taller-visitas-2026";

    const publicado = window.location.hostname === "danvl3.github.io";
    const operacion = publicado ? "hit" : "get";

    try {
        const respuesta = await fetch(`${api}/${operacion}/${clave}`, {
            cache: "no-store"
        });

        // El contador todavía no existe.
        if (respuesta.status === 404 && !publicado) {
            contador.textContent = "0";
            return;
        }

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        const visitas = Number(datos.value);

        if (!Number.isFinite(visitas)) {
            throw new Error("Valor de visitas inválido");
        }

        contador.textContent = visitas.toLocaleString("es-MX");

    } catch (error) {
        console.error("Error al cargar las visitas:", error);
        contador.textContent = "—";
    }
}

cargarContadorVisitas();
