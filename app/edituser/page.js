'use client'
import { useState, useEffect } from 'react';
import './page.css'; // Seu CSS

function EditUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Estado para o carregamento
  const [isEditing, setIsEditing] = useState(false);  // Estado para controlar se está editando ou não

  useEffect(() => {
    // Verifica se há dados de usuário no localStorage
    const storedUser = localStorage.getItem("userLoggedIn");
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Converte os dados de volta para um objeto
    }
    setLoading(false);  // Define o estado de carregamento como false após carregar os dados
  }, []);

  if (loading) {
    return <div>Carregando...</div>;  // Exibe um texto de carregamento até os dados serem carregados
  }

  if (!user) {
    return <div>Usuário não encontrado</div>;  // Exibe um erro caso não haja dados no localStorage
  }

  const handleEdit = () => {
    setIsEditing(true);  // Permite a edição
  };

  const handleSave = async () => {
    // Exibe no console as diferenças antes de salvar
    console.log('Dados antes da edição:', user);

    const updatedUser = {
      nome: user.username,
      email: user.email,  // Esse é o e-mail que foi alterado
      genero: user.genero,
      dataNascimento: user.dataNascimento,
      enderecoFaturamento: user.enderecoFaturamento,
    };

    const id = user.id; // Pegando o id diretamente do user

    if (!id) {
      console.error('Usuário não encontrado');
      return;
    }

    console.log('ID do usuário que estamos tentando editar:', id);  // Loga o ID do usuário
    console.log('Dados que estamos tentando salvar:', updatedUser); // Loga os dados que você está tentando salvar

    try {
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        // Atualiza o usuário no localStorage
        localStorage.setItem('userLoggedIn', JSON.stringify(updatedUser));  // Certifique-se de que o localStorage tenha os dados mais recentes

        console.log('Usuário atualizado com sucesso');
        setIsEditing(false); // Desativa o modo de edição após salvar

        // Printando o localStorage após a atualização
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
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,  // Atualiza o campo que foi alterado
    }));
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
            <label>Gênero: </label>
            {isEditing ? (
              <input
                type="text"
                name="genero"
                value={user.genero || ""}
                onChange={handleChange}
              />
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
            <label>Endereço de Faturamento: </label>
            {isEditing ? (
              <input
                type="text"
                name="enderecoFaturamento"
                value={user.enderecoFaturamento.logradouro || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{`${user.enderecoFaturamento.logradouro}, ${user.enderecoFaturamento.numero}, ${user.enderecoFaturamento.bairro}, ${user.enderecoFaturamento.cidade}, ${user.enderecoFaturamento.uf}`}</span>
            )}
          </div>

          {/* Botões Editar e Salvar */}
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
