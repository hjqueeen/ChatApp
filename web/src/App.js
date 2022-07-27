import React, { useCallback, useEffect, useState, useRef } from 'react';

import { socket, SocketContext, SOCKET_EVENT } from './service/socket';
import Chat from './components/Chat';
import Login from './components/Login';

import './App.css';

const App = () => {
  const prevNickname = useRef(null);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (prevNickname.current) {
      socket.emit(SOCKET_EVENT.UPDATE_NICKNAME, {
        prevNickname: prevNickname.current,
        nickname,
      });
    } else {
      socket.emit(SOCKET_EVENT.JOIN_ROOM, { nickname });
    }
  }, [nickname]);

  const handleSubmitNickname = useCallback(
    (newNickname) => {
      prevNickname.current = nickname;

      if (newNickname === '') {
        setNickname('');
      } else {
        setNickname(newNickname);
      }
    },
    [nickname]
  );

  return (
    <SocketContext.Provider value={socket}>
      <div>
        {!nickname ? (
          <Login handleSubmitNickname={handleSubmitNickname} />
        ) : (
          <Chat nickname={nickname} />
        )}
      </div>
    </SocketContext.Provider>
  );
};

export default App;
