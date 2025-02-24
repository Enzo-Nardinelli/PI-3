import React, { useEffect, useState } from "react";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/users") // Faz a requisição para o backend
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Erro ao buscar usuários:", error));
  }, []);

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              <strong>Nome:</strong> {user.username} <br />
            </li>
          ))
        ) : (
          <p>Carregando usuários...</p>
        )}
      </ul>
    </div>
  );
};

export default UsersList;
