'use client'
import { useState } from 'react';
import './page.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');  // Novo estado para o email
  const [password, setPassword] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const navigate = useNavigate();

  // Função para validar o CEP
  const handleCepBlur = async () => {
    if (cep.length === 8) {  // Verifica se o CEP tem 8 caracteres
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setLogradouro(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setUf(data.uf);
        } else {
          alert("CEP não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        alert("Erro ao buscar o CEP.");
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = {
      username,
      email,  // Incluindo o email
      password,
      enderecoFaturamento: {
        cep,
        logradouro,
        bairro,
        cidade,
        uf
      }
    };

    console.log(userData);  // Aqui você pode ver os dados do usuário, incluindo o endereço e email

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("User registered:", data);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const btnLogin = () => {
    navigate("/login");
  }

  return (
    <div className='app02'>
      <h1>Cadastro</h1>
      <div className='centered-form'>
        <form onSubmit={handleRegister}>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username" 
          />
          <input 
            type="email"  // Mudança aqui: tipo de input para email
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email"  // Placeholder para o email
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
          />
          
          {/* Campos de Endereço */}
          <input 
            type="text" 
            value={cep} 
            onChange={(e) => setCep(e.target.value)} 
            onBlur={handleCepBlur} 
            placeholder="CEP" 
          />
          <input 
            type="text" 
            value={logradouro} 
            onChange={(e) => setLogradouro(e.target.value)} 
            placeholder="Logradouro" 
          />
          <input 
            type="text" 
            value={bairro} 
            onChange={(e) => setBairro(e.target.value)} 
            placeholder="Bairro" 
          />
          <input 
            type="text" 
            value={cidade} 
            onChange={(e) => setCidade(e.target.value)} 
            placeholder="Cidade" 
          />
          <input 
            type="text" 
            value={uf} 
            onChange={(e) => setUf(e.target.value)} 
            placeholder="UF" 
          />
          
          <button type="submit">Confirmar</button>
          <button onClick={btnLogin}>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Register;

