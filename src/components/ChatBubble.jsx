import React from 'react';

const ChatBubble = ({ isBot, message, children }) => {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 w-full`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center font-bold text-xs mr-2 shrink-0">
          I247
        </div>
      )}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
        isBot 
          ? 'bg-white text-navy rounded-tl-none border border-gray-100' 
          : 'bg-saffron text-white rounded-tr-none'
      }`}>
        {message && <p>{message}</p>}
        {children}
      </div>
    </div>
  );
};

export default ChatBubble;
