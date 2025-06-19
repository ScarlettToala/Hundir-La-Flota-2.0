export class Barco {
    constructor(nombreBarco, tamanyo, posiciones, tocadas = []) {
        this.nombreBarco = nombreBarco; 
        this.tamanyo = tamanyo; //del barco
        this.posiciones = posiciones //Donde se encuentra el barco
        this.tocadas = tocadas; //celdas ya tocadas
        this.hundido = false;  // Indica si el barco está hundido
        this.colocado = false; //Sobre el tablero
    }

    marcarImpacto(posicion) {
        const yaTocado = this.tocadas.some(p => p[0] === posicion[0] && p[1] === posicion[1]);
        if (yaTocado) return false;

        for (let i = 0; i < this.posiciones.length; i++) {
            if (this.posiciones[i][0] === posicion[0] && this.posiciones[i][1] === posicion[1]) {
                this.tocadas.push(posicion);
                /*console.log(`Impacto registrado en el barco ${this.nombreBarco}: ${posicion}`);*/
                if (this.estaHundido()) {
                    this.hundido = true;
                    /*console.log(`El barco ${this.nombreBarco} ha sido hundido.`);*/
                }
                return true;
            }
        }
        return false;
    }

    estaHundido() {
        if (this.tocadas.length === this.tamanyo) {
            return true;
        }
        return false;
    }

    ocupaCoordenada(x, y) {
        return this.posiciones.some(pos => pos[0] === x && pos[1] === y);
    }

    cargarDeJson(datos) {
        this.nombreBarco = datos.nombreBarco
        this.tamanyo = datos.tamanyo
        this.posiciones = datos.posiciones
        this.tocadas = datos.tocadas;
        this.hundido = datos.hundido;
        this.colocado = datos.colocado;
    }

}