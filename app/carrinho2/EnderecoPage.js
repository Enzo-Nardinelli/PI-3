import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const EnderecoPage = () => {
  const [enderecoSelecionado, setEnderecoSelecionado] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userLoggedIn"));

  const handleContinuar = () => {
    localStorage.setItem("enderecoSelecionado", enderecoSelecionado);
    navigate("/pagamento");
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <h2>Endereço de Entrega</h2>
        <select
          className="address-select"
          value={enderecoSelecionado}
          onChange={(e) => setEnderecoSelecionado(e.target.value)}
        >
          <option value="">Selecione</option>
          {user?.enderecosEntrega?.map((end, i) => (
            <option key={i} value={end.cep}>
              {`${end.logradouro}, ${end.numero} - ${end.bairro}, ${end.cidade}/${end.uf}`}
            </option>
          ))}
        </select>

        <button
          className="action-button"
          onClick={handleContinuar}
          disabled={!enderecoSelecionado}
        >
          Continuar para Pagamento
        </button>
      </div>
    </div>
  );
};

export default EnderecoPage;
