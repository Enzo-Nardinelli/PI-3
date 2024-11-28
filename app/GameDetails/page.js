// GameDetails.js
'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './gamedetail.css' ;
import { useNavigate } from 'react-router-dom';

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const navigate = useNavigate();

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

  const handleClick = () => {
    const userStorage = JSON.parse(localStorage.getItem("user"));
      //const userJogos = JSON.parse(userStorage.userJogos);
      const userCarrinho = JSON.parse(userStorage.userCarrinho);
      //userJogos.push(1);
      userCarrinho.push(game.id);
      //userStorage.userJogos = JSON.stringify(userJogos);
      userStorage.userCarrinho = JSON.stringify(userCarrinho);
      localStorage.setItem("user", JSON.stringify(userStorage));
      console.log(localStorage.getItem("user"));
      navigate("/carrinho");
  };

  return (
    <div className='game-detail-Detail'>
      <h2 className='game-title-Detail'>{game.title}</h2>
      <img src={game.imgURL} alt={`${game.title} cover`} />
      <p className='game-genre-Detail'>Genre: {game.genre}</p>
      <p className='game-description-Detail'>Description: {game.description}</p>
      <p className='game-price-Detail'>Price: ${game.price}</p>
      <button className="buy-button" onClick={handleClick}>Buy</button>
    </div>
  );
}

export default GameDetails;
