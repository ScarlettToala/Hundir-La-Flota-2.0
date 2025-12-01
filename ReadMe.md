## Hundir la flota
Hundir la Flota es una aplicación web interactiva desarrollada con HTML, CSS y JavaScript, que permite al usuario jugar al clásico juego de estrategia naval.
El proyecto sigue una arquitectura MVC (Modelo-Vista-Controlador) y utiliza un servidor Node.js con Express para gestionar la persistencia de datos (guardado y recuperación de partidas).

El objetivo principal es ofrecer una experiencia de juego fluida en el navegador, complementada por un backend que almacena las partidas jugadas y permite cargarlas posteriormente.

### Arquitectura del proyecto

El proyecto está estructurado siguiendo el patrón MVC, lo que facilita la organización, escalabilidad y mantenimiento del código.

📁 Modelo (Clases)

Contiene la lógica relacionada con los datos(tablero, barco, celda, ia y jugabilidadDOM) , incluyendo:

Estructura de una partida.

Estado del tablero.

Guardado y carga de partidas a través de la API (comunicación con el servidor).

📁 Vista (Ui)

Encargada de la parte visual del juego:

hundirLaFlota.html – página principal del juego.

CSS – diseño de los tableros, botones e interfaz.

Renderizado dinámico mediante DOM.

📁 Controlador (Controllers)

Gestiona toda la lógica del juego:

Colocación de barcos.

Turnos del jugador y la IA.

Control del flujo de partida.

Comunicación con el servidor mediante fetch().

La carpeta logica/ contiene principalmente esta parte.

🌐 Servidor y API

El proyecto incluye un servidor Node.js con Express que corre en:

http://localhost:3000

✔ Funciones del servidor

El servidor tiene dos responsabilidades principales:

1️⃣ Servir los archivos estáticos del proyecto

HTML

CSS

JavaScript

Esto elimina errores de CORS y permite cargar el juego en navegador de forma segura.

2️⃣ Gestionar las partidas mediante una API REST

Rutas disponibles:

POST /partidas

Guarda una partida enviando el estado del tablero y la información del jugador.

Ejemplo

```bash
    "id": "2vweda0l7"
```
---
### Ejecución del proyecto
1. Instalar dependencias
npm install

2. Iniciar el servidor
node server.js

3. Abrir el juego en el navegador
http://localhost:3000
o con la pluggin de _live server_

---

La API permite:

Guardar partidas: se almacenan en un archivo o base de datos.

Cargar partidas: el usuario puede recuperar el estado de una partida anterior.

Reanudar el juego desde el punto guardado.

Esto permite mantener progreso entre sesiones y mejora la experiencia del usuario.

> Tecnologías utilizadas 
> **Frontend**
> * HTML5
> * CSS3
> * JavaScript ES Modules
> * SweetAlert2 (para notificaciones)
> **Backend**
> * Node.js
> * Express.js
> * CORS
> * Almacenamiento en JSON en un archivo 