// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from 'react-router-dom';
import Journal from './Journals';
import Login from './Login';
import Signup from './Signup';
import Chat from './chat';
import BackgroundMusic from './BackgroundMusic';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const NavigationBar = ({ onLogout }) => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  return (
    <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/journals">MindMate</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-mindmate" />
        <Navbar.Collapse id="navbar-mindmate">
          <Nav className="ms-auto">
            <NavDropdown title="Menu" id="basic-nav-dropdown" align="end">
              <NavDropdown.Item as={Link} to="/journals">Journal</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/chat">Chat</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const ProtectedRoute = ({ token, children }) => {
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [journals, setJournals] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchJournals = async () => {
    try {
      const res = await axios.get('https://mindmate-lhoj.onrender.com/api/journals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJournals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchJournals();
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    navigate('/journals');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const createOrUpdateJournal = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        await axios.put(
          `https://mindmate-lhoj.onrender.com/api/journals/${editingId}`,
          { title, content },
          config
        );
      } else {
        await axios.post(
          'https://mindmate-lhoj.onrender.com/api/journals/add',
          { title, content },
          config
        );
      }
      setTitle('');
      setContent('');
      setEditingId(null);
      fetchJournals();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJournal = async (id) => {
    try {
      await axios.delete(`https://mindmate-lhoj.onrender.com/api/journals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchJournals();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (journal) => {
    setEditingId(journal._id);
    setTitle(journal.title);
    setContent(journal.content);
  };

  const filteredJournals = journals.filter(j =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <BackgroundMusic />
      <div className="container py-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>
        <NavigationBar onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/journals"
            element={
              <ProtectedRoute token={token}>
                <Journal
                  title={title}
                  setTitle={setTitle}
                  content={content}
                  setContent={setContent}
                  editingId={editingId}
                  createOrUpdateJournal={createOrUpdateJournal}
                  startEditing={startEditing}
                  deleteJournal={deleteJournal}
                  filteredJournals={filteredJournals}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute token={token}>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
