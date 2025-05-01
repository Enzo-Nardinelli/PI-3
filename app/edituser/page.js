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

  const enderecoInicial = {
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
  };
  const [novoEnderecoEntrega, setNovoEnderecoEntrega] = useState(enderecoInicial);

  useEffect(() => {
    const storedUser = localStorage.getItem("userLoggedIn");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleNovoEnderecoChange = (e) => {
    const { name, value } = e.target;
    setNovoEnderecoEntrega((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdicionarEnderecoEntrega = () => {
    if (!novoEnderecoEntrega.cep || !novoEnderecoEntrega.logradouro || !novoEnderecoEntrega.numero) {
      alert("Preencha todos os campos obrigatórios (CEP, Logradouro, Número).");
      return;
    }

    const novoUsuario = {
      ...user,
      enderecosEntrega: [...(user.enderecosEntrega || []), novoEnderecoEntrega]
    };

    setUser(novoUsuario);
    localStorage.setItem("userLoggedIn", JSON.stringify(novoUsuario));
    console.log("Novo endereço adicionado:", novoEnderecoEntrega);

    setNovoEnderecoEntrega(enderecoInicial);
    setMostrarNovoEndereco(false);
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (novaSenha && novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    const updatedUser = {
      username: user.username,
      email: user.email,
      genero: user.genero,
      dataNascimento: user.dataNascimento,
      password: novaSenha || user.password, // Se novaSenha não for fornecida, mantém a senha atual
      enderecoFaturamento: { ...user.enderecoFaturamento },
      enderecosEntrega: user.enderecosEntrega || []
    };

    const id = user.id;
    if (!id) {
      console.error('ID do usuário não encontrado');
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
        delete updatedLocalUser.password;

        localStorage.setItem('userLoggedIn', JSON.stringify(updatedLocalUser));
        setUser(updatedLocalUser);
        setIsEditing(false);
        setNovaSenha('');
        setConfirmarSenha('');
        console.log("Usuário atualizado com sucesso:", updatedLocalUser);
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

  const fetchCepInfo = async (cep, callback) => {
    if (cep && cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          callback(data);
        } else {
          alert("CEP não encontrado!");
        }
      } catch (error) {
        alert("Erro ao buscar o CEP.");
        console.error("Erro:", error);
      }
    }
  };

  const handleCepBlur = () => {
    const cep = user?.enderecoFaturamento?.cep;
    fetchCepInfo(cep, (data) => {
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
    });
  };

  const handleNovoEnderecoCepBlur = () => {
    fetchCepInfo(novoEnderecoEntrega.cep, (data) => {
      setNovoEnderecoEntrega((prev) => ({
        ...prev,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf
      }));
    });
  };

  // Função para formatar a data no formato DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Usuário não encontrado</div>;

  return (
    <div className='app01'>
      <div className='centered-form'>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label>Nome: </label>
            {isEditing ? (
              <input type="text" name="nome" value={user.username || ""} onChange={handleChange} />
            ) : (
              <span>{user.username || "Não disponível"}</span>
            )}
          </div>

          <div>
            <label>Email: </label>
            {isEditing ? (
              <input type="email" name="email" value={user.email || ""} onChange={handleChange} />
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
                style={{
                  marginTop: '5px',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  width: '100%',
                }}
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
              <input type="date" name="dataNascimento" value={user.dataNascimento || ""} onChange={handleChange} />
            ) : (
              <span>{formatDate(user.dataNascimento)}</span>
            )}
          </div>

          <div>
            <label>Endereço de Faturamento: </label>
            {isEditing ? (
              <>
                <input name="cep" placeholder="CEP" value={user.enderecoFaturamento?.cep || ""} onChange={handleChange} onBlur={handleCepBlur} />
                <input name="logradouro" placeholder="Logradouro" value={user.enderecoFaturamento?.logradouro || ""} onChange={handleChange} />
                <input name="numero" placeholder="Número" value={user.enderecoFaturamento?.numero || ""} onChange={handleChange} />
                <input name="bairro" placeholder="Bairro" value={user.enderecoFaturamento?.bairro || ""} onChange={handleChange} />
                <input name="cidade" placeholder="Cidade" value={user.enderecoFaturamento?.cidade || ""} onChange={handleChange} />
                <input name="uf" placeholder="UF" value={user.enderecoFaturamento?.uf || ""} onChange={handleChange} />
              </>
            ) : (
              <span>
                {user.enderecoFaturamento?.logradouro}, {user.enderecoFaturamento?.numero}, {user.enderecoFaturamento?.bairro}, {user.enderecoFaturamento?.cidade}, {user.enderecoFaturamento?.uf}
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
          </div>

          {isEditing && (
            <>
              <div>
                <button type="button" onClick={() => setMostrarNovoEndereco(true)}>Adicionar Novo Endereço de Entrega</button>
              </div>

              {mostrarNovoEndereco && (
                <div>
                  <h3>Adicionar Novo Endereço de Entrega</h3>
                  <input name="cep" placeholder="CEP" value={novoEnderecoEntrega.cep} onChange={handleNovoEnderecoChange} onBlur={handleNovoEnderecoCepBlur} />
                  <input name="logradouro" placeholder="Logradouro" value={novoEnderecoEntrega.logradouro} onChange={handleNovoEnderecoChange} />
                  <input name="numero" placeholder="Número" value={novoEnderecoEntrega.numero} onChange={handleNovoEnderecoChange} />
                  <input name="bairro" placeholder="Bairro" value={novoEnderecoEntrega.bairro} onChange={handleNovoEnderecoChange} />
                  <input name="cidade" placeholder="Cidade" value={novoEnderecoEntrega.cidade} onChange={handleNovoEnderecoChange} />
                  <input name="uf" placeholder="UF" value={novoEnderecoEntrega.uf} onChange={handleNovoEnderecoChange} />
                  <button type="button" onClick={handleAdicionarEnderecoEntrega}>Salvar Endereço</button>
                </div>
              )}

              <div>
                <label>Nova Senha: </label>
                <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
              </div>
              <div>
                <label>Confirmar Nova Senha: </label>
                <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
              </div>
              <button type="button" onClick={handleSave}>Salvar</button>
            </>
          )}
        </form>

        {!isEditing && (
          <div>
            <button onClick={handleEdit}>Editar</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditUser;
