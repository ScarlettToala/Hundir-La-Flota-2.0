import { Celda } from './Celda.js';
import { Barco } from './Barco.js';
import { barcosJSON } from '../constantes.js';

export class Tablero {
    constructor(esIA = false, tamanyo = 10) {
        this.tamanyo = tamanyo
        this.celdas = [];
        this.barcos = [];
        this.barcoSeleccionado = null;
        this.direccionHorizontal = true;
        this.esIA = esIA;
    }

    generarTablero(tamanyo) {
        this.tamanyo = tamanyo;
        this.celdas = [];

        for (let x = 0; x < this.tamanyo; x++) {
            for (let y = 0; y < this.tamanyo; y++) {
                this.celdas.push(new Celda(false, x, y));
            }
        }
    }


    getCelda(x, y) {
        return this.celdas[x * this.tamanyo + y];
    }


    generadorNumero(max) {
        return Math.floor(max * Math.random());
    }

    posicionDentroTablero([x, y]) {
        return x >= 0 && x < this.tamanyo && y >= 0 && y < this.tamanyo;
    }


    celdasDefinidas(posiciones) {
        for (let [x, y] of posiciones) {
            let celda = this.getCelda(x, y);
            if (celda) {
                celda.aguaBarco = true;
            }
        }
    }

    // IA: coloca barcos aleatoriamente
    colocarBarcosIA(barcosJSON) {
        const arrayBarcos = JSON.parse(barcosJSON);

        for (let barcoData of arrayBarcos) {
            let posiciones = this.colocarBarcoAleatorio(barcoData.size);
            const barco = new Barco(barcoData.name, barcoData.size, posiciones);
            this.barcos.push(barco);
        }
    }

    colocarBarcoAleatorio(tam) { //tamaño del barco
        let lugarValido = false, posiciones = [];

        while (!lugarValido) {
            let x = this.generadorNumero(this.tamanyo); //tablero para colocarlo
            let y = this.generadorNumero(this.tamanyo);
            let direccion = this.generadorNumero(2); // 0 = H, 1 = V

            let posibles = [], valido = true;

            for (let i = 0; i < tam; i++) {
                let pos = direccion === 0 ? [x, y + i] : [x + i, y];
                if (!this.posicionDentroTablero(pos)) valido = false;

                let ocupada = this.getCelda(pos[0], pos[1])?.aguaBarco;
                if (ocupada) valido = false;

                posibles.push(pos);
            }

            if (valido) {
                this.celdasDefinidas(posibles);
                posiciones = posibles;
                lugarValido = true;
            }
        }

        return posiciones;
    }


    // Usuario: seleccionar y colocar barco manualmente
    seleccionarBarco(nombre) {
        const barcos = JSON.parse(barcosJSON);
        this.barcoSeleccionado = barcos.find(b => b.name.toLowerCase() === nombre.toLowerCase() && !b.colocado) || null;
    }

    cambiarDireccion() {
        this.direccionHorizontal = !this.direccionHorizontal;
    }

    colocarBarcoUsuario(x, y, tam, direccion) {
        let posiciones = [];

        for (let i = 0; i < tam; i++) {
            let nuevaX = direccion === 0 ? x : x + i;
            let nuevaY = direccion === 0 ? y + i : y;

            if (!this.posicionDentroTablero([nuevaX, nuevaY])) return null;

            let ocupada = this.getCelda(nuevaX, nuevaY)?.aguaBarco;
            if (ocupada) return null;

            posiciones.push([nuevaX, nuevaY]);
        }

        this.celdasDefinidas(posiciones);

        this.barcos.push({
            nombreBarco: this.barcoSeleccionado.name,
            posiciones: posiciones,
            tocadas: [],
            hundido: false,
            estaHundido: function () {
                return this.posiciones.length === this.tocadas.length;
            }
        });

        return posiciones;
    }

    hayBarcoEnCelda(x, y) {
        for (let barco of this.barcos) {
            for (let pos of barco.posiciones) {
                if (pos[0] === x && pos[1] === y) {
                    if (!barco.tocadas.some(p => p[0] === x && p[1] === y)) {
                        barco.tocadas.push([x, y]);
                        /*console.log(`Impacto en ${barco.nombreBarco}`);*/
                    }
                    if (barco.estaHundido()) {
                        barco.hundido = true;
                        /*console.log(`¡El barco ${barco.nombreBarco} ha sido hundido!`);*/
                    }
                    return true;
                }
            }
        }
        return false;
    }

    todosHundidos() {
        return this.barcos.every(barco => barco.estaHundido());
    }

    reiniciar(tamanyo = 10) {
        this.tamanyo = tamanyo
        this.barcos = [];
        this.barcoSeleccionado = null;
        this.direccionHorizontal = true;

        this.celdas = [];

        for (let x = 0; x < this.tamanyo; x++) {
            for (let y = 0; y < this.tamanyo; y++) {
                this.celdas.push(new Celda(false, x, y));
            }
        }
    }

    cargarDatos(datos) {
        // Asignar propiedades simples directamente
        this.tamanyo = datos.tamanyo ?? 10;
        this.barcoSeleccionado = datos.barcoSeleccionado ?? null;
        this.direccionHorizontal = datos.direccionHorizontal ?? true;
        this.esIA = datos.esIA ?? false;

        // Reconstruir las celdas COMO ARRAY PLANO (no array de arrays)
        this.celdas = (datos.celdas ?? []).map(dataCelda => {
            const celda = new Celda();
            celda.cargarDeJson(dataCelda ?? {});
            return celda;
        });

        // Reconstruir los barcos
        this.barcos = (datos.barcos ?? []).map(dataBarco => {
            const barco = new Barco();
            barco.cargarDeJson(dataBarco);
            return barco;
        });
        /*console.log("Datos cargados en tablero:", this);*/
    }






}

