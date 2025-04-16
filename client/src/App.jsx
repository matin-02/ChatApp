import React, { useEffect, useState } from 'react';
import socket from './socket';
import ChatBox from './components/ChatBox';
import './index.css'; 
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [messages, setMessages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    socket.on('user_list', (userList) => {
      setUsers(userList.filter(user => user !== username));
    });

    socket.on('receive_private_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('user_list');
      socket.off('receive_private_message');
    };
  }, [username]);

  const handleRegister = () => {
    if (username.trim()) {
      socket.emit('register_user', username);
      setIsRegistered(true);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="container">
      <button className="toggle-button" onClick={toggleDarkMode}>
        {isDarkMode ? '🌞' : '🌙'}
      </button>

      {!isRegistered ? (
        <div className="left-panel">
          <h2>Enter your name</h2>
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress} // Trigger handleRegister on Enter key press
          />
          <button onClick={handleRegister}>Join Chat</button>
        </div>
      ) : (
        <div className="right-panel">
          <div className="left-panel">
            <h3>Online Users</h3>
            {users.length === 0 ? (
              <p>No other users online</p>
            ) : (
              users.map((user) => (
                <div
                  key={user}
                  className={`user-item ${selectedUser === user ? 'selected-user' : ''}`}
                  onClick={() => setSelectedUser(user)}
                >
                  {user}
                </div>
              ))
            )}
          </div>

          <div className="chat-messages">
            {selectedUser ? (
              <ChatBox
                sender={username}
                receiver={selectedUser}
                messages={messages.filter(
                  (msg) =>
                    (msg.sender === username && msg.receiver === selectedUser) ||
                    (msg.sender === selectedUser && msg.receiver === username)
                )}
              />
            ) : (
              <p>Select a user to start chatting</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
