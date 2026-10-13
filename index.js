const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const MAX_NOM = 20;
const MAX_TEXT = 500;

// Express sirve los archivos de la carpeta "public"
app.use(express.static(join(__dirname, 'public')));

// Devuelve el texto sin espacios a los lados, o null si no es válido
function validar(valor, maxim) {
  if (typeof valor !== 'string') {
    return null;
  }
  const net = valor.trim();
  if (net.length === 0 || net.length > maxim) {
    return null;
  }
  return net;
}

io.on('connection', (socket) => {
  socket.on('chat:send', (dades) => {
    if (typeof dades !== 'object' || dades === null) {
      return;
    }

    const nom = validar(dades.nom, MAX_NOM);
    const text = validar(dades.text, MAX_TEXT);

    if (nom === null || text === null) {
      return;
    }

    // La hora la genera el servidor
    io.emit('chat:message', {
      nom: nom,
      text: text,
      hora: new Date().toISOString()
    });
  });
});

server.listen(20001, () => {
  console.log('server running at http://localhost:20001');
});