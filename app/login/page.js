'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

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

      if (data.user) {
        const userWithPassword = { ...data.user, password };
        localStorage.setItem("userLoggedIn", JSON.stringify(userWithPassword));
        console.log("User logged in:", userWithPassword);

        const userFromStorage = JSON.parse(localStorage.getItem("userLoggedIn"));
        console.log("User stored in localStorage:", userFromStorage);
      } else {
        console.error("Invalid user data:", data);
      }

      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleClick = () => {
    router.push("/register");
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
