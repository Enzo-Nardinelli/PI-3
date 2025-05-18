import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const EnderecoPage = () => {
  const [enderecoSelecionado, setEnderecoSelecionado] = useState("");
  const [mostrarNovoEndereco, setMostrarNovoEndereco] = useState(false);
  const [novoEnderecoEntrega, setNovoEnderecoEntrega] = useState({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
  });

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userLoggedIn");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleContinuar = () => {
    if (enderecoSelecionado === "") return;

    const endereco = user.enderecosEntrega[enderecoSelecionado];
    localStorage.setItem("enderecoSelecionado", JSON.stringify(endereco));
    navigate("/pagamento");
  };

  const handleNovoEnderecoChange = (e) => {
    const { name, value } = e.target;

    // Apenas números no CEP (opcional)
    if (name === "cep") {
      const onlyNums = value.replace(/\D/g, "");
      setNovoEnderecoEntrega((prev) => ({ ...prev, [name]: onlyNums }));
    } else {
      setNovoEnderecoEntrega((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchCepInfo = async (cep) => {
    if (cep && cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setNovoEnderecoEntrega((prev) => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
          }));
        } else {
          alert("CEP não encontrado!");
        }
      } catch (error) {
        alert("Erro ao buscar o CEP.");
        console.error("Erro:", error);
      }
    }
  };

  const handleNovoEnderecoCepBlur = () => {
    fetchCepInfo(novoEnderecoEntrega.cep);
  };

  const handleAdicionarEnderecoEntrega = () => {
    if (
      !novoEnderecoEntrega.cep ||
      !novoEnderecoEntrega.logradouro ||
      !novoEnderecoEntrega.numero
    ) {
      alert("Preencha todos os campos obrigatórios (CEP, Logradouro, Número).");
      return;
    }

    const novoUsuario = {
      ...user,
      enderecosEntrega: [...(user.enderecosEntrega || []), novoEnderecoEntrega],
    };

    setUser(novoUsuario);
    localStorage.setItem("userLoggedIn", JSON.stringify(novoUsuario));

    setNovoEnderecoEntrega({
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
    });
    setMostrarNovoEndereco(false);
    setEnderecoSelecionado(""); // limpa seleção
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
            <option key={i} value={i}>
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

        <button
          className="action-button"
          onClick={() => setMostrarNovoEndereco(true)}
          style={{ marginTop: "15px", backgroundColor: "#007bff" }}
          disabled={mostrarNovoEndereco}
        >
          Adicionar Novo Endereço
        </button>

        {mostrarNovoEndereco && (
          <div className="new-address-form">
            <h3>Adicionar Novo Endereço</h3>
            <input
              name="cep"
              placeholder="CEP"
              value={novoEnderecoEntrega.cep}
              onChange={handleNovoEnderecoChange}
              onBlur={handleNovoEnderecoCepBlur}
              maxLength={8}
            />
            <input
              name="logradouro"
              placeholder="Logradouro"
              value={novoEnderecoEntrega.logradouro}
              onChange={handleNovoEnderecoChange}
            />
            <input
              name="numero"
              placeholder="Número"
              value={novoEnderecoEntrega.numero}
              onChange={handleNovoEnderecoChange}
            />
            <input
              name="bairro"
              placeholder="Bairro"
              value={novoEnderecoEntrega.bairro}
              onChange={handleNovoEnderecoChange}
            />
            <input
              name="complemento"
              placeholder="Complemento"
              value={novoEnderecoEntrega.complemento}
              onChange={handleNovoEnderecoChange}
            />
            <input
              name="cidade"
              placeholder="Cidade"
              value={novoEnderecoEntrega.cidade}
              onChange={handleNovoEnderecoChange}
            />
            <input
              name="uf"
              placeholder="UF"
              maxLength={2}
              value={novoEnderecoEntrega.uf}
              onChange={handleNovoEnderecoChange}
            />

            <button onClick={handleAdicionarEnderecoEntrega}>
              Salvar Endereço
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnderecoPage;
