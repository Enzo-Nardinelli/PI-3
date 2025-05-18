'use client';

import { useState, useEffect } from 'react';

function EditPedido() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    const storedUser = JSON.parse(localStorage.getItem("userLoggedIn"));
    if (!storedUser || !storedUser.id) return;

    try {
      const response = await fetch(`http://localhost:8080/pedidos/usuario/${storedUser.id}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.error("Erro ao carregar pedidos:", response.status);
        return;
      }

      const data = await response.json();

      // 🔽 Ordena por data decrescente
      const pedidosOrdenados = data.sort((a, b) => new Date(b.data) - new Date(a.data));

      setPedidos(pedidosOrdenados);
      console.log("Pedidos carregados e ordenados:", pedidosOrdenados);
    } catch (error) {
      console.log("Pedido não foi carregado!");
      console.error(error);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "Data não disponível";
    const data = new Date(dataString);
    return data.toLocaleString("pt-BR");
  };

  return (
    <div>
      <h2>Pedidos do Usuário</h2>
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
                {pedido.itens && pedido.itens.map((game, index) => (
                  typeof game === 'object' ? (
                    <li key={index}>
                      {game.title} - R$ {game.price?.toFixed(2)}
                    </li>
                  ) : (
                    <li key={index}>{game}</li>
                  )
                ))}
              </ul>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EditPedido;


