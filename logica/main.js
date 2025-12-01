import { Tablero } from '../clases/Tablero.js';
import { Juego } from '../clases/juegoDOM.js';
import { arrayBarcos, barcosJSON } from '../logica/constantes.js';
import { UITablero } from '../ui/uiTablero.js';

//Globales
let tableroUsuario;
let tableroIA;
let uiTableroUsuario;
let uiTableroIA;

/**
 * Función que genera lainterfaz inicial para que el usario pueda empezar a colocar los barcos y de forma aleatoria se coloque otras.
 */
function inicializarJuego() {
    //Generamos el objeto de tablero IA
    tableroIA = new Tablero();
    tableroIA.generarTablero(10);
    tableroIA.colocarBarcosIA(barcosJSON);
    //Generamos la interfaz
    uiTableroIA = new UITablero(tableroIA, 'tableroIA', false);
    uiTableroIA.render();
    uiTableroIA.ocultarBarcos();
    // document.getElementById('tableroIA').style.display = 'none';

    tableroUsuario = new Tablero();
    tableroUsuario.generarTablero(10);
    //Generamos la interfaz
    uiTableroUsuario = new UITablero(tableroUsuario, 'tableroUsuario', true);
    uiTableroUsuario.render();
    uiTableroUsuario.mostrarBarcosTablero();
    /*El usuario puede ver los botones de los barcos*/
    activarContenedorBotones();

    configurarEventos(tableroUsuario, tableroIA, uiTableroUsuario, uiTableroIA);

    //document.getElementById('tableroIA').style.display = 'none';
}

/**
 * Función que desactiva el contenedor de los botones barcos.
 */
function desactivarContenedorBotones() {
    const contenedor = document.getElementById("contenedorBotones");
    contenedor.style.pointerEvents = "none";
    contenedor.style.opacity = "0.5"; // visualmente más claro
}

/**
 * Función que activa el contenedor de los botones barcos.
 */
function activarContenedorBotones() {
    const contenedor = document.getElementById("contenedorBotones");
    contenedor.style.pointerEvents = "auto";
    contenedor.style.opacity = "1";
}

/**
 * Función que muestra los mensaje al usuario de forma más estética.
 */
function mostrarMensaje(msg) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: msg,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        showClass: {
            popup: 'swal2-noanimation',
            backdrop: 'swal2-noanimation'
        },
        hideClass: {
            popup: '',
            backdrop: ''
        }
    });
}

/**
 * Función que ayuda a seleccionar el barco que se queire colocar sobre el tablero 
 * (mejorar para tener solo 1 global)
 */
function configurarEventos(tableroUsuario, tableroIA, uiTableroUsuario, uiTableroIA) {
    const barcos = ['portaaviones', 'acorazado', 'crucero', 'submarino', 'destructor'];
    barcos.forEach(nombre => {
        document.getElementById(nombre).addEventListener("click", () => tableroUsuario.seleccionarBarco(nombre));
    });

    document.getElementById("botonDireccion").addEventListener("click", () => tableroUsuario.cambiarDireccion());

    uiTableroUsuario.setOnClick((x, y) =>
        manejarClickEnCelda(x, y, tableroUsuario, tableroIA, uiTableroUsuario, uiTableroIA)
    );
}

/**
 * Función que controla la colocación de los barcos del usuario dentro del tablero 
 */
function manejarClickEnCelda(x, y, tableroUsuario, tableroIA, uiTableroUsuario, uiTableroI) {
    if (!tableroUsuario.barcoSeleccionado) {
        mostrarMensaje('Selecciona un barco primero');
        return;
    }

    if (!tableroUsuario.barcoSeleccionado.colocado) {
        const tam = obtenerTamanoBarco(tableroUsuario.barcoSeleccionado);
        const direccion = tableroUsuario.direccionHorizontal ? 0 : 1;

        const posiciones = tableroUsuario.colocarBarcoUsuario(x, y, tam, direccion);

        if (posiciones) {
            uiTableroUsuario.render();

            let boton = document.getElementById(tableroUsuario.barcoSeleccionado.name.toLowerCase());
            if (boton) {
                boton.disabled = true;
                boton.classList.add("boton-desactivado");
            }

            tableroUsuario.barcoSeleccionado.colocado = true;

            tableroUsuario.barcoSeleccionado = null;

            //console.log(tableroUsuario.barcos.length , "=",arrayBarcos.length )
            if (tableroUsuario.barcos.length === arrayBarcos.length) {
                comenzarJuego(tableroUsuario, tableroIA, uiTableroUsuario, uiTableroI);
            }

        } else {
            Swal.fire('No se pudo colocar el barco en esa posición');
        }
    }
}

function obtenerTamanoBarco(barco) {
    return barco.size;
}

/**
 * Función que mejora la interfaz gráfica para que solo se pueda jugar sin botones de colocar los barcos
 */
