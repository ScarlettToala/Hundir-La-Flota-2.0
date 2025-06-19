export class IA { 
  constructor(tablero) {
    this.tablero = tablero;
    this.disparosHechos = []; //guardarlos para no repetirlos
    this.objetivosPendientes = []; //posible otra combinación
  }

  siguienteDisparo() {
    // Modo caza
    if (this.objetivosPendientes.length > 0) {
      return this.objetivosPendientes.shift();
    }

    // Modo búsqueda
    let x, y;
    do {
      x = this.random(this.tablero.tamanyo);
      y = this.random(this.tablero.tamanyo);
    } while (this.disparosHechos.some(pos => pos[0] === x && pos[1] === y));

    return [x, y];
  }

  procesarResultado(x, y, impacto) {
    this.disparosHechos.push([x, y]);
    if (impacto) {
      this.objetivosPendientes.push(...this.vecinos(x, y).filter(p =>
        this.tablero.posicionDentroTablero(p) &&
        !this.disparosHechos.some(pos => pos[0] === p[0] && pos[1] === p[1])
      ));
    }
  }

  vecinos(x, y) {
    return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
  }

  random(max) {
    return Math.floor(Math.random() * max);
  }


  // Restaurar estado
  cargarDatos(datos) {
    this.disparosHechos = datos.disparosHechos || [];
    this.objetivosPendientes = datos.objetivosPendientes || [];
  }
}
