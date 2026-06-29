import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { apiUrl } from "../../utils/api";

const commonFields = [
  { controlId: "firstName", label: "First Name", type: "text" },
  { controlId: "lastName", label: "Last Name", type: "text" },
  { controlId: "username", label: "Username", type: "text" },
  { controlId: "email", label: "Email", type: "email" },
  { controlId: "password", label: "Password", type: "password" },
];

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiUrl("/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: formData.firstName,
          lastname: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        navigate("/login");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      alert("Error during registration:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-up">
        <div className="auth-badge"><FaUserPlus /></div>
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-sub">Start managing your money in minutes.</p>
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
          <Button type="submit" className="btn-gradient w-100 mt-2 py-2">
            Create Account
          </Button>
        </Form>
        <p className="auth-foot">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