function comenzarJuego(tableroUsuario, tableroIA, uiTableroUsuario, uiTableroIA) {

    /*Elegimos las constantes*/
    const tableroUsuarioDiv = document.getElementById('tableroUsuario');
    const tableroIAdiv = document.getElementById('tableroIA');
    const botonInicio = document.getElementById('iniciarJuego');

    //const tituloTablero = document.getElementById('titulo');

    /*Botón de iniciar Juego aparece y guardar*/
    botonInicio.classList.remove('oculto');

    /*Eliminar el botón de cambiar sentido*/
    document.getElementById('botonDireccion').style.display = 'none';

    // Iniciar el juego con lógica
    botonInicio.addEventListener('click', () => {
        /*Ocultamos botones*/
        //tableroUsuarioDiv.style.display = 'none';
        desactivarContenedorBotones();

        /*Eliminamso el titulo tablero del usuario*/
        //tituloTablero.remove();

        botonInicio.style.display = 'none';

        /*Getionador del juego*/
        controller(tableroUsuario, tableroIA, uiTableroUsuario, uiTableroIA);


    })

}

/**
 * Función que permite la jugabilidad una vez colocados lo barcos
 */
function controller(tableroUsuario, tableroIA, uiTableroUsuario, uiTableroIA) {
    const juego = new Juego(tableroUsuario, tableroIA, uiTableroUsuario, uiTableroIA, mostrarMensaje);
    /*Mostramos el boton de guardar*/
    mostrarElemento('btnGuardar');

    juego.iniciarJuego();
    uiTableroIA.setOnClick((x, y) => juego.jugarTurnoUsuario(x, y));
}

document.getElementById('reiniciarJuego').addEventListener('click', () => {
    window.location.reload();
});


/**
 * CONEXIÓN A API
 */
async function guardarPartida(nombreJugador, tableroJugador, tableroIA, idPartida) {

    const partida = {
        id: idPartida,
        jugador: nombreJugador,
        tableroJugador: JSON.stringify(tableroJugador),
        tableroIA: JSON.stringify(tableroIA)
    };

    try {
        const response = await fetch("http://localhost:3000/partidas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(partida)
        });

        if (!response.ok) throw new Error("Error al guardar la partida");

        const data = await response.json();
        console.log("Partida guardada con éxito:", data);
        return data.id; // Puedes usar ID si luego lo manejas en el backend
    } catch (err) {
        console.error("Error:", err);
    }
}

async function cargarPartida(idPartida) {
    try {
        const response = await fetch(`http://localhost:3000/partidas/${idPartida}`);
        if (!response.ok) throw new Error("No se encontró la partida");

        const data = await response.json();
        console.log("Partida cargada:", data);
        return data;
    } catch (err) {
        console.error("Error:", err);
    }

}

document.getElementById("btnGuardar").addEventListener("click", () => {
    const nombreJugador = prompt("Introduce tu nombre:");
    if (nombreJugador != null) {
        guardarPartida(nombreJugador, tableroUsuario, tableroIA);
    }
});

document.getElementById("btnCargar").addEventListener("click", async () => {
    const id = prompt("Introduce el ID de la partida:");

    if (id != null) {
        const partida = await cargarPartida(id);
        recuperaTablerosApi(partida);
    }

});


/**
 * FUNCIÓN para reconstruir los tableros a partir de datos cargados
 */
function recuperaTablerosApi(partida) {
    // Instanciar tableros
    tableroUsuario = new Tablero();
    tableroIA = new Tablero();

    // Cargar datos desde la partida
    tableroUsuario.cargarDatos(JSON.parse(partida.tableroJugador));
    tableroIA.cargarDatos(JSON.parse(partida.tableroIA));

    // Crear interfaces
    uiTableroIA = new UITablero(tableroIA, 'tableroIA', false);
    const uiTableroUsuario = new UITablero(tableroUsuario, 'tableroUsuario', true);

    // Renderizar tableros
    uiTableroIA.render();
    uiTableroIA.ocultarBarcos();
    uiTableroUsuario.render();
    uiTableroUsuario.mostrarBarcosTablero(); //mostramos los barcos del usuario

    // Ocultar botones de colocación y dirección
    desactivarContenedorBotones();
    document.getElementById('botonDireccion').style.display = 'none';

    // Ocultar el tablero del usuario
    //document.getElementById('tableroUsuario').style.display = 'none';

    // Mostrar botón guardar
    ocultarElemento('btnGuardar');


    // Iniciar el controlador del juego 
    controller(tableroUsuario, tableroIA, uiTableroUsuario, uiTableroIA);

    // Mensaje con SweetAlert
    Swal.fire({
        icon: 'success',
        title: `¡Partida cargada!`,
        text: `Bienvenido de nuevo, ${partida.jugador}`,
        toast: true,
        position: 'top-end',
        timer: 2000,
        showConfirmButton: false
    });
}

function mostrarElemento(id) {
    document.getElementById(id).classList.remove('oculto');
}

function ocultarElemento(id) {
    document.getElementById(id).classList.add('oculto');
}


// Inicializar todo
inicializarJuego();
