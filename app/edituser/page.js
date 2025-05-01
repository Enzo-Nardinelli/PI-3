'use client'
import { useState, useEffect } from 'react';
import './page.css';

function EditUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem("userLoggedIn");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <div>Usuário não encontrado</div>;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    console.log('Dados antes da edição:', user);

    if (novaSenha && novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    const updatedUser = {
      username: user.username,
      email: user.email,
      genero: user.genero,
      dataNascimento: user.dataNascimento,
      password: novaSenha ? novaSenha : user.password,
      enderecoFaturamento: {
        cep: user.enderecoFaturamento.cep,
        logradouro: user.enderecoFaturamento.logradouro,
        numero: user.enderecoFaturamento.numero,
        bairro: user.enderecoFaturamento.bairro,
        cidade: user.enderecoFaturamento.cidade,
        uf: user.enderecoFaturamento.uf
      }
    };

    const id = user.id;

    if (!id) {
      console.error('Usuário não encontrado');
      return;
    }

    console.log('ID do usuário que estamos tentando editar:', id);
    console.log('Dados que estamos tentando salvar:', updatedUser);

    try {
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const updatedLocalUser = { ...user, ...updatedUser };
        localStorage.setItem('userLoggedIn', JSON.stringify(updatedLocalUser));
        console.log('Usuário atualizado com sucesso');
        setUser(updatedLocalUser);
        setIsEditing(false);

        const updatedLocalStorageUser = JSON.parse(localStorage.getItem('userLoggedIn'));
        console.log('Dados do usuário no localStorage após atualização:', updatedLocalStorageUser);
      } else {
        throw new Error('Erro ao atualizar o usuário');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cep" || name === "logradouro" || name === "numero" || name === "bairro" || name === "cidade" || name === "uf") {
      setUser((prevUser) => ({
        ...prevUser,
        enderecoFaturamento: {
          ...prevUser.enderecoFaturamento,
          [name]: value
        }
      }));
    } else if (name === "nome") {
      setUser((prevUser) => ({
        ...prevUser,
        username: value
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value
      }));
    }
  };

  const handleCepBlur = async () => {
    const cep = user.enderecoFaturamento.cep;
    if (cep && cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setUser((prevUser) => ({
            ...prevUser,
            enderecoFaturamento: {
              ...prevUser.enderecoFaturamento,
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
                  style={{
                    marginTop: '5px',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    width: '100%'
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
                <input
                  type="text"
                  name="logradouro"
                  value={user.enderecoFaturamento.logradouro || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="numero"
                  value={user.enderecoFaturamento.numero || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="bairro"
                  value={user.enderecoFaturamento.bairro || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="cidade"
                  value={user.enderecoFaturamento.cidade || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="uf"
                  value={user.enderecoFaturamento.uf || ""}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <span>
                {user.enderecoFaturamento.logradouro}, {user.enderecoFaturamento.numero}, {user.enderecoFaturamento.bairro}, {user.enderecoFaturamento.cidade}, {user.enderecoFaturamento.uf}
              </span>
            )}
          </div>


          {/* Campos de senha ao editar */}
          {isEditing && (
            <>
              <div>
                <label>Nova Senha: </label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </div>
              <div>
                <label>Confirmar Nova Senha: </label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
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
