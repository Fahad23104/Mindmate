// src/JournalList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Spinner } from "react-bootstrap";

const JournalList = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournals = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://localhost:5000/api/journals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJournals(res.data);
      } catch (err) {
        console.error("Error fetching journals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/journals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournals(journals.filter((j) => j._id !== id));
    } catch (err) {
      console.error("Error deleting journal:", err);
    }
  };

  const handleEdit = (journal) => {
    alert("Edit feature coming soon!");
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">📝 Your Journals</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : journals.length === 0 ? (
        <p>No journals found.</p>
      ) : (
        journals.map((journal) => (
          <Card key={journal._id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>{journal.title}</Card.Title>
              <Card.Text>{journal.content}</Card.Text>
              <small className="text-muted d-block mb-2">
                Sentiment: <strong>{journal.sentiment || "N/A"}</strong>
              </small>
              <Button variant="outline-primary" size="sm" onClick={() => handleEdit(journal)}>
                Edit
              </Button>{" "}
              <Button variant="outline-danger" size="sm" onClick={() => handleDelete(journal._id)}>
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default JournalList;
