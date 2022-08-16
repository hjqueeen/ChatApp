import React, { useCallback, useState, useRef } from 'react';

import Chat from './components/Chat';
import Login from './components/Login';
import io from 'socket.io-client';

import './App.css';

const App = () => {
  const [nickname, setNickname] = useState('');

  const socketRef = useRef();

  const handleSubmitNickname = useCallback((newNickname) => {
    setNickname(newNickname);
    socketRef.current = io.connect('http://localhost:4000');
    socketRef.current.emit('joinRoom');
  }, []);

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
