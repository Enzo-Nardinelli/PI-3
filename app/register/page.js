'use client'

import { useState } from 'react';
import './page.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log({ username, password });
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      console.log("User registered:", data);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className='app02'>
      <div className='centered-form'>
        <form onSubmit={handleRegister}>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;