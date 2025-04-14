'use client'
import { useState } from 'react';
import './page.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Alterado aqui
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      console.log("User logged in:", data.userJogos);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleClick = () => {
    navigate("/register");
  };

  return (
    <div className='app01'>
      <div className='centered-form'>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
          />
          <button type="submit">Confirmar</button>
          <button onClick={handleClick} type="button">Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;

