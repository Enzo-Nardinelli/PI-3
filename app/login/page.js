'use client'
import { useState } from 'react';
import './page.css';
import Header from '../components/headerComponent';
import { useNavigate } from 'react-router-dom';
//import { useAuth } from '../authProvider/authProvider';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  //const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();
      
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));
      console.log("User logged in:", data.userJogos);
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleClick = () => {
      navigate("/");
  };

  return (
    <div className='app01'>
      <div className='centered-form'>
      <form onSubmit={handleLogin}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Confirmar</button>
        <button onClick={handleClick}>Registrar</button>
      </form>
      </div>
    </div>
  );
}

export default Login;
