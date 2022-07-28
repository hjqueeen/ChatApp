const app = require('express')();
const http = require('http').createServer(app);
// const cors = require('cors');
const socketIo = require('socket.io')(http, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

const colors = require('colors/safe');

const SOCKET_EVENT = {
  JOIN: 'JOIN_ROOM',
  UPDATE_NICKNAME: 'UPDATE_NICKNAME',
  SEND: 'SEND',
  RECEIVE: 'RECEIVE',
};

socketIo.on('connection', function (socket) {
  console.log('소켓이 연결되었습니다');
  console.log(`${colors.brightGreen('socket connection succeeded.')}`);

  const roomName = 'room 1';

  Object.keys(SOCKET_EVENT).forEach((typeKey) => {
    const type = SOCKET_EVENT[typeKey];

    socket.on(type, (requestData) => {
      const firstVisit = type === SOCKET_EVENT.JOIN_ROOM;

      if (firstVisit) {
        socket.join(roomName);
      }

      const responseData = {
        ...requestData,
        type,
        time: new Date(),
      };
      socketIo.to(roomName).emit(SOCKET_EVENT.RECEIVE_MESSAGE, responseData);
      printLog(responseData);

      // 서버는 이벤트를 받은 시각과 함께 데이터를 그대로 중계해주는 역할만 수행
      // 프론트엔드에서 출력 메시지 값 등을 관리
    });
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
