import React, { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

//react-draft-wysiwyg
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw } from 'draft-js';

//Mui
import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddIcon from '@mui/icons-material/Add';

//style
import styles from './Chat.module.css';

function Chat({ nickname }) {
  // const [messages, setMessages] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // const [state, setState] = useState({ message: '', name: '' });
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('http://localhost:4000');
    socketRef.current.on('message', (messagePackage) => {
      setChat([...chat, messagePackage]);
    });
    return () => socketRef.current.disconnect();
  }, [chat]);

  const onEditorStateChange = useCallback((editorState) => {
    setEditorState(editorState);
  }, []);

  //convert entered message to html
  const handleSendMesssage = useCallback(() => {
    if (editorState) {
      const typedMessage = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );
      const messagePackage = {
        name: nickname,
        message: typedMessage,
      };

      socketRef.current.emit('message', messagePackage);

      setEditorState(EditorState.createEmpty());
      scrollToBottom();
    }
  }, [editorState, nickname]);

  //scroll to bottom  (ScrollintoView)
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderChat = () => {
    // const userNickname = nickname;
    return chat.map(({ name, message }) => (
      <div className={styles.message}>
        <div className={styles.messageName}>{name}</div>
        <div className={styles.messageContent}>
          <div
            dangerouslySetInnerHTML={{
              __html: message,
            }}
          />
        </div>
      </div>
    ));
  };

  return (
    <Box className={styles.container}>
      {/* header */}
      <Box className={styles.headerContainer}>
        <header className={styles.header}>
          <IconButton>
            <ChevronLeftIcon />
          </IconButton>
          <h2 className={styles.titleText}>Welcome to {nickname}.</h2>
          <IconButton>
            <AddIcon />
          </IconButton>
        </header>
      </Box>

      {/* chat */}
      <Box className={styles.messagesContainer}>
        <div className={styles.messagesWrapper}>{renderChat()}</div>
        {/* scroll to bottom  (ScrollintoView) */}
        <div ref={messagesEndRef}></div>
      </Box>

      {/* Editor */}
      <Box className={styles.editor}>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={onEditorStateChange}
        />
        <button onClick={handleSendMesssage}>send</button>
      </Box>
    </Box>
  );
}

export default Chat;
