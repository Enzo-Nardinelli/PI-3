import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [cart, setCart] = useState([]);
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [enderecos, setEnderecos] = useState('');
  const [endereco, setEdendereco] = useState('');
  const [enderecoOk, setEdenderecoOk] = useState('');
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

  

  useEffect(() => {
    // Retrieve the user from localStorage and set it to state
    const temporaryUser = JSON.parse(localStorage.getItem("temporaryUser"));
    const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));
    setEnderecos(userLoggedIn.enderecosEntrega);
    setEdendereco(userLoggedIn.enderecoFaturamento);
    setEdenderecoOk(false);

  
    if (userLoggedIn) {
      const getCarrinho = async () => {
        try {
          const response = await fetch(`http://localhost:8080/users/${userLoggedIn.email}/carrinho/retorno`);
          if (response.ok) {
            const carrinho = await response.json();
            setCart(Array.isArray(carrinho) ? carrinho : []);
          } else {
            console.error("Erro ao buscar carrinho do usuário.");
            setCart([]);
          }
        } catch (err) {
          console.error("Erro na requisição do carrinho:", err);
          setCart([]);
        }
      };
  
      getCarrinho(); // ← chamada da função ao carregar
  
      setUser(userLoggedIn); // Set the user from localStorage
    } else if (!temporaryUser && !userLoggedIn) {
      const temporaryUser = {
        userCarrinho: []
      };
      localStorage.setItem("temporaryUser", JSON.stringify(temporaryUser));
      setUser(temporaryUser);
      setCart(temporaryUser.userCarrinho);
    } else if (temporaryUser && !userLoggedIn) {
      setUser(temporaryUser);
      setCart(temporaryUser.userCarrinho);
    }
  }, []);
  

  useEffect(() => {
    // console.log("Cart updated:", cart);
  }, [cart]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const fetchedGames = await Promise.all(
          cart.map(async (id) => {
            const response = await fetch(`http://localhost:8080/api/games/${id}`);
            return response.ok ? response.json() : null;
          })
        );
        setGames(fetchedGames.filter((g) => g !== null));
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    if (Array.isArray(cart) && cart.length > 0) {
      fetchGames();
    }
  }, [cart]);

  const handleAddToCart = async (gameId) => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:8080/users/${user.id}/carrinho/add`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gameId),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        const updatedCart = updatedUser.userCarrinho;
        setCart(Array.isArray(updatedCart) ? updatedCart : []);
      } else {
        console.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding game to cart:", error);
    }
  };

  const handleCepBlur = async () => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setLogradouro(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setUf(data.uf);
        } else {
          alert("CEP não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        alert("Erro ao buscar o CEP.");
      }
    }
  };

  const handleRemoveFromCart = async (gameId) => {
    const temporaryUser = JSON.parse(localStorage.getItem("temporaryUser"));
    const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));

    if (!userLoggedIn) {
      const newCarrinho = temporaryUser.userCarrinho.filter((id) => id !== gameId);
      temporaryUser.userCarrinho = newCarrinho;
      localStorage.setItem("temporaryUser", JSON.stringify(temporaryUser));
      setCart(newCarrinho);
    } else {
      try {
        const response = await fetch(`http://localhost:8080/users/${userLoggedIn.email}/carrinho/remove`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gameId),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          const updatedCart = updatedUser.carrinho;
          console.log("Uptdated cart", updatedCart);
          setCart(Array.isArray(updatedCart) ? updatedCart : []);
        } else {
          console.error("Failed to remove from cart");
        }
      } catch (error) {
        console.error("Error removing game from cart:", error);
      }
    }
  };

  const handleFinalizePurchase = async () => {

    const temporaryUser = JSON.parse(localStorage.getItem("temporaryUser"));
    const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));

    if(userLoggedIn){

      const frete = 0;
      const itens = userLoggedIn.carrinho;
      const userId = userLoggedIn.id;
      const enderecoEntrega = enderecoSelecionado;
      
      const pedido = {
          frete,
          enderecoEntrega,
          formaPagamento,
          itens,
          userId
      }
      console.log("AAAAAAAA");
      try{
        const response = await fetch(`http://localhost:8080/pedidos`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pedido)
        });
        if (response.ok){
          alert("Pedido cadastrado!")
        }
      } catch {
        alert("Pedido não foi cadastrado!")
        return;
      }
  
  

      try {
        const response = await fetch(`http://localhost:8080/users/${userLoggedIn.email}/carrinho/finalizar`, {
          method: "PUT",
        });
  
        if (response.ok) {
          const updatedUser = await response.json();
          setCart([]);
  
          userLoggedIn.jogos = updatedUser.jogos;
          userLoggedIn.carrinho = updatedUser.carrinho;
          localStorage.setItem("userLoggedIn", JSON.stringify(userLoggedIn));
  
          console.log("Purchase finalized", updatedUser);
        } else {
          console.error("Failed to finalize purchase");
        }
      } catch (error) {
        console.error("Error finalizing purchase:", error);
      }
    } 
    else {
      navigate("/login");
      return;
    }

  };

  const handleNovoEndereco = async (e) => {
    e.preventDefault();

    if (!cep || !logradouro || !numero || !bairro || !cidade || !uf) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novoEndereco = {
      cep,
      logradouro,
      numero,
      bairro,
      cidade,
      uf  
    }

    setEnderecos((prev) => [...prev, novoEndereco]);

    user.enderecosEntrega = enderecos;
    console.log(user);
    localStorage.setItem("userLoggedIn", JSON.stringify(user));

    try {
      const response = await fetch(`http://localhost:8080/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        
      } else {
        throw new Error('Erro ao atualizar o usuário');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }

  };

    const handleChange = (e) => {
      setEnderecoSelecionado(e.target.value);
      setEdenderecoOk(true);
    }

  if (!user) {
    return <div>Please log in to view and manage your cart.</div>;
  }

  const handleFormaPagamentoChange = (e) => {
    setFormaPagamento(e.target.value);
  };

  const handleCartaoChange = (e) => {
    setCartao({ ...cartao, [e.target.name]: e.target.value });
  };

  const isCartaoValido = () => {
    return (
      cartao.numero.trim() &&
      cartao.codigo.trim() &&
      cartao.nome.trim() &&
      cartao.vencimento.trim() &&
      cartao.parcelas.trim()
    );
  };

  const podeValidar = () => {
    if (formaPagamento === 'boleto') return true;
    if (formaPagamento === 'cartao' && isCartaoValido()) return true;
    return false;
  };

  const handleValidar = () => {
    alert('Pedido validado com sucesso!');
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      <h2>Welcome, {user.username}!</h2>
      <h3>Numero de itens: {cart.length}</h3>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              {game.title} 
              <button onClick={() => handleRemoveFromCart(game.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <div>
      <label htmlFor="endereco">Escolha o endereço de entrega:</label>
      <select id="endereco" value={enderecoSelecionado} onChange={handleChange}>
      <option value="">--Please choose an option--</option>
      {enderecos.map((endereco, index) => (
       <option key={index} value={endereco.cep}>
      {`${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}/${endereco.uf}`}
    </option>
  ))}
</select>

    </div>
      <div className=''>
        <h3>Novo endereço:</h3>
      <div className=''>
      <form onSubmit={handleNovoEndereco}>
          <input
            type="text"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            onBlur={handleCepBlur}
            placeholder="CEP"
          />
          <input
            type="text"
            value={logradouro}
            onChange={(e) => setLogradouro(e.target.value)}
            placeholder="Logradouro"
          />
          <input
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Número"
          />
          <input
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Bairro"
          />
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade"
          />
          <input
            type="text"
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            placeholder="UF"
          />
          <button type="submit">Confirmar</button>
        </form>
      </div>
      <div>
      {enderecoOk &&  
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
        <h2>Forma de Pagamento</h2>
  
        <label>
          <input
            type="radio"
            value="boleto"
            checked={formaPagamento === 'boleto'}
            onChange={handleFormaPagamentoChange}
          />
          Boleto
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="cartao"
            checked={formaPagamento === 'cartao'}
            onChange={handleFormaPagamentoChange}
          />
          Cartão de Crédito
        </label>
  
        {formaPagamento === 'cartao' && (
          <div style={{ marginTop: '15px' }}>
            <input
              type="text"
              name="numero"
              placeholder="Número do cartão"
              value={cartao.numero}
              onChange={handleCartaoChange}
            />
            <br />
            <input
              type="text"
              name="codigo"
              placeholder="Código verificador"
              value={cartao.codigo}
              onChange={handleCartaoChange}
            />
            <br />
            <input
              type="text"
              name="nome"
              placeholder="Nome completo"
              value={cartao.nome}
              onChange={handleCartaoChange}
            />
            <br />
            <input
              type="month"
              name="vencimento"
              placeholder="Data de vencimento"
              value={cartao.vencimento}
              onChange={handleCartaoChange}
            />
            <br />
            <input
              type="number"
              name="parcelas"
              placeholder="Quantidade de parcelas"
              value={cartao.parcelas}
              onChange={handleCartaoChange}
              min="1"
              max="12"
            />
          </div>
        )}
  
        <button
          onClick={handleValidar}
          disabled={!podeValidar()}
          style={{ marginTop: '20px' }}
        >
          Validar pedido final
        </button>
      </div>
      }
    </div>
    </div>
      {cart.length > 0 && (
        <div>
          <button onClick={handleFinalizePurchase}>Finalize Purchase</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;

