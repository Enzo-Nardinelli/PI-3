'use client'
import { useState } from 'react';
import './page.css';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();  // Substituindo o useRouter por useNavigate

  // Função para validar o CEP
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

    // Verifica se todos os campos foram preenchidos
    if (!username || !email || !password || !confirmPassword || !genero || !dataNascimento ||
        !cep || !logradouro || !numero || !bairro || !cidade || !uf) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Verifica se as senhas são iguais
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    // Valida se o nome contém pelo menos dois nomes
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

    console.log("User data for registration:", userData);  // Manter a exibição no console

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("User registered:", data);  // Exibe no console após a resposta da API

      // Armazena os dados no localStorage sem a senha
      const { password, ...userWithoutPassword } = data;
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));

      // Mostrar no console que o registro foi bem-sucedido
      console.log("User registered with SUCCESS:", userWithoutPassword);

      navigate("/login");  // Redireciona para o login após o cadastro
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const btnLogin = () => {
    navigate("/login");  // Usando navigate para redirecionar para o login
  };

  // Função para obter a data atual no formato "YYYY-MM-DD"
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
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nome Completo"
          />
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
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar Senha"
          />
          <select
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
            type="date"
            value={dataNascimento}
            onChange={(e) => setdataNascimento(e.target.value)}
            placeholder="Data de Nascimento"
            max={getCurrentDate()}
          />
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
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Número"
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
