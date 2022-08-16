import { useState, useCallback, useRef } from 'react';
import io from 'socket.io-client';
// import { socket, SocketContext, SOCKET_EVENT } from '../service/socket';

import styles from './Login.module.css';

// -------------------------------------
// Constants
// -------------------------------------

const APP_NAME = 'Pengueen Chat';
const APP_DESCRIPTION =
  'The most advanced and beautiful chat application in the universe. ' +
  'Everybody should be using this. Choose your nickname and start chatting now.';
const NICKNAME_ERROR = 'Please choose a nickname to start.';

// -------------------------------------
// Component
// -------------------------------------

const Login = ({ handleSubmitNickname }) => {
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  const socketRef = useRef();

  const handleChangeNickname = useCallback((event) => {
    setNickname(event.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    handleSubmitNickname(nickname);
    socketRef.current = io.connect('http://localhost:4000');
    socketRef.current.emit('joinRoom', nickname);

    if (!nickname) {
      setNicknameError(NICKNAME_ERROR);
    }

    return () => socketRef.current.disconnect();
  }, [handleSubmitNickname, nickname]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.h1}>{APP_NAME}</h1>
        </div>
        <div className={styles.top}>
          <h2 className={styles.subtitle}>
            Have a <span className={styles.highlighted}>Nice</span> Chat
          </h2>
          <p className={styles.description}>{APP_DESCRIPTION}</p>
        </div>
        <div className={styles.bottom}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                id="user-name-input"
                type="text"
                placeholder="Nickname"
                value={nickname}
                onChange={handleChangeNickname}
              />
            </div>
            <p className={styles.error}>{nicknameError}</p>
            <button
              type="submit"
              className={styles.button}
              onClick={handleSubmit}
            >
              Connect
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
