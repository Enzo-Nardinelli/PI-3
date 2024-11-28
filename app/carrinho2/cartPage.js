import React, { useEffect, useState } from "react";

const CartPage = () => {
  const [user, setUser] = useState(null); // Store the logged-in user
  const [games, setGames] = useState([]); // Store games in the cart
  const [cart, setCart] = useState([]); // Store the cart game IDs

  useEffect(() => {
    // Retrieve the user from localStorage and set it to state
    const userStorage = JSON.parse(localStorage.getItem("user"));
    if (userStorage) {
      setUser(userStorage); // Set the user from localStorage
    }

    // Get the user's cart from the localStorage (or API if needed)
    const userCarrinho = JSON.parse(userStorage?.userCarrinho || "[]");
    setCart(userCarrinho); // Set the user's cart
  }, []);

  useEffect(() => {
    // Fetch games based on the cart items (game IDs)
    const fetchGames = async () => {
      try {
        const fetchedGames = await Promise.all(
          cart.map(async (id) => {
            const response = await fetch(`http://localhost:8080/api/games/${id}`);
            if (response.ok) {
              return response.json();
            } else {
              console.error(`Failed to fetch game with ID: ${id}`);
              return null;
            }
          })
        );

        // Filter out any null values for failed fetches
        setGames(fetchedGames.filter((game) => game !== null));
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [cart]); // Fetch games whenever the cart changes

  // Handle adding a game to the cart
  const handleAddToCart = async (gameId) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/users/${user.id}/carrinho/add`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameId),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setCart(updatedUser.userCarrinho); // Update the cart after adding the game
      } else {
        console.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding game to cart:", error);
    }
  };

  // Handle removing a game from the cart
  const handleRemoveFromCart = async (gameId) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/users/${user.id}/carrinho/remove`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameId),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setCart(updatedUser.userCarrinho); // Update the cart after removing the game
      } else {
        console.error("Failed to remove from cart");
      }
    } catch (error) {
      console.error("Error removing game from cart:", error);
    }
  };

  // Handle finalizing the purchase
  const handleFinalizePurchase = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/users/${user.id}/carrinho/finalizar`, {
        method: "PUT",
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setCart([]); // Clear the cart after finalizing the purchase
        console.log("Purchase finalized", updatedUser);
      } else {
        console.error("Failed to finalize purchase");
      }
    } catch (error) {
      console.error("Error finalizing purchase:", error);
    }
  };

  if (!user) {
    return <div>Please log in to view and manage your cart.</div>;
  }

  return (
    <div>
      <h1>Shopping Cart</h1>
      <h2>Welcome, {user.username}!</h2>

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
