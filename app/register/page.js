'use client'
import { useState } from 'react';
import './page.css';
import Link from 'next/link';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [genero, setgenero] = useState('');
  const [dataNascimento, setdataNascimento] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');

  const handleCepBlur = async () => {
    if (cep.length === 8) {
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

    if (!username || !email || !password || !confirmPassword || !genero || !dataNascimento ||
        !cep || !logradouro || !numero || !bairro || !cidade || !uf) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    const nameParts = username.trim().split(' ');
    if (nameParts.length < 2) {
      alert("O nome de usuário deve ser composto por pelo menos dois nomes.");
      return;
    }

    const userData = {
      username,
      email,
      password,
      genero,
      dataNascimento,
      enderecoFaturamento: {
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        uf
      }
    };

    console.log("User data for registration:", userData);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("User registered:", data);

      // Armazena os dados no localStorage COM a senha
      localStorage.setItem("user", JSON.stringify(data));

      console.log("User registered with SUCCESS:", data);
      alert("Register ok");
      window.location.href ="/login";
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const btnLogin = () => {
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className='app02'>
      <h1>Cadastro</h1>
      <div className='centered-form'>
        <form onSubmit={handleRegister}>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nome Completo"
          />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            id="password1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
          />
          <input
            id="password2"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar Senha"
          />
          <select 
            id="genderSelect"
            value={genero}
            onChange={(e) => setgenero(e.target.value)}
            placeholder="Gênero"
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
              marginTop: '10px',
              marginBottom: '10px'
            }}
          >
            <option value="">Gênero</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="prefiro não dizer">Prefiro não dizer</option>
            <option value="outro">Outro</option>
          </select>
          <input
            id="date"
            type="date"
            value={dataNascimento}
            onChange={(e) => setdataNascimento(e.target.value)}
            placeholder="Data de Nascimento"
            max={getCurrentDate()}
          />
          <input
            id="cep"
            type="text"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            onBlur={handleCepBlur}
            placeholder="CEP"
          />
          <input
            id=""
            type="text"
            value={logradouro}
            onChange={(e) => setLogradouro(e.target.value)}
            placeholder="Logradouro"
          />
          <input
            id="numero"
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Número"
          />
          <input
            id=""
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Bairro"
          />
          <input
            id=""
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade"
          />
          <input
            id=""
            type="text"
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            placeholder="UF"
          />
          <button id="registerSubmitButton" type="submit">Confirmar</button>
          <Link href="/login">
            <button  id="loginAcesso" type="button">Login</button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
