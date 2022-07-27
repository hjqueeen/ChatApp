import React from 'react';
import './App.css';
import Chat from './components/Chat';
// import Login from './components/Login';

function App() {
  // const [username, setUsername] = useState(null);

  // const handleRegister = (username) => {
  //   setUsername(username);
  //   console.log(username);
  // };

  return (
    <React.Fragment>
      {/* {!username ? (
        <Login onRegister={handleRegister} username={username} />
      ) : ( */}
      <Chat
      // username={username}
      />
      {/* )} */}
    </React.Fragment>
  );
}

export default App;
