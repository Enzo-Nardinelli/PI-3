import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/backofficelogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: email, password: senha })
      });

      if (response.ok) {
        const result = await response.text();
        setMensagem(`Sucesso: `);
        navigate("/backofficeprincipal");
      } else {
        const error = await response.text();
        setMensagem(`Erro: `);
      }
    } catch (err) {
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
      <p>
        Não tem conta? <Link to="/backofficecadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}

export default LoginPage;

