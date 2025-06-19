export class Celda {
    constructor(aguaBarco, x, y) {
        this.aguaBarco = aguaBarco; // Marca si la celda tiene un barco
        this.posicionX = x;
        this.posicionY = y;
        this.tocada = false //estado de la celda 
    }

    existeBarco(xUsuario, yUsuario) {
        if (this.posicionX === xUsuario && this.posicionY === yUsuario && this.aguaBarco === true) {
            /*console.log('Hay barco');*/
            this.tocada = true;
            return true;
        }
        return false;
    }

    cargarDeJson(datos) {
        this.aguaBarco = datos.aguaBarco
        this.posicionX = datos.posicionX
        this.posicionY = datos.posicionY
        this.tocada = datos.tocada
    }


}