'use client';
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
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log(data);

      if (data.user) {
        const userWithPassword = { ...data.user, password }; // Adiciona a senha manualmente
        const temporaryUser = JSON.parse(localStorage.getItem("temporaryUser"));
        userWithPassword.carrinho = userWithPassword.carrinho.concat(temporaryUser.userCarrinho);
        localStorage.setItem("userLoggedIn", JSON.stringify(userWithPassword));
        console.log("User logged in:", userWithPassword);

        for(let jogo of userWithPassword.carrinho){
          try {
            const response = await fetch(`http://localhost:8080/users/${JSON.stringify(userWithPassword.email)}/carrinho/add`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(jogo), // Send the game ID to add it to the user's cart
            });
        
            if (response.ok) {
              console.log("Game added to cart in the backend.");
              navigate("/carrinho2"); // Navigate to the cart page
            } else {
              console.error("Failed to add game to cart in the backend.");
            }
          } catch (error) {
            console.error("Error updating the cart:", error);
          }
        }
        
        navigate("/");  // Redireciona para a página inicial após o login
      } else {
        console.error("Invalid user data:", data);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleClick = () => {
    navigate("/register"); // Redireciona para a página de registro
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
