import React, { useState } from 'react';
import socket from '../socket';
import Message from './Message';
import './ChatBox.css';

const ChatBox = ({ sender, receiver, messages }) => {
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('private_message', { sender, receiver, text: input });
      setInput('');
    }
  };

  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      sendMessage();
    }
  };

  return (
    <div className="chatbox-container">
      <h2 className="chatbox-header">Chatting with {receiver}</h2>
      <div className="message-container">
        {messages.map((msg, i) => (
          <Message key={i} message={msg} isOwn={msg.sender === sender} />
        ))}
      </div>
      <div className="chatbox-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          rows={3}
          onKeyDown={handleKeyPress} // 
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
