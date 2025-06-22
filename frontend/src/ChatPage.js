import React from 'react';

function ChatPage({ chatMessages, chatInput, setChatInput, handleChatSubmit, chatLoading }) {
  return (
    <div>
      <h1>Chat with MindMate</h1>
      <div style={{
        border: "1px solid #ccc",
        padding: "10px",
        width: "300px",
        height: "300px",
        overflowY: "scroll",
        marginBottom: "10px"
      }}>
        {chatMessages.map((msg, idx) => (
          <div key={idx} style={{
            textAlign: msg.sender === 'user' ? 'right' : 'left',
            marginBottom: "5px"
          }}>
            <strong>{msg.sender === 'user' ? 'You' : 'MindMate'}:</strong> {msg.text}
          </div>
        ))}
        {chatLoading && <div><em>MindMate is typing...</em></div>}
      </div>

      <form onSubmit={handleChatSubmit} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask something..."
          style={{ flex: 1 }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatPage;
