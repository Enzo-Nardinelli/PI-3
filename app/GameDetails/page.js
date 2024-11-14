// GameDetails.js
'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
    <div className='game-detail'>
      <h2 className='game-title'>{game.title}</h2>
      <p className='game-genre'>Genre: {game.genre}</p>
      <p className='game-description'>Description: {game.description}</p>
      <p className='game-price'>Price: ${game.price}</p>
    </div>
  );
}

export default GameDetails;
