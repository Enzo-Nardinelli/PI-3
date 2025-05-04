import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the user from localStorage and set it to state
    const temporaryUser = JSON.parse(localStorage.getItem("temporaryUser"));
    const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));
  
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
    }
  };

  if (!user) {
    return <div>Please log in to view and manage your cart.</div>;
  }

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

      {cart.length > 0 && (
        <div>
          <button onClick={handleFinalizePurchase}>Finalize Purchase</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;

