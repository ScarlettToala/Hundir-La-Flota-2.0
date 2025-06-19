// clases/Juego.js
import { IA } from './IA.js';

export class Juego {
  constructor(tableroUsuario, tableroIA, uiTableroUsuario, uiTableroIA, mostrarMensaje) {
    this.tableroUsuario = tableroUsuario; 
    this.tableroIA = tableroIA;
    this.uiTableroUsuario = uiTableroUsuario;
    this.uiTableroIA = uiTableroIA;
    this.ia = new IA(tableroUsuario);
    this.turno = 'usuario';

    // Esta función se usará para mostrar mensajes.
    this.mostrarMensaje = mostrarMensaje || function (msg) { Swal.fire(msg); };
  }

  iniciarJuego() {
    this.uiTableroIA.setOnClick((x, y) => this.jugarTurnoUsuario(x, y));
  }

  jugarTurnoUsuario(x, y) {
    if (this.turno !== 'usuario') return;

    const celda = this.tableroIA.getCelda(x, y);
    if (celda.tocada) return;

    const impacto = this.tableroIA.hayBarcoEnCelda(x, y);
    celda.tocada = true;

    this.uiTableroIA.actualizarCelda(x, y);
    this.uiTableroIA.marcarDisparo(x, y, impacto);  // aquí mejor x, y

    if (this.tableroIA.todosHundidos(this.tableroIA.barcos)) {
      this.mostrarMensaje("¡Ganaste!");
      document.getElementById('reiniciarJuego').classList.remove('oculto');
      this.uiTableroUsuario.eliminarClick();
      this.uiTableroIA.eliminarClick();
      return;
    }

    if (!impacto) {
      this.turno = 'ia';
      setTimeout(() => this.jugarTurnoIA(), 1000);
    } else {
      this.mostrarMensaje("💥 ¡Impacto! Sigue tu turno.");
    }
  }


  jugarTurnoIA() {
    const [x, y] = this.ia.siguienteDisparo();
    /*console.log([x, y])*/
    const celda = this.tableroUsuario.getCelda(x, y); // corregido

    if (!celda) {
      console.error("No existe la celda:( IA", celda)
      return;
    }

    const impacto = this.tableroUsuario.hayBarcoEnCelda(x, y);
    celda.tocada = true;

    this.uiTableroUsuario.actualizarCelda(x, y);
    this.uiTableroUsuario.marcarDisparo(x, y, impacto);

    this.ia.procesarResultado(x, y, impacto);

    if (this.tableroUsuario.todosHundidos(this.tableroUsuario.barcos)) {
      this.mostrarMensaje("¡La IA ha ganado!");
      this.uiTableroUsuario.eliminarClick();
      this.uiTableroIA.eliminarClick();
      document.getElementById('reiniciarJuego').classList.remove('oculto');
      return;
    }

    if (impacto) {
      this.mostrarMensaje("Es turno de la IA. ¡Ha Impacto!💥");
      setTimeout(() => this.jugarTurnoIA(), 1000);
    } else {
      this.mostrarMensaje("Es turno de la IA. Ha fallado...🌊");
      this.turno = 'usuario';
    }
  }

}
