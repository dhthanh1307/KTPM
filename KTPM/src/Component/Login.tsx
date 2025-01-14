import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row, Form, Alert } from 'react-bootstrap';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1001/unauthen/login', { username, password });
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      setMessage('Đăng nhập thành công!');
      navigate('/event');
    } catch (error) {
      setMessage('Đăng nhập thất bại, vui lòng kiểm tra lại thông tin.');
    }
  };









  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 w-100" fluid
      style={{
        background: 'linear-gradient(45deg, #7e2e8f, #f7a7c1, #4a90e2)',
      }}>
      <Row className="w-75 bg-light rounded-5">
        <Col md={6} className="d-flex justify-content-center align-items-center  p-4 ">
          <img
            src="https://i.pinimg.com/736x/0b/8e/41/0b8e410aa05816bfda615c2a6717ed9f.jpg"
            alt="Login"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Col>
        <Col md={6} className="p-5">
          <h1 className=" fs-1 fw-bold mb-4">Partner Login</h1>
          {message && <Alert variant={message.includes('thất bại') ? 'danger' : 'success'}>{message}</Alert>}
          <Form onSubmit={handleLogin} className="pb-4">
            <Form.Group controlId="username" className="mb-3 mt-5">
              <Form.Control
                type="text"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className='rounded-3 p-2 fs-5'
              />
            </Form.Group>
            <Form.Group controlId="password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='rounded-3 p-2 fs-5'
              />
            </Form.Group>
            
            <Button variant="primary" type="submit" className="w-100 mt-3 rounded-5 p-2 fs-3 fw-bold" style={{
              background: 'linear-gradient(45deg, #7e2e8f, #4a90e2)',
            }}>
              LOGIN
            </Button>
          </Form>
          <h5 className="text-center fw-bold mb-4"> Already have an account? 
            <a href="/register" className="text-primary"> Register</a>
          </h5>
        </Col>
      </Row>
    </Container>

  );
};

export default Login;