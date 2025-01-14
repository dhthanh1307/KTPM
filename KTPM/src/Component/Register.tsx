import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
// import { FaCamera } from 'react-icons/fa';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        companyName: '',
        avatar: '',
        field: '',
        address: '',
        gpsLong:21.0285,
        gpsLat:105.8542,

    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:1001/unauthen/register/partner', formData);

            // If registration is successful, handle the success response
            console.log('Register success:', response.data);
            navigate('/');
            setErrorMessage(null); // Clear any previous error message if registration is successful
        } catch (error) {
            // Handle errors
            if (axios.isAxiosError(error)) {
                // Check for error response
                if (error.response) {
                    const statusCode = error.response.status;
                    const message = error.response.data.message || 'An error occurred';

                    if (statusCode === 400) {
                        setErrorMessage('Please fill in all required fields.');
                    } else if (statusCode === 409) {
                        setErrorMessage('Username is already taken.');
                    } else {
                        setErrorMessage(message);
                    }
                } else {
                    setErrorMessage('Network error or server not responding.');
                }
            } else {
                setErrorMessage('An unknown error occurred.');
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 w-100" fluid
            style={{
                background: 'linear-gradient(45deg, #7e2e8f, #f7a7c1, #4a90e2)',
            }}>
            <Row className="w-75 bg-light rounded-5">
                <Col md={6} className="d-flex justify-content-center align-items-center p-4 ">
                    <img
                        src={formData.avatar || 'https://i.pinimg.com/736x/0b/8e/41/0b8e410aa05816bfda615c2a6717ed9f.jpg'}
                        alt="Register"
                        style={{ width: '80%', height: '80%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                </Col>
                <Col md={6} className="p-5">
                    <h1 className="fs-1 fw-bold mb-4">Partner Register</h1>
                    {errorMessage && (
                        <Alert variant="danger" className="mb-4">
                            {errorMessage}
                        </Alert>
                    )}
                    <Form onSubmit={handleRegister} className="pb-4">
                        <Form.Group controlId="username" className="mb-3 mt-5">
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                                name="username"
                                required
                                className='rounded-3 p-2 fs-5'
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                name="password"
                                required
                                className='rounded-3 p-2 fs-5'
                            />
                        </Form.Group>



                        <Form.Group controlId="address" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                name="address"
                                required
                                className='rounded-3 p-2 fs-5'
                            />
                        </Form.Group>
                        <div className='d-flex gap-3'>
                            <Form.Group controlId="company" className="mb-3 w-50">
                                <Form.Control
                                    type="text"
                                    placeholder="Company"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    name="companyName"
                                    required
                                    className='rounded-3 p-2 fs-5 '
                                />
                            </Form.Group>

                            <Form.Group controlId="field" className="mb-3 w-50">
                                <Form.Control
                                    type="text"
                                    placeholder="Field of Work"
                                    value={formData.field}
                                    onChange={handleInputChange}
                                    name="field"
                                    required
                                    className='rounded-3 p-2 fs-5'
                                />
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Control
                                className="rounded-3 p-2 fs-5"
                                type="text"
                                name="avatar"
                                placeholder="Enter Avatar Image URL"
                                value={formData.avatar}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mt-3 rounded-5 p-2 fs-3 fw-bold"
                            style={{
                                background: 'linear-gradient(45deg, #7e2e8f, #4a90e2)',
                            }}>
                            REGISTER
                        </Button>
                    </Form>
                    <h5 className="text-center fw-bold mb-4"> Already have an account?
                        <a href="/" className="text-primary"> Login</a>
                    </h5>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
