const zonaPresionar = document.getElementById("zonaPresionar");
const textoPresionar = document.getElementById("textoPresionar");
const zonaInstruccion = document.getElementById("zonaInstruccion");
const contadorTiempo = document.getElementById("contadorTiempo");
const mensajeEstado = document.getElementById("mensajeEstado");
const instruccionTiempo = document.getElementById("instruccionTiempo");
const unidadContador = document.getElementById("unidadContador");


// Generar un tiempo aleatorio entre 3 y 8 segundos
const tiempoObjetivo = Math.floor(Math.random() * 6) + 3;


// Cantidad de pitidos que ha escuchado la persona
let cantidadPitidos = 0;

let intervalo;
let verificando = false;
let completado = false;


// Mostrar la instrucción
contadorTiempo.textContent = tiempoObjetivo;
zonaPresionar.setAttribute(
    "aria-label",
    "Área de verificación. Mantén presionado durante " +
    tiempoObjetivo +
    " segundos. Cuenta los pitidos y suelta al llegar a " +
    tiempoObjetivo +
    " pitidos."
);

instruccionTiempo.textContent =
    "🔊 Mantén presionado el botón durante " +
    tiempoObjetivo +
    " segundos";


// -------------------------
// DECIR INSTRUCCIÓN
// -------------------------

function decirInstruccion() {

    const texto =
        "Mantén presionado el botón durante " +
        tiempoObjetivo +
        " segundos. Escucharás un pitido por cada segundo. " +
        "Suelta el botón cuando hayas contado " +
        tiempoObjetivo +
        " pitidos.";

    const voz = new SpeechSynthesisUtterance(texto);

    voz.lang = "es-ES";

    speechSynthesis.cancel();
    speechSynthesis.speak(voz);
}


// -------------------------
// HACER PITIDO
// -------------------------

function hacerPitido() {

    const contextoAudio = new AudioContext();

    const oscilador = contextoAudio.createOscillator();
    const volumen = contextoAudio.createGain();

    oscilador.connect(volumen);
    volumen.connect(contextoAudio.destination);

    oscilador.frequency.value = 700;
    volumen.gain.value = 0.15;

    oscilador.start();

    setTimeout(function () {

        oscilador.stop();
        contextoAudio.close();

    }, 150);
}

// -------------------------
// SONIDO DE ÉXITO
// -------------------------

function sonidoExito() {

    const contextoAudio = new AudioContext();

    const oscilador1 = contextoAudio.createOscillator();
    const volumen1 = contextoAudio.createGain();

    oscilador1.connect(volumen1);
    volumen1.connect(contextoAudio.destination);

    oscilador1.frequency.value = 600;
    volumen1.gain.value = 0.15;

    oscilador1.start();
    oscilador1.stop(contextoAudio.currentTime + 0.15);


    const oscilador2 = contextoAudio.createOscillator();
    const volumen2 = contextoAudio.createGain();

    oscilador2.connect(volumen2);
    volumen2.connect(contextoAudio.destination);

    oscilador2.frequency.value = 900;
    volumen2.gain.value = 0.15;

    oscilador2.start(contextoAudio.currentTime + 0.2);
    oscilador2.stop(contextoAudio.currentTime + 0.5);


    setTimeout(function () {
        contextoAudio.close();
    }, 600);
}


// -------------------------
// SONIDO DE ERROR
// -------------------------

function sonidoError() {

    const contextoAudio = new AudioContext();

    const oscilador1 = contextoAudio.createOscillator();
    const volumen1 = contextoAudio.createGain();

    oscilador1.connect(volumen1);
    volumen1.connect(contextoAudio.destination);

    oscilador1.frequency.value = 400;
    volumen1.gain.value = 0.15;

    oscilador1.start();
    oscilador1.stop(contextoAudio.currentTime + 0.2);


    const oscilador2 = contextoAudio.createOscillator();
    const volumen2 = contextoAudio.createGain();

    oscilador2.connect(volumen2);
    volumen2.connect(contextoAudio.destination);

    oscilador2.frequency.value = 250;
    volumen2.gain.value = 0.15;

    oscilador2.start(contextoAudio.currentTime + 0.25);
    oscilador2.stop(contextoAudio.currentTime + 0.55);


    setTimeout(function () {
        contextoAudio.close();
    }, 650);
}


// -------------------------
// COMENZAR VERIFICACIÓN
// -------------------------

