import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const [enderecoSelecionado, setEnderecoSelecionado] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [cartao, setCartao] = useState({
    numero: '',
    codigo: '',
    nome: '',
    vencimento: '',
    parcelas: ''
  });
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userLoggedIn"));
  const cart = []; // Idealmente recuperar o carrinho aqui

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
    } catch {
      alert("Erro ao cadastrar pedido.");
    }
  };

  return (
    <div>
      <h2>Endereço de Entrega</h2>
      <select value={enderecoSelecionado} onChange={(e) => setEnderecoSelecionado(e.target.value)}>
        <option value="">Selecione</option>
        {user?.enderecosEntrega?.map((end, i) => (
          <option key={i} value={end.cep}>
            {`${end.logradouro}, ${end.numero} - ${end.bairro}, ${end.cidade}/${end.uf}`}
          </option>
        ))}
      </select>

      <h2>Forma de Pagamento</h2>
      <label>
        <input type="radio" value="boleto" checked={formaPagamento === 'boleto'} onChange={(e) => setFormaPagamento(e.target.value)} />
        Boleto
      </label>
      <label>
        <input type="radio" value="cartao" checked={formaPagamento === 'cartao'} onChange={(e) => setFormaPagamento(e.target.value)} />
        Cartão de Crédito
      </label>

      {formaPagamento === 'cartao' && (
        <div>
          <input name="numero" placeholder="Número do Cartão" onChange={handleCartaoChange} />
          <input name="codigo" placeholder="CVV" onChange={handleCartaoChange} />
          <input name="nome" placeholder="Nome Completo" onChange={handleCartaoChange} />
          <input name="vencimento" type="month" onChange={handleCartaoChange} />
          <input name="parcelas" type="number" placeholder="Parcelas" onChange={handleCartaoChange} min="1" max="12" />
        </div>
      )}

      <button onClick={handleFinalize} disabled={!enderecoSelecionado || (formaPagamento === 'cartao' && !isCartaoValido())}>
        Finalizar Pedido
      </button>
    </div>
  );
};

export default CheckoutPage;
