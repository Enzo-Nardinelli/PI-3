'use client';

import { useState, useEffect } from 'react';

function EditPedido() {
  const [pedidos, setPedidos] = useState([]);
  const [user, setUser] = useState(null);
  const [id, setId] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userLoggedIn"));
    if (storedUser && id == null) {
      setUser(storedUser);
      if (storedUser.isEstoquista) {
        loadUsersAndPedidos();  // Only load pedidos if the user is an "Estoquista"
      } else {
        loadPedidos(storedUser.id);  // Load only the logged-in user's pedidos
      }
    } else {
      loadPedidos(id);
    }
  }, [id]);

  // Fetch all users' IDs and their pedidos (for Estoquista users only)
  const loadUsersAndPedidos = async () => {
    try {
      const usersResponse = await fetch('http://localhost:8080/users/');
      if (!usersResponse.ok) {
        console.error("Erro ao carregar usuários:", usersResponse.status);
        return;
      }
      const usersData = await usersResponse.json();
      setUsers(usersData);

      // Map over users to get their pedidos
      const pedidosData = await Promise.all(usersData.map(user => fetchPedidosByUserId(user.id)));
      const allPedidos = pedidosData.flat(); // Flatten the array to have all pedidos in one list
      const pedidosOrdenados = allPedidos.sort((a, b) => new Date(b.data) - new Date(a.data));
      setPedidos(pedidosOrdenados);
    } catch (error) {
      console.error("Erro ao carregar pedidos e usuários:", error);
    }
  };

  const fetchPedidosByUserId = async (userId) => {
      if (!userId) return [];
      try {
        const response = await fetch(`http://localhost:8080/pedidos/usuario/${userId}`);
        if (!response.ok) {
          console.error(`Erro ao carregar pedidos do usuário ${userId}:`, response.status);
          return [];
        }
        return await response.json();
      } catch (error) {
        console.error(`Erro ao carregar pedidos do usuário ${userId}:`, error);
        return [];
      }
    };

  // Fetch pedidos by user ID (for a specific user or logged-in user)
  const loadPedidos = async (userId) => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:8080/pedidos/usuario/${userId}`);
      if (!response.ok) {
        console.error(`Erro ao carregar pedidos do usuário ${userId}:`, response.status);
        return;
      }
      const pedidosData = await response.json();
      setPedidos(pedidosData);
    } catch (error) {
      console.error(`Erro ao carregar pedidos do usuário ${userId}:`, error);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "Data não disponível";
    const data = new Date(dataString);
    return data.toLocaleString("pt-BR");
  };

  const handleStatusUpdate = async (pedidoId, novoStatus) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;

    const pedidoAtualizado = { ...pedido, status: novoStatus };

    try {
      const response = await fetch(`http://localhost:8080/pedidos/update/${pedidoId}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoAtualizado)
      });

      if (response.ok) {
        const pedidosAtualizados = pedidos.map(p =>
          p.id === pedidoId ? { ...p, status: novoStatus } : p
        );
        setPedidos(pedidosAtualizados);
        console.log(`Status atualizado para "${novoStatus}"`);
      } else {
        console.error("Erro ao atualizar status:", response.status);
      }
    } catch (error) {
      console.error("Erro ao enviar atualização:", error);
    }
  };

  const statusOptions = [
    "Aguardando Pagamento",
    "Pagamento Rejeitado",
    "Pagamento com Sucesso",
    "Aguardando Retirada",
    "Em Trânsito",
    "Entregue"
  ];

  const handleChange = (event) => {
    setId(event.target.value);
  };

  const handleClick = () => {
    loadPedidos(id);
  };

  return (
    <div>
      <h2>Pedidos do Usuário</h2>
      {/* Only display the input for Estoquista */}
      {user?.isEstoquista && (
        <div>
          <input
            type="text"
            value={id}
            onChange={handleChange}
            placeholder="Entre com o ID do usuário"
          />
          <button onClick={handleClick}>Enviar</button>
        </div>
      )}

      {/* Conditionally render pedidos list */}
      {pedidos.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <ul>
          {pedidos.map((pedido) => (
            <li key={pedido.id}>
              <p><strong>ID do Pedido:</strong> {pedido.id}</p>
              <p><strong>Frete:</strong> R$ {pedido.frete?.toFixed(2)}</p>
              <p><strong>Total:</strong> R$ {pedido.total?.toFixed(2)}</p>
              <p><strong>Status:</strong> {pedido.status}</p>
              <p><strong>Data:</strong> {formatarData(pedido.data)}</p>
              <p><strong>Endereço de Entrega:</strong> {pedido.enderecoEntrega}</p>
              <p><strong>Forma de Pagamento:</strong> {pedido.formaPagamento}</p>
              <p><strong>Itens:</strong></p>
              <ul>
                {pedido.itens?.map((game, index) =>
                  typeof game === 'object' ? (
                    <li key={index}>{game.title} - R$ {game.price?.toFixed(2)}</li>
                  ) : (
                    <li key={index}>{game}</li>
                  )
                )}
              </ul>

              {/* Only show "Alterar Status" buttons if the user is an Estoquista */}
              {user?.isEstoquista && (
                <div style={{ marginTop: '10px' }}>
                  <p><strong>Atualizar Status:</strong></p>
                  {statusOptions.map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(pedido.id, status)}
                      style={{
                        margin: '3px',
                        padding: '5px 10px',
                        cursor: 'pointer'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EditPedido;




