import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

//socket.io
import { SocketContext, SOCKET_EVENT, makeMessage } from '../service/socket';

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

const Chat = ({ nickname }) => {
  const [messages, setMessages] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // send and receive message
  const socket = useContext(SocketContext);

  const onEditorStateChange = useCallback((newState) => {
    setEditorState(newState);
  }, []);

  //convert entered message to html
  const handleSendMesssage = () => {
    const typedMessage = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    // console.log(typedMessage);

    socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
      nickname,
      content: typedMessage,
    });
    // setEditorState('');
  };

  //scroll to bottom  (ScrollintoView)
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReceiveMessage = useCallback((pongData) => {
    const newMessage = makeMessage(pongData);
    console.log(`pontData is ${pongData}`);
    setMessages((messages) => [...messages, newMessage]);
    scrollToBottom();
  }, []);

  useEffect(() => {
    socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, handleReceiveMessage);

    return () => {
      socket.off(SOCKET_EVENT.RECEIVE_MESSAGE, handleReceiveMessage);
    };
  }, [socket, handleReceiveMessage]);

  // const renderChat = (messages) => {
  //   return messages.map((message, index) => (
  //     <li key={index}>
  //       <div className="message-nickname">{nickname}: </div>
  //       <div>{content}</div>
  //       <div className="time">{time}</div>
  //     </li>
  //   ));
  // };
  //

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
        <ul className={styles.messagesWrapper}>
          {/* {messages.map((message, index) => (
            <li key={index}>
              <div className="message-nickname">{nickname}: </div>
              <div>{content}</div>
              <div className="time">{time}</div>
            </li>
          ))} */}
        </ul>

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
        {/* <QuillEditor
          quillRef={quillRef}
          htmlContent={htmlContent}
          setHtmlContent={setHtmlContent}
        /> */}
        <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        />
        <button onClick={handleSendMesssage}>send</button>
      </Box>
    </Box>
  );
};

export default Chat;
