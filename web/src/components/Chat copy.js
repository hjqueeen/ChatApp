import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

//socket.io
import io from 'socket.io-client';
import { SocketContext, SOCKET_EVENT } from '../service/socket';

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

// import QuillEditor from './QuillEditor';

const Chat = ({ nickname }) => {
  // const [state, setState] = useState({ message: '', name: '' });
  const [chat, setChat] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // react-quill WYSIWYG
  // const [htmlContent, setHtmlContent] = useState('');
  // const quillRef = useRef();

  // send and receive message
  const socketRef = useRef();
  const socket = useContext(SocketContext);

  useEffect(() => {
    socketRef.current = io.connect('http://localhost:4000');
    socketRef.current.on('message', ({ message }) => {
      setChat([...chat, { message }]);
    });
    return () => socketRef.current.disconnect();
  }, [chat]);

  // const onTextChange = (e) => {
  //   setState({ ...state, [e.target.name]: e.target.value });
  // };

  // const onMessageSubmit = (e) => {
  //   e.preventDefault();
  //   const message = htmlContent;
  //   socketRef.current.emit('message', { message });
  //   setHtmlContent('');
  // };

  const onEditorStateChange = useCallback(
    (newState) => {
      setEditorState(newState);
      const typedMessage = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );

      // 컨텐츠없을때
      // const noContent = typedMessage === '<p></p>';
      // console.log(noContent);

      // if (noContent) {
      //   return;
      // }

      socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
        nickname,
        content: typedMessage,
      });
      // setEditorState('');
    },
    [socket, nickname, editorState]
  );

  const renderChat = () => {
    return chat.map(({ message }, index) => (
      <li key={index}>
        <div
          dangerouslySetInnerHTML={{ __html: message }}
          className="sent-message"
        ></div>
      </li>
    ));
  };
  //

  //scroll to bottom  (ScrollintoView)
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);
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
        <ul className={styles.messagesWrapper}>{renderChat()}</ul>

        {/* scroll to bottom  (ScrollintoView) */}
        <div ref={messagesEndRef}></div>
      </Box>

      {/* Editor */}
      <Box className={styles.editor}>
        <form>
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
          <button>send</button>
        </form>
      </Box>
    </Box>
  );
};

export default Chat;
