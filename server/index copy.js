const app = require('express')();
const http = require('http').createServer(app);
// const cors = require('cors');
const socketIo = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

const colors = require('colors/safe');

const SOCKET_EVENT = {
  // JOIN_ROOM: 'JOIN_ROOM',
  // UPDATE_NICKNAME: 'UPDATE_NICKNAME',
  SEND_MESSAGE: 'SEND_MESSAGE',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
};

socketIo.on('connection', function (socket) {
  console.log(`${colors.brightGreen('연결됨socket connection succeeded.')}`);

  // const roomName = 'room 1';

  socket.on(SOCKET_EVENT.SEND_MESSAGE, (requestData) => {
    const responseData = {
      ...requestData,
      type,
      time: new Date(),
    };
    socketIo.emit(SOCKET_EVENT.RECEIVE_MESSAGE, responseData);
    printLog(responseData);
  });

  // Object.keys(SOCKET_EVENT).forEach((typeKey) => {
  //   const type = SOCKET_EVENT[typeKey];

  //   socket.on(type, (requestData) => {
  //     const firstVisit = type === SOCKET_EVENT.JOIN_ROOM;

  //     if (firstVisit) {
  //       socket.join(roomName);
  //     }

  //     const responseData = {
  //       ...requestData,
  //       type,
  //       time: new Date(),
  //     };
  //     socketIo.to(roomName).emit(SOCKET_EVENT.RECEIVE_MESSAGE, responseData);
  //     printLog(responseData);
  //   });
  // });

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
