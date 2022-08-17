const colors = require('colors/safe');

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const socketIo = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3001',
    credentials: true,
  },
});

socketIo.on('connection', function (socket) {
  console.log(`${colors.brightGreen('socket connection succeeded.')}`);

  socket.on('sendMessage', (messagePackage) => {
    console.log('got a message');
    socket.emit('receivedMessage', messagePackage);
  });

  socket.on('joinRoom', () => {
    console.log('Enter chat room 1');
    socket.join('room 1');
  });

  socket.on('disconnect', (reason) => {
    console.log(`socket disconnect: ${reason}`);
  });
});

http.listen(4000, function () {
  console.log(
    `##### server is running on ${colors.brightGreen(
      'http://localhost:4000'
    )}. ${colors.yellow(new Date().toLocaleString())} #####`
  );
});
