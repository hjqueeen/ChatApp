const colors = require('colors/safe');

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const socketIo = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

socketIo.on('connection', function (socket) {
  console.log(`${colors.brightGreen('연결됨socket connection succeeded.')}`);

  socket.on('message', ({ name, message }) => {
    console.log('메세지를 받았습니다');
    socket.emit('message', { name, message });
  });

  socket.on('disconnect', (reason) => {
    console.log(`연결해제disconnect: ${reason}`);
  });
});

http.listen(4000, function () {
  console.log(
    `##### server is running on ${colors.brightGreen(
      'http://localhost:4000'
    )}. ${colors.yellow(new Date().toLocaleString())} #####`
  );
});
