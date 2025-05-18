import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const ResumoPedido = () => {
  const navigate = useNavigate();
  const [jogosCompletos, setJogosCompletos] = useState([]);
  const [loading, setLoading] = useState(true); 

  const user = JSON.parse(localStorage.getItem("userLoggedIn"));
  const formaPagamento = localStorage.getItem("formaPagamento");
  const cartao = JSON.parse(localStorage.getItem("dadosCartao"));
  const enderecoSelecionado = localStorage.getItem("enderecoSelecionado");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  useEffect(() => {
    async function completarDadosCarrinho() {
      const temDadosCompletos = cart.every(jogo => jogo.title && jogo.price !== undefined);

      if (temDadosCompletos) {
        setJogosCompletos(cart);
        setLoading(false);
        return;
      }

      try {
        const jogosComDados = await Promise.all(
          cart.map(async ({ gameId, quantity }) => {
            const response = await fetch(`http://localhost:8080/api/games/${gameId}`);
            const game = await response.json();
            return { ...game, quantity };
          })
        );
        setJogosCompletos(jogosComDados);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados dos jogos:", error);
        setJogosCompletos(cart);
        setLoading(false);
      }
    }

    completarDadosCarrinho();
  }, []);

  const frete = 20;
  const subtotal = jogosCompletos.reduce((acc, jogo) => acc + (jogo.price * jogo.quantity), 0);
  const total = subtotal + frete;
  const finalizarPedido = async () => {
    const pedido = {
      frete,
      enderecoEntrega:JSON.stringify(enderecoSelecionado),
      formaPagamento,
      itens: jogosCompletos,
      userId: user.id,
      total: total,
      data: new Date().toISOString()
    };
    console.log(pedido);
    try {
      const response = await fetch(`http://localhost:8080/pedidos`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });

      alert(response.ok ? "Pedido cadastrado!" : "Erro ao cadastrar pedido.");
      if (response.ok) clearCart();
      if (response.ok) navigate("/");
    } catch {
      alert("Erro ao cadastrar pedido.");
    }
  };

  const clearCart = () => {
    const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));
    const temporaryUser = JSON.parse(localStorage.getItem("temporaryUser"));
  
    if (userLoggedIn) {
      fetch(`http://localhost:8080/users/${userLoggedIn.email}/carrinho`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]), // zera o carrinho
      })
        .then((res) => res.json())
        .then((updatedUser) => {
          console.log("Carrinho limpo:", updatedUser);
          setCart([]);
        })
        .catch((err) => console.error("Erro ao limpar carrinho:", err));
    } else {
      temporaryUser.userCarrinho = [];
      localStorage.setItem("temporaryUser", JSON.stringify(temporaryUser));
      setCart([]);
    }
  };

  if (loading) return <div>Carregando resumo do pedido...</div>;

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <h2>Resumo do Pedido</h2>

        <h3>Jogos Selecionados:</h3>
        <ul>
          {jogosCompletos.map((jogo) => (
            <li key={jogo.gameId || jogo.id}>
              {jogo.title || "Título indisponível"} - R${jogo.price?.toFixed(2)} x {jogo.quantity} = R${(jogo.price * jogo.quantity).toFixed(2)}
            </li>
          ))}
        </ul>

        <h3>Resumo de Valores:</h3>
        <ul>
          <li>Subtotal: R${subtotal.toFixed(2)}</li>
          <li>Frete: R${frete.toFixed(2)}</li>
          <li><strong>Total: R${total.toFixed(2)}</strong></li>
        </ul>

        <h3>Forma de Pagamento: {formaPagamento?.toUpperCase()}</h3>

        {formaPagamento === 'cartao' && cartao && (
          <div className="new-address-form">
            <h3>Informações do Cartão</h3>
            <div className="card-summary">
              <p><strong>Número:</strong> {cartao.numero}</p>
              <p><strong>CVV:</strong> {cartao.codigo}</p>
              <p><strong>Nome:</strong> {cartao.nome}</p>
              <p><strong>Vencimento:</strong> {cartao.vencimento}</p>
              <p><strong>Parcelas:</strong> {cartao.parcelas}x</p>
            </div>
          </div>
        )}

        <button className="action-button" onClick={finalizarPedido}>
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
};

export default ResumoPedido;
