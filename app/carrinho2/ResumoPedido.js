import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const ResumoPedido = () => {
  const navigate = useNavigate();
  const [jogosCompletos, setJogosCompletos] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("userLoggedIn"));
  const formaPagamento = localStorage.getItem("formaPagamento");
  const codigoPix = localStorage.getItem("codigoPix");
  const cartao = JSON.parse(localStorage.getItem("dadosCartao"));
  const enderecoSelecionado = localStorage.getItem("enderecoSelecionado");

  // Pegamos cart uma vez só aqui
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  console.log("Cart do localStorage:", cart);

  useEffect(() => {
    async function completarDadosCarrinho() {
      const temDadosCompletos = cart.every(jogo => jogo.title && jogo.price !== undefined);

      if (temDadosCompletos) {
        setJogosCompletos(cart);
        setLoading(false);
        console.log("Carrinho já completo:", cart);
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
        console.log("Carrinho completado com fetch:", jogosComDados);
      } catch (error) {
        console.error("Erro ao buscar dados dos jogos:", error);
        setJogosCompletos(cart);
        setLoading(false);
      }
    }

    completarDadosCarrinho();
  // <-- Aqui o array de dependências está vazio para executar só uma vez no mount
  }, []);

  const copiarCodigoPix = () => {
    navigator.clipboard.writeText(codigoPix).then(() => {
      alert("Código Pix copiado!");
    });
  };

  const finalizarPedido = async () => {
    const pedido = {
      frete: 0,
      enderecoEntrega: enderecoSelecionado,
      formaPagamento,
      itens: jogosCompletos,
      userId: user.id
    };

    try {
      const response = await fetch(`http://localhost:8080/pedidos`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });

      alert(response.ok ? "Pedido cadastrado!" : "Erro ao cadastrar pedido.");
      if (response.ok) navigate("/");
    } catch {
      alert("Erro ao cadastrar pedido.");
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
              {jogo.title || "Título indisponível"} - R${jogo.price ? jogo.price.toFixed(2) : "0.00"} x {jogo.quantity} = R${jogo.price && jogo.quantity ? (jogo.price * jogo.quantity).toFixed(2) : "0.00"}
            </li>
          ))}
        </ul>

        <h3>Forma de Pagamento: {formaPagamento?.toUpperCase()}</h3>

        {formaPagamento === 'pix' && (
          <div className="pix-info">
            <p><strong>Código Pix:</strong> {codigoPix}</p>
            <button onClick={copiarCodigoPix}>Copiar código Pix</button>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${codigoPix}`}
              alt="QR Code Pix"
            />
          </div>
        )}

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
