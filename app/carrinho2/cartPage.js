import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const temporaryUser = JSON.parse(localStorage.getItem("temporaryUser"));
    const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));

    if (userLoggedIn) {
      setUser(userLoggedIn);
      const getCarrinho = async () => {
        try {
          const response = await fetch(`http://localhost:8080/users/${userLoggedIn.email}/carrinho/retorno`);
          const carrinho = response.ok ? await response.json() : [];
          setCart(Array.isArray(carrinho) ? carrinho : []);
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
        console.log(fetchedGames);
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
          console.log("Carrinho atualizado:", updatedUser);
          setCart(updatedUser.carrinho || []);
        })
        .catch((err) => console.error("Erro ao atualizar carrinho:", err));
    } else {
      temporaryUser.userCarrinho = newCart;
      localStorage.setItem("temporaryUser", JSON.stringify(temporaryUser));
      setCart(newCart);
    }
  };

  const handleAddQuantity = async (gameId) => {
    const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));
  
    if (userLoggedIn) {
      try {
        const response = await fetch(`http://localhost:8080/users/${userLoggedIn.email}/carrinho/add`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gameId),
        });
  
        if (response.ok) {
          const updatedUser = await response.json();
          const updatedCart = updatedUser.carrinho;
          setCart(Array.isArray(updatedCart) ? updatedCart : []);
        } else {
          console.error("Erro ao adicionar item ao carrinho.");
        }
      } catch (err) {
        console.error("Erro ao adicionar quantidade:", err);
      }
    } else {
      // Usuário temporário
      const temporaryUser = JSON.parse(localStorage.getItem("temporaryUser")) || { userCarrinho: [] };
      const newCart = [...cart, gameId];
      temporaryUser.userCarrinho = newCart;
      localStorage.setItem("temporaryUser", JSON.stringify(temporaryUser));
      setCart(newCart);
    }
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

  const handleRemoveAll = (gameId) => {
    console.log(`Tentando remover todos os itens com o ID: ${gameId}`);

    const updatedCart = cart.filter((id) => id !== gameId); // Remove todos os jogos com o ID específico
    console.log("Carrinho atualizado após remover todos os jogos com esse ID:", updatedCart);

    updateCart(updatedCart);
  };

  const calculateSubtotal = (price, quantity) => {
    return price * quantity;
  };

  const calculateTotal = () => {
    const subtotal = games.reduce((acc, game) => acc + calculateSubtotal(game.price, game.quantity), 0);
    const shippingFee = 20; // Frete fixo de R$20
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
            <div className="shipping-fee">
              Frete fixo: R$20,00
            </div>
            <div className="total">
              Valor total do pedido: R${calculateTotal().toFixed(2)}
            </div>
            <button className="checkout-button" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
