'use client'
import { useState } from 'react';
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
        body: JSON.stringify({ email, password }), // Envia email e senha
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // Verifique se a resposta está no formato correto
      if (data.user) {
        // Armazenando as informações do usuário no localStorage
        localStorage.setItem("userLoggedIn", JSON.stringify(data.user));
        console.log("User logged in:", data.user);  // Exibe os dados do usuário no console

        // Verifique se os dados estão sendo armazenados corretamente
        const userFromStorage = JSON.parse(localStorage.getItem("userLoggedIn"));
        console.log("User stored in localStorage:", userFromStorage); // Mostra os dados armazenados no localStorage
      } else {
        console.error("Invalid user data:", data);
      }

      navigate("/");  // Redireciona para a página inicial após o login
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
