import { createContext } from 'react';
import socketIo from 'socket.io-client';
import dayjs from 'dayjs';

export const socket = socketIo('http://localhost:4000', {
  withCredentials: true,
});
export const SocketContext = createContext(socket);

export const SOCKET_EVENT = {
  // JOIN_ROOM: 'JOIN_ROOM',
  // UPDATE_NICKNAME: 'UPDATE_NICKNAME',
  SEND_MESSAGE: 'SEND_MESSAGE',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
};

export const makeMessage = (pongData) => {
  const { nickname, content, type, time } = pongData;

  let nicknameLabel;
  let contentLabel = '';

  switch (type) {
    // case SOCKET_EVENT.JOIN_ROOM: {
    //   console.log('방에 들어왔습니다');
    //   contentLabel = `${nickname} has joined the room.`;
    //   break;
    // }
    // case SOCKET_EVENT.UPDATE_NICKNAME: {
    //   contentLabel = `User's name has been changed.\n ${prevNickname} => ${nickname}.`;
    //   break;
    // }
    case SOCKET_EVENT.SEND_MESSAGE: {
      console.log('메시지를 보냈습니다');
      contentLabel = content;
      nicknameLabel = nickname;
      break;
    }
    default:
  }

  return {
    nickname: nicknameLabel,
    content: contentLabel,
    time: dayjs(time).format('HH:mm'),
  };
};

socket.on('connect', () => {
  console.log('socket server connected.');
});

socket.on('disconnect', () => {
  console.log('socket server disconnected.');
});
