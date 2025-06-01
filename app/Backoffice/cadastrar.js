import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/backofficecadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: email, password: senha })
      });

      const msg = await response.text();

      if (response.ok) {
        setMensagem(`Sucesso:`);
        navigate("/backofficelogin");
      } else {
        setMensagem(`Erro:`);
      }

    } catch (err) {
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
      <p>
        Já tem conta? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;

