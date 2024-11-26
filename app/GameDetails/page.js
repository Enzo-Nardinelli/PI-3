// GameDetails.js
'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './gamedetail.css' ;

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/games/${id}`);
        if (response.ok) {
          const data = await response.json();
          setGame(data);
        } else {
          console.error("Failed to fetch game");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchGame();
  }, [id]);

  if (!game) return <p>Loading...</p>;

  return (
    <div className='game-detail-Detail'>
      <h2 className='game-title-Detail'>{game.title}</h2>
      <img src={game.imgURL} alt={`${game.title} cover`} />
      <p className='game-genre-Detail'>Genre: {game.genre}</p>
      <p className='game-description-Detail'>Description: {game.description}</p>
      <p className='game-price-Detail'>Price: ${game.price}</p>
      <button className="buy-button">Buy</button>
    </div>
  );
}

export default GameDetails;
