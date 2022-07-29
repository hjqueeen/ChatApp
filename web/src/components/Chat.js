import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import io from 'socket.io-client';

//react-draft-wysiwyg
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw } from 'draft-js';

//Mui
import { Box, IconButton, TextField } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddIcon from '@mui/icons-material/Add';

//style
import styles from './Chat.module.css';

function Chat({ nickname }) {
  const [messages, setMessages] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [state, setState] = useState({ message: '', name: '' });
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('http://localhost:4000');
    socketRef.current.on('message', ({ message }) => {
      setChat([...chat, { message }]);
    });
    return () => socketRef.current.disconnect();
  }, [chat]);

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    const { message } = state;
    socketRef.current.emit('message', { message });
    e.preventDefault();
    setState({ message: '' });
    scrollToBottom();
  };

  // send and receive message

  const onEditorStateChange = useCallback((newState) => {
    setEditorState(newState);
  }, []);

  //convert entered message to html
  const handleSendMesssage = () => {
    const typedMessage = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    // socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
    //   nickname,
    //   content: typedMessage,
    // });
    // setEditorState('');
  };

  //scroll to bottom  (ScrollintoView)
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderChat = () => {
    const userNickname = nickname;
    return chat.map(({ name, message }, index) => (
      <li key={index}>
        <h3>
          {userNickname}: <span>{message}</span>
        </h3>
      </li>
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
        <ul className={styles.messagesWrapper}>
          {renderChat()}
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
      <div className="card">
        <form onSubmit={onMessageSubmit}>
          <h1>Messenger</h1>
          <div className="name-field">
            <TextField
              name="name"
              onChange={(e) => onTextChange(e)}
              value={state.name}
              label="Name"
            />
          </div>
          <div>
            <TextField
              name="message"
              onChange={(e) => onTextChange(e)}
              value={state.message}
              id="outlined-multiline-static"
              variant="outlined"
              label="Message"
            />
          </div>
          <button>Send Message</button>
        </form>
      </div>
    </Box>
  );
}

export default Chat;
