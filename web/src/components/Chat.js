import React, { useEffect, useRef, useState } from 'react';

import './Chat.css';

import { Box } from '@mui/material';
import io from 'socket.io-client';
import TextEditor1 from './TextEditor1';

const Chat = () => {
  // const [state, setState] = useState({ message: '', name: '' });
  const [chat, setChat] = useState([]);

  //react-quill WYSIWYG
  const [htmlContent, setHtmlContent] = useState('');
  const quillRef = useRef();

  // send and receive message
  const socketRef = useRef();

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

  const onMessageSubmit = (e) => {
    e.preventDefault();
    const message = htmlContent;
    socketRef.current.emit('message', { message });
    setHtmlContent('');
  };

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
    <div className="background">
      <Box className="chat">
        <Box className="chat-header">HEADER</Box>
        <Box className="chat-contents">
          <ul className="render-chat">{renderChat()}</ul>

          {/* scroll to bottom  (ScrollintoView) */}
          <div ref={messagesEndRef}></div>
        </Box>
        <Box className="chat-footer">
          <form className="chat-footer-input" onSubmit={onMessageSubmit}>
            <div>
              <TextEditor1
                quillRef={quillRef}
                htmlContent={htmlContent}
                setHtmlContent={setHtmlContent}
              />
            </div>
            <button
              className="chat-footer-input-button"
              // onClick={handleSubmit}
            >
              Send Message
            </button>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default Chat;
