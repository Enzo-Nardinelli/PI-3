// src/components/GameCard.js
import React from 'react';
import './gameCardComponent.css';

const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      <div className="imgDiv">
      <img src={game.image} alt={game.title} className="game-image" />
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
