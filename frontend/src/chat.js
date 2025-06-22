// src/Chat.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form, Container, Spinner } from 'react-bootstrap';

function Chat() {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();

    // Add user message to chat log
    setChatLog(prev => [...prev, { sender: 'You', message: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/chat', {
        message: userMessage,
        history: history
      });

      const botReply = res.data.response;

      // Update chat display log
      setChatLog(prev => [...prev, { sender: 'MindMate', message: botReply }]);

      // Update history with both user and assistant messages
      setHistory(prev => [...prev, userMessage, botReply]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h4 className="mb-4 text-center text-primary">
            Chat with <strong>MindMate</strong>
          </h4>

          <div
            className="border rounded p-3 bg-light mb-3"
            style={{ height: '60vh', overflowY: 'auto', background: '#f9f9f9' }}
          >
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`d-flex mb-2 ${msg.sender === 'You' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`p-2 rounded shadow-sm ${
                    msg.sender === 'You' ? 'bg-primary text-white' : 'bg-white text-dark'
                  }`}
                  style={{ maxWidth: '75%' }}
                >
                  <div className="small fw-bold mb-1">{msg.sender}</div>
                  <div>{msg.message}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="d-flex justify-content-start mb-2">
                <div className="p-2 rounded bg-white shadow-sm text-dark" style={{ maxWidth: '75%' }}>
                  <div className="small fw-bold mb-1">MindMate</div>
                  <div className="fst-italic">Typing...</div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <Form onSubmit={e => { e.preventDefault(); handleSend(); }}>
            <Form.Group className="d-flex">
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" className="ms-2" variant="primary" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Send'}
              </Button>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Chat;