function comenzarVerificacion() {

    if (verificando || completado) {
        return;
    }

    verificando = true;
    cantidadPitidos = 0;

    contadorTiempo.textContent = "•••";
    unidadContador.textContent = "en curso";

    mensajeEstado.textContent =
        "Verificación iniciada. Cuenta los pitidos.";

    intervalo = setInterval(function () {

        cantidadPitidos++;

        hacerPitido();

        

    }, 1000);
}


// -------------------------
// SOLTAR BOTÓN
// -------------------------

function terminarVerificacion() {

    if (!verificando || completado) {
        return;
    }

    clearInterval(intervalo);

    verificando = false;


    // Soltó antes
    if (cantidadPitidos < tiempoObjetivo) {
        sonidoError();

        mensajeEstado.textContent =
            "Soltaste demasiado pronto. Inténtalo nuevamente.";

        reiniciar();

    }

    // Soltó exactamente después del número correcto de pitidos
    else if (cantidadPitidos === tiempoObjetivo) {

        completarVerificacion();

    }

    // Esperó demasiado
    else {
        sonidoError();

        mensajeEstado.textContent =
            "Tardaste demasiado. Inténtalo nuevamente.";

        reiniciar();

    }
}


// -------------------------
// REINICIAR
// -------------------------

function reiniciar() {

    cantidadPitidos = 0;

    setTimeout(function () {

        contadorTiempo.textContent = tiempoObjetivo;
        unidadContador.textContent = "segundos";

    }, 1000);
}


// -------------------------
// VERIFICACIÓN CORRECTA
// -------------------------

function completarVerificacion() {

    sonidoExito();

    completado = true;

    contadorTiempo.textContent = "✓";
    unidadContador.textContent = "";

    mensajeEstado.textContent =
        "Verificación completada correctamente.";

    textoPresionar.textContent =
        "✓ Verificación completada";

    zonaPresionar.setAttribute(
        "aria-label",
        "Verificación completada correctamente."
    );
}


// -------------------------
// ESCUCHAR INSTRUCCIÓN
// -------------------------


zonaInstruccion.addEventListener("click", function () {

    decirInstruccion();

});
zonaInstruccion.addEventListener("keydown", function (evento) {

    if (evento.code === "Space" || evento.code === "Enter") {

        evento.preventDefault();

        decirInstruccion();
    }
});


// -------------------------
// COMENZAR A PRESIONAR
// -------------------------

zonaPresionar.addEventListener("pointerdown", function (evento) {

    zonaPresionar.setPointerCapture(evento.pointerId);

    comenzarVerificacion();

});


zonaPresionar.addEventListener("pointerup", function () {

    terminarVerificacion();

});


zonaPresionar.addEventListener("pointercancel", function () {

    terminarVerificacion();

});

// -------------------------
// CONTROL CON TECLADO
// -------------------------

zonaPresionar.addEventListener("keydown", function (evento) {

    if (evento.code === "Space" || evento.code === "Enter") {

        evento.preventDefault();

        comenzarVerificacion();
    }
});


zonaPresionar.addEventListener("keyup", function (evento) {

    if (evento.code === "Space" || evento.code === "Enter") {

        evento.preventDefault();

        terminarVerificacion();
    }
});
// -------------------------
// GUÍA POR VOZ
// -------------------------

const botonGuiaVoz = document.getElementById("botonGuiaVoz");

let guiaVozActiva = false;


// Activar o desactivar guía
botonGuiaVoz.addEventListener("click", function () {

    guiaVozActiva = !guiaVozActiva;

    if (guiaVozActiva) {

        botonGuiaVoz.textContent = "🔊 Guía por voz activada";

        hablar(
            "Guía por voz activada. " +
            "Al seleccionar una opción escucharás una explicación."
        );

    } else {

        botonGuiaVoz.textContent = "🔊 Activar guía por voz";

        speechSynthesis.cancel();
    }

});


// Función general para hablar
function hablar(texto) {

    speechSynthesis.cancel();

    const voz = new SpeechSynthesisUtterance(texto);

    voz.lang = "es-CL";

    speechSynthesis.speak(voz);
}


// Buscar todos los elementos que tengan descripción
const elementosConDescripcion =
    document.querySelectorAll("[data-descripcion]");


// Cuando reciben el foco
elementosConDescripcion.forEach(function (elemento) {

    elemento.addEventListener("focus", function () {

        if (guiaVozActiva) {

            hablar(elemento.dataset.descripcion);

        }

    });

});