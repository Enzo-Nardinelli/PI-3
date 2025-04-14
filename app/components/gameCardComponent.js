
import React from 'react';
import './gameCardComponent.css';

import { useNavigate } from 'react-router-dom';


const GameCard = ({ game }) => {
  const navigate = useNavigate();
let teste = game.imgURL;

  const handleClick = () => {
    navigate(`/game/${game.id}`);  // Redirect to the GameDetail page for this game
  };
  // const jogos = localStorage.getItem('user').jogos;
  // console.log(jogos);
  
  return (
    <div className="game-card" onClick={handleClick}>
      <div className="imgDiv">
      <img src={game.imgURL} alt={game.title} className="game-image" />
      </div>
      <div className="game-details">
        <h3 className="game-title">{game.title}</h3>
        <p className="game-price">${game.price}</p>
        <button className="buy-button">Buy</button>
      </div>
    </div>
  );
};

export default GameCard;
