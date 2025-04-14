'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './gamedetail.css';
import { useNavigate } from 'react-router-dom';
import ImageGallery from './ImageGallery';

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/games/${id}`);
        if (response.ok) {
          const data = await response.json();
          setGame(data);
        } else {
          setError("Failed to fetch game details");
          console.error("Failed to fetch game");
        }
      } catch (error) {
        setError("Error connecting to server");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!game) return <div className="error-message">Game not found</div>;

  // Prepare images for the gallery
  const prepareGameImages = () => {
    if (!game.imgURL) return [];
    
    // If imgURL is a string, convert to array with single item
    if (typeof game.imgURL === 'string') {
      return [game.imgURL];
    }
    
    // If imgURL is already an array, return it
    if (Array.isArray(game.imgURL)) {
      return game.imgURL;
    }
    
    return [];
  };

  const gameImages = prepareGameImages();

  const handleClick = async () => {
    try {
      const userStorage = JSON.parse(localStorage.getItem("user"));
      if (!userStorage) {
        alert("Please log in to add items to cart");
        navigate("/login");
        return;
      }
      
      const userCarrinho = JSON.parse(userStorage.userCarrinho || "[]");
      userCarrinho.push(game.id);
      userStorage.userCarrinho = JSON.stringify(userCarrinho);
      localStorage.setItem("user", JSON.stringify(userStorage));
      
      const response = await fetch(`http://localhost:8080/users/${userStorage.userId}/carrinho/add`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(game.id),
      });
  
      if (response.ok) {
        console.log("Game added to cart in the backend.");
        // Only navigate to one location - fixed the double navigation issue
        navigate("/carrinho");
      } else {
        console.error("Failed to add game to cart in the backend.");
        alert("Failed to add game to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error updating the cart:", error);
      alert("Error updating your cart. Please try again.");
    }
  };

  return (
    <div className="game-details">
      <h1 className="game-title">{game.title}</h1>
      
      {/* Using the ImageGallery component */}
      <ImageGallery images={gameImages} />
      
      <div className="game-info">
        <p className="game-genre"><strong>Genre:</strong> {game.genre}</p>
        <p className="game-description"><strong>Description:</strong> {game.description}</p>
        <p className="game-price"><strong>Price:</strong> ${game.price.toFixed(2)}</p>
        
        <button className="buy-button" onClick={handleClick}>
          Buy
        </button>
      </div>
    </div>
  );
}

export default GameDetails;