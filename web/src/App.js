import React, { useCallback, useEffect, useState, useRef } from 'react';

import { socket, SocketContext, SOCKET_EVENT } from './service/socket';
import Chat from './components/Chat';
import Login from './components/Login';

import './App.css';

const App = () => {
  // const prevNickname = useRef(null);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   socket.emit(SOCKET_EVENT.JOIN_ROOM, { nickname });
  // }, [nickname]);

  const handleSubmitNickname = useCallback(
    (newNickname) => {
      setNickname(newNickname);
    },
    [nickname]
  );

  return (
    <div>
      {!nickname ? (
        <Login handleSubmitNickname={handleSubmitNickname} />
      ) : (
        <Chat nickname={nickname} />
      )}
    </div>
  );
};

export default App;
