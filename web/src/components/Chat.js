import React, { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

//react-draft-wysiwyg
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, getDefaultKeyBinding } from 'draft-js';

//Mui
import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddIcon from '@mui/icons-material/Add';

//style
import styles from './Chat.module.css';

function Chat({ nickname }) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [chat, setChat] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [editorFocused, setEditorFocused] = useState(false);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('http://localhost:4000');
    socketRef.current.on('receivedMessage', (messagePackage) => {
      console.log('Message List');
      setChat([...chat, messagePackage]);
      console.log(chat);
    });
    return () => socketRef.current.disconnect();
  }, [chat]);

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

      socketRef.current.emit('sendMessage', messagePackage);

      setEditorState(EditorState.createEmpty());
      scrollToBottom();
    } else {
    }
  }, [editorState, nickname]);

  //scroll to bottom  (ScrollintoView)
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div className={styles.message} key={index}>
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

  // const onEditorFocus = event => {
  //   const { onFocus } = this.props;
  //   setEditorFocused(true);

  //   const editFocused = this.focusHandler.isEditorFocused();
  //   if (onFocus && editFocused) {
  //     onFocus(event);
  //   }
  // };

  const myKeyBindingFn = (e) => {
    if (e.keyCode === 13 /* `enter` key */) {
      return 'myeditor-save';
    }
    return getDefaultKeyBinding(e);
  };

  const handleKeyCommand = (command, editorState) => {
    if (command === 'myeditor-save') {
      handleSendMesssage();
      return 'handled';
    }
    return 'not-handled';
  };

  const uploadImageCallBack = (file) => {
    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    };

    uploadedImages.push(imageObject);

    setUploadedImages(uploadedImages);

    return new Promise((resolve, reject) => {
      resolve({ data: { link: imageObject.localSrc } });
    });
  };

  return (
    <Box className={styles.container}>
      {/* header */}
      <Box className={styles.headerContainer}>
        <header className={styles.header}>
          <IconButton>
            <ChevronLeftIcon />
          </IconButton>
          <h2 className={styles.titleText}>Welcome to {nickname}</h2>
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
      <Box
        className={styles.editor}
        //  onFocus={onEditorFocus}
        // onBlur={onEditorBlur}
      >
        <Editor
          editorState={editorState}
          editorStyle={{ overflow: 'hidden' }}
          wrapperClassName={styles.draftWrapper}
          editorClassName={styles.draftEditor}
          toolbarClassName={styles.draftToolbar}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={myKeyBindingFn}
          onEditorStateChange={(editorState) => {
            setEditorState(editorState);
          }}
          toolbar={{
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough'],
            },
            list: { options: ['unordered', 'ordered'] },
            blockType: {
              inDropdown: true,
              options: ['Normal', 'H1', 'H2', 'H3'],
            },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: false },
            image: {
              uploadCallback: uploadImageCallBack,
              alt: { present: true, mandatory: true },
            },
          }}
        />
        <button className={styles.sendButton} onClick={handleSendMesssage}>
          send
        </button>
      </Box>
    </Box>
  );
}

export default Chat;
