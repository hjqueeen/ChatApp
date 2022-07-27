import { useState, useCallback } from 'react';

import styles from './Login.module.css';

// -------------------------------------
// Constants
// -------------------------------------

const APP_NAME = 'Pengueen Chat';
const APP_DESCRIPTION =
  'The most advanced and beautiful chat application in the universe. ' +
  'Everybody should be using this. Choose your name and start chatting now.';

// -------------------------------------
// Component
// -------------------------------------

const NicknameForm = ({ handleSubmitNickname }) => {
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  const handleChangeNickname = useCallback((event) => {
    setNickname(event.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    handleSubmitNickname(nickname);
    setNickname('');

    if (!nickname) {
      setNicknameError('Please choose an ID to start.');
    }
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
          <div className={styles.inputContainer}>
            <input
              className={styles.input}
              id="user-name-input"
              type="text"
              placeholder="User Name"
              value={nickname}
              onChange={handleChangeNickname}
              onPressEnter={handleSubmit}
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
        </div>
      </div>
    </div>
  );
};

export default NicknameForm;
