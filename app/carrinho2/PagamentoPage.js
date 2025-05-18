import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const PagamentoPage = () => {
  const [formaPagamento, setFormaPagamento] = useState('');
  const [codigoPix, setCodigoPix] = useState('');
  const [cartao, setCartao] = useState({
    numero: '',
    codigo: '',
    nome: '',
    vencimento: '',
    parcelas: ''
  });

  const user = JSON.parse(localStorage.getItem("userLoggedIn"));
  const enderecoSelecionado = localStorage.getItem("enderecoSelecionado");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const navigate = useNavigate();

  const handleCartaoChange = (e) => {
    setCartao({ ...cartao, [e.target.name]: e.target.value });
  };

  const isCartaoValido = () => {
    return Object.values(cartao).every(value => value.trim());
  };

  const gerarCodigoPix = () => {
    const random = Math.random().toString(36).substring(2, 12).toUpperCase();
    setCodigoPix(`PIX-${random}`);
  };

  const handlePixSelecionado = () => {
    setFormaPagamento('pix');
    gerarCodigoPix();
  };

  const copiarCodigoPix = () => {
    navigator.clipboard.writeText(codigoPix).then(() => {
      alert('Código Pix copiado!');
    });
  };

  const handleResumo = () => {
    localStorage.setItem("formaPagamento", formaPagamento);
    localStorage.setItem("cart", JSON.stringify(cart)); // Salva o carrinho novamente por segurança
    if (formaPagamento === "pix") {
      localStorage.setItem("codigoPix", codigoPix);
    }
    if (formaPagamento === "cartao") {
      localStorage.setItem("dadosCartao", JSON.stringify(cartao));
    }
    navigate("/resumo");
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <h2>Forma de Pagamento</h2>
        <div className="payment-options-vertical">
          <label>
            <input
              type="radio"
              value="pix"
              checked={formaPagamento === 'pix'}
              onChange={handlePixSelecionado}
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
          onClick={handleResumo}
          disabled={!formaPagamento || (formaPagamento === 'cartao' && !isCartaoValido())}
        >
          Resumo do Pedido
        </button>
      </div>
    </div>
  );
};

export default PagamentoPage;
