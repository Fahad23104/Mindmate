// src/Journals.js
import React, { useState } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';


const Journals = ({
  title,
  setTitle,
  content,
  setContent,
  editingId,
  createOrUpdateJournal,
  startEditing,
  deleteJournal,
  filteredJournals,
  searchQuery,
  setSearchQuery
}) => {
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const journalsPerPage = 5;

  const exportJournals = () => {
    const blob = new Blob([JSON.stringify(filteredJournals)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'journals.json';
    link.click();
  };

  const sorted = [...filteredJournals].sort((a, b) =>
    sortOrder === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt)
  );
  const paginated = sorted.slice((currentPage - 1) * journalsPerPage, currentPage * journalsPerPage);
  const totalPages = Math.ceil(filteredJournals.length / journalsPerPage);

  return (
    <>
      <h2 className="mb-4">Welcome to Your Journals</h2>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={createOrUpdateJournal}>
            <Row className="mb-3">
              <Col><Form.Control
                placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required
              /></Col>
            </Row>
            <Row className="mb-3">
              <Col><Form.Control
                as="textarea" placeholder="Content" rows={3}
                value={content} onChange={e => setContent(e.target.value)} required
              /></Col>
            </Row>
            <Button type="submit">{editingId ? 'Update' : 'Add'} Journal</Button>
          </Form>
        </Card.Body>
      </Card>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </Form.Select>
        </Col>
        <Col><Button onClick={exportJournals}>Export JSON</Button></Col>
      </Row>

      {paginated.map(j => (
        <Card key={j._id} className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title>{j.title}</Card.Title>
            <Card.Text>{j.content}</Card.Text>
            <div className="mb-2">
              <small className="text-muted">
                Sentiment: <strong>{j.sentiment}</strong> (Score: {j.score})
              </small>
            </div>
            <div className="mb-2">
              <small className="text-muted">
                Date: {new Date(j.createdAt).toLocaleString()}
              </small>
            </div>
            <Button variant="outline-primary" size="sm" onClick={() => startEditing(j)}>Edit</Button>{' '}
            <Button variant="outline-danger" size="sm" onClick={() => deleteJournal(j._id)}>Delete</Button>
          </Card.Body>
        </Card>
      ))}

      {paginated.length === 0 && <p>No journals found.</p>}

      <div className="mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i} variant={i + 1 === currentPage ? 'primary' : 'light'}
            className="me-2"
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      <div className="mt-5">
      </div>
    </>
  );
};
{/* Floating Action Button */}
<Button
  variant="primary"
  className="rounded-circle"
  style={{
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    fontSize: '28px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: 1000,
  }}
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
>
  +
</Button>

export default Journals;
