// src/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://mindmate-lhoj.onrender.com/signup', form);
      alert('Signup successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || 'Signup error');
    }
  };

  
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: 400 }} className="p-4 shadow-sm">
        <h3 className="text-center mb-4">Create a MindMate Account</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100">
            Sign Up
          </Button>
        </Form>
        <div className="text-center mt-3">
          <small>
            Already have an account? <Link to="/login">Login</Link>
          </small>
        </div>
      </Card>
    </Container>
  );
}

export default Signup;
