'use client'
import { useState, useEffect } from 'react';
import './page.css'; // Seu CSS

function EditUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Estado para o carregamento

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

  return (
    <div className='app01'>
      <div className='centered-form'>
        <form>
          <div>
            <label>Nome: </label>
            <span>{user.username || "Não disponível"}</span>
          </div>
          <div>
            <label>Email: </label>
            <span>{user.email}</span>
          </div>
          <div>
            <label>Gênero: </label>
            <span>{user.genero}</span>
          </div>
          <div>
            <label>Data de Nascimento: </label>
            <span>{user.dataNascimento}</span>
          </div>
          <div>
            <label>Endereço de Faturamento: </label>
            <span>{`${user.enderecoFaturamento.logradouro}, ${user.enderecoFaturamento.numero}, ${user.enderecoFaturamento.bairro}, ${user.enderecoFaturamento.cidade}, ${user.enderecoFaturamento.uf}`}</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
