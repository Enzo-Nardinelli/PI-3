'use client';

import { useState, useEffect } from 'react';
import './page.css';

function EditUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarNovoEndereco, setMostrarNovoEndereco] = useState(false);
  const [novoEnderecoEntrega, setNovoEnderecoEntrega] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("userLoggedIn");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Usuário não encontrado</div>;

  const handleNovoEnderecoChange = (e) => {
    const { name, value } = e.target;
    setNovoEnderecoEntrega((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdicionarEnderecoEntrega = () => {
    if (!novoEnderecoEntrega.cep) {
      alert("Preencha o CEP.");
      return;
    }

    console.log("Endereço a ser adicionado:", novoEnderecoEntrega);

    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        enderecosEntrega: [...(prevUser.enderecosEntrega || []), novoEnderecoEntrega]
      };
      console.log("Usuário após adicionar o endereço:", updatedUser);
      return updatedUser;
    });

    setNovoEnderecoEntrega({
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: ""
    });

    setMostrarNovoEndereco(false);
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (novaSenha && novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    console.log("Dados antes da edição:", user);

    const updatedUser = {
      username: user.username,
      email: user.email,
      genero: user.genero,
      dataNascimento: user.dataNascimento,
      password: novaSenha || user.password,
      enderecoFaturamento: { ...user.enderecoFaturamento },
      enderecosEntrega: user.enderecosEntrega || []
    };

    console.log("Dados a serem atualizados:", updatedUser);

    const id = user.id;
    if (!id) {
      console.error('Usuário não encontrado');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const updatedLocalUser = { ...user, ...updatedUser };
        localStorage.setItem('userLoggedIn', JSON.stringify(updatedLocalUser));
        setUser(updatedLocalUser);
        console.log("Usuário atualizado com sucesso:", updatedLocalUser);
        setIsEditing(false);
      } else {
        throw new Error('Erro ao atualizar o usuário');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["cep", "logradouro", "numero", "bairro", "cidade", "uf"].includes(name)) {
      setUser((prev) => ({
        ...prev,
        enderecoFaturamento: {
          ...prev.enderecoFaturamento,
          [name]: value
        }
      }));
    } else if (name === "nome") {
      setUser((prev) => ({ ...prev, username: value }));
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCepBlur = async () => {
    const cep = user.enderecoFaturamento.cep;
    if (cep && cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setUser((prev) => ({
            ...prev,
            enderecoFaturamento: {
              ...prev.enderecoFaturamento,
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf
            }
          }));
        } else {
          alert("CEP não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        alert("Erro ao buscar o CEP.");
      }
    }
  };

  const handleNovoEnderecoCepBlur = async () => {
    const cep = novoEnderecoEntrega.cep;
    if (cep && cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setNovoEnderecoEntrega((prev) => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf
          }));
        } else {
          alert("CEP não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        alert("Erro ao buscar o CEP.");
      }
    }
  };

  return (
    <div className='app01'>
      <div className='centered-form'>
        <form>
          <div>
            <label>Nome: </label>
            {isEditing ? (
              <input
                type="text"
                name="nome"
                value={user.username || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{user.username || "Não disponível"}</span>
            )}
          </div>

          <div>
            <label>Email: </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={user.email || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{user.email}</span>
            )}
          </div>

          <div>
            <label>Gênero: </label><br />
            {isEditing ? (
              <select
                name="genero"
                value={user.genero || ""}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
                <option value="Prefiro não dizer">Prefiro não dizer</option>
              </select>
            ) : (
              <span>{user.genero}</span>
            )}
          </div>

          <div>
            <label>Data de Nascimento: </label>
            {isEditing ? (
              <input
                type="date"
                name="dataNascimento"
                value={user.dataNascimento || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{user.dataNascimento}</span>
            )}
          </div>

          <div>
            <label>Endereço Faturamento: </label>
            {isEditing ? (
              <div>
                <input type="text" name="cep" placeholder="CEP" value={user.enderecoFaturamento.cep || ""} onChange={handleChange} onBlur={handleCepBlur} />
                <input type="text" name="logradouro" value={user.enderecoFaturamento.logradouro || ""} onChange={handleChange} />
                <input type="text" name="numero" value={user.enderecoFaturamento.numero || ""} onChange={handleChange} />
                <input type="text" name="bairro" value={user.enderecoFaturamento.bairro || ""} onChange={handleChange} />
                <input type="text" name="cidade" value={user.enderecoFaturamento.cidade || ""} onChange={handleChange} />
                <input type="text" name="uf" value={user.enderecoFaturamento.uf || ""} onChange={handleChange} />
              </div>
            ) : (
              <span>
                {user.enderecoFaturamento.logradouro}, {user.enderecoFaturamento.numero}, {user.enderecoFaturamento.bairro}, {user.enderecoFaturamento.cidade}, {user.enderecoFaturamento.uf}
              </span>
            )}
          </div>

          <div>
            <label>Endereços de Entrega:</label>
            {user.enderecosEntrega?.length > 0 ? (
              <ul>
                {user.enderecosEntrega.map((endereco, index) => (
                  <li key={index}>
                    {endereco.logradouro}, {endereco.numero}, {endereco.bairro}, {endereco.cidade}, {endereco.uf}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum endereço de entrega cadastrado.</p>
            )}

            {!mostrarNovoEndereco && (
              <button type="button" onClick={() => setMostrarNovoEndereco(true)}>
                Adicionar Endereço de Entrega
              </button>
            )}

            {mostrarNovoEndereco && (
              <div>
                <h4>Novo Endereço de Entrega</h4>
                <input type="text" name="cep" placeholder="CEP" value={novoEnderecoEntrega.cep} onChange={handleNovoEnderecoChange} onBlur={handleNovoEnderecoCepBlur} />
                <input type="text" name="logradouro" placeholder="Logradouro" value={novoEnderecoEntrega.logradouro} onChange={handleNovoEnderecoChange} />
                <input type="text" name="numero" placeholder="Número" value={novoEnderecoEntrega.numero} onChange={handleNovoEnderecoChange} />
                <input type="text" name="bairro" placeholder="Bairro" value={novoEnderecoEntrega.bairro} onChange={handleNovoEnderecoChange} />
                <input type="text" name="cidade" placeholder="Cidade" value={novoEnderecoEntrega.cidade} onChange={handleNovoEnderecoChange} />
                <input type="text" name="uf" placeholder="UF" value={novoEnderecoEntrega.uf} onChange={handleNovoEnderecoChange} />
                <button type="button" onClick={handleAdicionarEnderecoEntrega}>Salvar Endereço</button>
              </div>
            )}
          </div>

          {isEditing && (
            <>
              <div>
                <label>Nova Senha: </label>
                <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
              </div>
              <div>
                <label>Confirmar Nova Senha: </label>
                <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
              </div>
            </>
          )}

          {!isEditing ? (
            <button type="button" onClick={handleEdit}>Editar</button>
          ) : (
            <button type="button" onClick={handleSave}>Salvar</button>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditUser;
