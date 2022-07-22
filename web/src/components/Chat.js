import React, { useEffect, useRef, useState } from 'react';

import './Chat.css';

import { Box, TextField } from '@mui/material';
import ChatMsg from '@mui-treasury/components/chatMsg/ChatMsg';
import io from 'socket.io-client';

const Chat = () => {
  const [state, setState] = useState({ message: '', name: '' });
  const [chat, setChat] = useState([]);

  // send and receive message
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('http://localhost:4000');
    socketRef.current.on('message', ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
    return () => socketRef.current.disconnect();
  }, [chat]);

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    const { name, message } = state;
    socketRef.current.emit('message', { name, message });
    e.preventDefault();
    setState({ message: '', name });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) =>
      name === state.name ? (
        <li key={index}>
          <ChatMsg side={'right'} messages={[`${message}`]} />
        </li>
      ) : (
        <li key={index}>
          <div className="chat-contents-message">
            <span className="chat-partner">{name}</span>
          </div>
          <ChatMsg avatar={''} messages={[`${message}`]} />
        </li>
      )
    );
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
          <ChatMsg
            avatar={''}
            messages={[
              'Hi Jenny, How r u today?',
              'Did you train yesterday',
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Volutpat lacus laoreet non curabitur gravida.',
            ]}
          />
          <ChatMsg
            side={'right'}
            messages={[
              "Great! What's about you?",
              'Of course I did. Speaking of which check this out',
            ]}
          />
          <ChatMsg avatar={''} messages={['Im good.', 'See u later.']} />
          <ul className="render-chat">{renderChat()}</ul>

          {/* scroll to bottom  (ScrollintoView) */}
          <div ref={messagesEndRef}></div>
        </Box>
        <Box className="chat-footer">
          <form className="chat-footer-input" onSubmit={onMessageSubmit}>
            <TextField
              name="name"
              onChange={(e) => onTextChange(e)}
              value={state.name}
              label="Name"
              style={{ width: 100 }}
            />

            <TextField
              name="message"
              className="chat-footer-input-message"
              onChange={(e) => onTextChange(e)}
              value={state.message}
              id="outlined-multiline-static"
              variant="outlined"
              label="Message"
            />

            <button className="chat-footer-input-button">Send Message</button>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default Chat;
