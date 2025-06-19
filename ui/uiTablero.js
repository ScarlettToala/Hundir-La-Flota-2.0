export class UITablero {
  constructor(tablero, contenedorId, esInteractivo = false) {
    this.tablero = tablero;
    this.idContenedor = contenedorId;
    this.contenedor = document.getElementById(contenedorId);
    this.esInteractivo = esInteractivo;
    this.mostrarBarcos = false; //No mostrar el barco
  }

  render() {
    this.contenedor.innerHTML = '';
    const size = Math.sqrt(this.tablero.celdas.length);

    for (let i = 0; i < size; i++) {
      const fila = document.createElement('div');
      fila.classList.add('fila');

      for (let j = 0; j < size; j++) {
        const celda = this.tablero.getCelda(i, j);
        const div = document.createElement('div');
        div.classList.add('celda');
        div.dataset.x = i;
        div.dataset.y = j;

        if (this.mostrarBarcos && celda.aguaBarco) {
          // Mostrar barcos (intactos o tocados)
          if (celda.tocada) {
            div.innerText = '💥';  // Barco tocado
          } else {
            div.innerText = '🚢';  // Barco intacto
          }
        } else if (celda.tocada) {
          // Mostrar disparos en agua o impacto (cuando no mostramos barcos intactos)
          if (celda.aguaBarco) {
            div.innerText = '💥';  // Impacto en barco
          } else {
            div.innerText = '❌';  // Disparo al agua
          }
        } else {
          div.innerText = ''; // Agua no disparada
        }

        fila.appendChild(div);
      }

      this.contenedor.appendChild(fila);
    }
  }


  mostrarBarcosTablero() {
    this.mostrarBarcos = true;
    this.render();
  }


  setOnClick(callback) {
    this.contenedor.addEventListener("click", (e) => {
      const celda = e.target.closest('.celda');
      if (!celda) return;
      const x = celda.dataset.x;
      const y = celda.dataset.y;
      callback(parseInt(x), parseInt(y));
    });
  }


  actualizarCelda(x, y) {
    const selector = `.celda[data-x="${x}"][data-y="${y}"]`;
    const div = this.contenedor.querySelector(selector);
    if (!div) return;

    const celda = this.tablero.getCelda(x, y);

    div.classList.remove('impacto', 'agua-disparo'); // Limpiar clases anteriores

    if (celda.aguaBarco && this.mostrarBarcosTablero) {
      div.innerText = '💥'; // Impacto en barco
      div.classList.add('impacto');
    } else {
      div.innerText = '❌'; // Disparo al agua
      div.classList.add('agua-disparo');
    }
  }

  marcarDisparo(x, y, impacto) {
    const selector = `.celda[data-x="${x}"][data-y="${y}"]`;
    const div = this.contenedor.querySelector(selector);
    if (!div) return;

    div.classList.remove('impacto', 'agua-disparo');

    if (impacto) {
      div.innerText = '💥';
      div.classList.add('impacto');
    } else {
      div.innerText = '❌';
      div.classList.add('agua-disparo');
    }
  }

  ocultarBarcos() {
    const celdas = this.contenedor.querySelectorAll('.celda.barco');
    celdas.forEach(celda => {
      celda.classList.remove('barco');
      celda.classList.add('agua'); // Opcional, por si quieres mantener color de agua
    });
  }

  eliminarClick() {
    const newContenedor = this.contenedor.cloneNode(true); // Clona sin eventos
    this.contenedor.parentNode.replaceChild(newContenedor, this.contenedor);
    this.contenedor = newContenedor;
  }

}
