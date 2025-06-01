import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [cart, setCart] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const temporaryUser = JSON.parse(localStorage.getItem("temporaryUser"));
    const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));

    if (userLoggedIn) {
      setUser(userLoggedIn);
      const getCarrinho = async () => {
        try {
          const response = await fetch(`http://localhost:8080/users/${userLoggedIn.email}/carrinho/retorno`);
          const userCarrinho = response.ok ? await response.json() : [];
          setCart(Array.isArray(userCarrinho) ? userCarrinho : []);
        } catch (err) {
          console.error("Erro ao buscar carrinho:", err);
        }
      };
      getCarrinho();
    } else {
      const tempUser = temporaryUser || { userCarrinho: [] };
      setUser(tempUser);
      setCart(tempUser.userCarrinho || []);
    }
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gameCounts = cart.reduce((acc, id) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {});

        const uniqueIds = Object.keys(gameCounts);
        const fetchedGames = await Promise.all(
          uniqueIds.map(async (id) => {
            const response = await fetch(`http://localhost:8080/api/games/${id}`);
            const data = response.ok ? await response.json() : null;
            return data ? { ...data, quantity: gameCounts[id] } : null;
          })
        );

        setGames(fetchedGames.filter(Boolean));
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      }
    };

    if (Array.isArray(cart) && cart.length > 0) {
      fetchGames();
    } else {
      setGames([]);
    }
  }, [cart]);

  const updateCart = (newCart) => {
    const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));
    const temporaryUser = JSON.parse(localStorage.getItem("temporaryUser"));

    if (userLoggedIn) {
      fetch(`http://localhost:8080/users/${userLoggedIn.email}/carrinho`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCart),
      })
        .then((res) => res.json())
        .then((updatedUser) => {
          setCart(updatedUser.userCarrinho || []);
        })
        .catch((err) => console.error("Erro ao atualizar carrinho:", err));
    } else {
      temporaryUser.userCarrinho = newCart;
      localStorage.setItem("temporaryUser", JSON.stringify(temporaryUser));
      setCart(newCart);
    }
  };

  const handleAddQuantity = (gameId) => {
    const updatedCart = [...cart, gameId];
    updateCart(updatedCart);
  };

  const handleRemoveQuantity = async (gameId) => {
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
          const updatedCart = updatedUser.userCarrinho;
          setCart(Array.isArray(updatedCart) ? updatedCart : []);
        } else {
          console.error("Failed to remove from cart");
        }
      } catch (error) {
        console.error("Error removing game from cart:", error);
      }
    }
  };

  const handleRemoveAll = (gameId) => {
    const updatedCart = cart.filter((id) => id !== gameId);
    updateCart(updatedCart);
  };

  const calculateSubtotal = (price, quantity) => {
    return price * quantity;
  };

  const calculateTotal = () => {
    const subtotal = games.reduce((acc, game) => acc + calculateSubtotal(game.price, game.quantity), 0);
    return subtotal + shippingFee;
  };

  if (!user) return (
    <div className="cart-container">
      <div className="cart-content">Please log in to view your cart.</div>
    </div>
  );

  return (
    <div className="cart-container">
      <div className="cart-content">
        <h1>Cart</h1>
        <h2>Welcome, {user.username || 'Guest'}!</h2>
        {games.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty.</p>
        ) : (
          <ul className="cart-list">
            {games.map((game) => (
              <li key={game.id} className="cart-item">
                <div className="game-info">
                  <span>{game.title}</span>
                  <span>Price: R${game.price.toFixed(2)}</span>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => handleRemoveQuantity(game.id)}>-</button>
                  <span>{game.quantity}</span>
                  <button onClick={() => handleAddQuantity(game.id)}>+</button>
                  <button onClick={() => handleRemoveAll(game.id)} className="remove-all-button">Remove All</button>
                </div>
                <div className="subtotal">
                  Subtotal do produto: R${calculateSubtotal(game.price, game.quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        )}
        {games.length > 0 && (
          <div className="total-container">
            <div className="shipping-select">
              <label htmlFor="shipping">Escolha o frete: </label>
              <select
                id="shipping"
                onChange={(e) => setShippingFee(Number(e.target.value))}
                defaultValue={0}
              >
                <option value={0} disabled>Selecione uma opção</option>
                <option value={10}>Correios - R$10,00</option>
                <option value={15}>Sedex - R$15,00</option>
                <option value={20}>Fedex - R$20,00</option>
              </select>
            </div>

            <div className="shipping-fee">
              Frete selecionado: R${shippingFee.toFixed(2)}
            </div>
            <div className="total">
              Valor total do pedido: R${calculateTotal().toFixed(2)}
            </div>
            <button
              className="checkout-button"
              onClick={() => {
                const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));
                if (!userLoggedIn) {
                  alert("Você precisa estar logado para finalizar a compra.");
                  navigate("/login"); // Redireciona para a página de login
                  return;
                }

                localStorage.setItem("cart", JSON.stringify(games));
                localStorage.setItem("shippingFee", shippingFee);
                console.log("Todos os dados dos jogos salvos no localStorage:", games);
                navigate("/endereco");
              }}
              disabled={shippingFee === 0 || games.length === 0}
            >
              Proceed to Checkout
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
