'use client'

import { useState } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log({ username, password });
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        const errorData = contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();
        console.error("Backend error:", errorData);
        throw new Error("Registration failed");
      }
      const data = await response.json();
      console.log("User registered:", data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;