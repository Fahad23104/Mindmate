// src/JournalForm.js
import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";

const JournalForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/journals/add",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Journal saved successfully!");
      setIsError(false);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving journal. Are you logged in?");
      setIsError(true);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h4 className="mb-3">📝 Add New Journal</h4>
          {message && (
            <Alert variant={isError ? "danger" : "success"}>{message}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                placeholder="Content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit">Add Journal</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JournalForm;
