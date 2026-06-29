import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaWallet, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Cookies from 'js-cookies';
import { apiUrl } from '../../utils/api';

const commonFields = [
    { controlId: 'email', label: 'Email', type: 'email', icon: <FaEnvelope /> },
    { controlId: 'password', label: 'Password', type: 'password', icon: <FaLock /> },
];

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.getItem('jwtToken');
        if (token) {
            navigate('/'); // Redirect to home if token exists
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apiUrl('/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                Cookies.setItem('jwtToken', data.token, { expires: 30 })
                Cookies.setItem('userId', data.user._id)
                Cookies.setItem('userName', data.user.firstname)
                navigate('/');
            } else {
                alert("Email or Password didn't match");
            }
        } catch (error) {
            alert('Error during login:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-up">
                <div className="auth-badge"><FaWallet /></div>
                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-sub">Log in to continue tracking your expenses.</p>
                <Form onSubmit={handleSubmit}>
                    {commonFields.map((field) => {
                        const isPwd = field.controlId === 'password';
                        return (
                            <Form.Group className="mb-3" controlId={field.controlId} key={field.controlId}>
                                <Form.Label>{field.label}</Form.Label>
                                <div className={isPwd ? 'pwd-wrap' : ''}>
                                    <Form.Control
                                        type={isPwd && showPassword ? 'text' : field.type}
                                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                                        name={field.controlId}
                                        value={formData[field.controlId]}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {isPwd && (
                                        <button
                                            type="button"
                                            className="pwd-toggle"
                                            onClick={() => setShowPassword((s) => !s)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    )}
                                </div>
                            </Form.Group>
                        );
                    })}
                    <Button type="submit" className="btn-gradient w-100 mt-2 py-2">Log In</Button>
                </Form>
                <p className="auth-foot">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
