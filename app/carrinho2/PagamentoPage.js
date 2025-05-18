import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const PagamentoPage = () => {
  const [formaPagamento, setFormaPagamento] = useState('');
  const [cartao, setCartao] = useState({
    numero: '',
    codigo: '',
    nome: '',
    vencimento: '',
    parcelas: ''
  });

  const user = JSON.parse(localStorage.getItem("userLoggedIn"));
  const enderecoSelecionado = localStorage.getItem("enderecoSelecionado");
  const navigate = useNavigate();

  const cart = []; // Idealmente recuperar do localStorage ou contexto

  const handleCartaoChange = (e) => {
    setCartao({ ...cartao, [e.target.name]: e.target.value });
  };

  const isCartaoValido = () => {
    return Object.values(cartao).every(value => value.trim());
  };

  const handleFinalize = async () => {
    const pedido = {
      frete: 0,
      enderecoEntrega: enderecoSelecionado,
      formaPagamento,
      itens: cart.map(game => ({
        gameId: game.gameId,
        quantity: game.quantity
      })),
      userId: user.id
    };

    try {
      const response = await fetch(`http://localhost:8080/pedidos`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });

      alert(response.ok ? "Pedido cadastrado!" : "Erro ao cadastrar pedido.");
      if (response.ok) navigate("/"); // Redirecionar após sucesso
    } catch {
      alert("Erro ao cadastrar pedido.");
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <h2>Forma de Pagamento</h2>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              value="pix"
              checked={formaPagamento === 'pix'}
              onChange={(e) => setFormaPagamento(e.target.value)}
            />
            Pix
          </label>
          <label>
            <input
              type="radio"
              value="boleto"
              checked={formaPagamento === 'boleto'}
              onChange={(e) => setFormaPagamento(e.target.value)}
            />
            Boleto
          </label>
          <label>
            <input
              type="radio"
              value="cartao"
              checked={formaPagamento === 'cartao'}
              onChange={(e) => setFormaPagamento(e.target.value)}
            />
            Cartão de Crédito
          </label>
        </div>

        {formaPagamento === 'cartao' && (
          <div className="card-fields">
            <input name="numero" placeholder="Número do Cartão" onChange={handleCartaoChange} />
            <input name="codigo" placeholder="CVV" onChange={handleCartaoChange} />
            <input name="nome" placeholder="Nome Completo" onChange={handleCartaoChange} />
            <input name="vencimento" type="month" onChange={handleCartaoChange} />
            <input name="parcelas" type="number" placeholder="Parcelas" onChange={handleCartaoChange} min="1" max="12" />
          </div>
        )}

        <button
          className="action-button"
          onClick={handleFinalize}
          disabled={!formaPagamento || (formaPagamento === 'cartao' && !isCartaoValido())}
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
};

export default PagamentoPage;
