import React from 'react';
import './Message.css'; 


const Message = ({ message, isOwn }) => {
  return (
    <div style={{ textAlign: isOwn ? 'right' : 'left' }}>
      <p><strong>{isOwn ? 'You' : message.sender}</strong>: {message.text}</p>
    </div>
  );
};

export default Message;
