import React, { useCallback, useEffect, useState, useRef } from 'react';

import { socket, SocketContext, SOCKET_EVENT } from './service/socket';
import Chat from './components/Chat';
import Login from './components/Login';

import './App.css';

const App = () => {
  // const prevNickname = useRef(null);
  const [userNickname, setUserNickname] = useState('');

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // if (prevNickname.current) {
    //   socket.emit(SOCKET_EVENT.UPDATE_NICKNAME, {
    //     prevNickname: prevNickname.current,
    //     nickname,
    //   });
    // } else {
    console.log(userNickname);

    socket.emit(SOCKET_EVENT.JOIN_ROOM, { userNickname });
    // }
  }, [userNickname]);

  const handleSubmitNickname = useCallback(
    (newNickname) => {
      // prevNickname.current = userNickname;

      // if (newNickname === '') {
      //   setUserNickname('');
      // } else {
      setUserNickname(newNickname);
      // }
    },
    [userNickname]
  );

  return (
    <SocketContext.Provider value={socket}>
      <div>
        {!userNickname ? (
          <Login handleSubmitNickname={handleSubmitNickname} />
        ) : (
          <Chat nickname={userNickname} />
        )}
      </div>
    </SocketContext.Provider>
  );
};

export default App;
