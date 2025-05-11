import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './CartPage.css'; // Importa o CSS estilizado

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
        const fetchedGames = await Promise.all(
          cart.map(async (id) => {
            const response = await fetch(`http://localhost:8080/api/games/${id}`);
            return response.ok ? response.json() : null;
          })
        );
        setGames(fetchedGames.filter(Boolean));
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      }
    };

    if (Array.isArray(cart) && cart.length > 0) {
      fetchGames();
    }
  }, [cart]);

  const handleRemoveFromCart = async (gameId) => {
    const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));
    const temporaryUser = JSON.parse(localStorage.getItem("temporaryUser"));

    if (!userLoggedIn) {
      const updated = temporaryUser.userCarrinho.filter((id) => id !== gameId);
      temporaryUser.userCarrinho = updated;
      localStorage.setItem("temporaryUser", JSON.stringify(temporaryUser));
      setCart(updated);
    } else {
      try {
        const response = await fetch(`http://localhost:8080/users/${userLoggedIn.email}/carrinho/remove`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gameId),
        });
        if (response.ok) {
          const updatedUser = await response.json();
          setCart(updatedUser.carrinho || []);
        }
      } catch (error) {
        console.error("Erro ao remover jogo:", error);
      }
    }
  };

  if (!user) return <div className="cart-container"><div className="cart-content">Please log in to view your cart.</div></div>;

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
              <li key={game.id}>
                {game.title}
                <button onClick={() => handleRemoveFromCart(game.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
        {games.length > 0 && (
          <button className="checkout-button" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default CartPage;
