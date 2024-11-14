// GameRegister.js
'use client'
import { useState } from 'react';

function GameRegister() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newGame = { title, genre, description, price: parseFloat(price) };

    try {
      const response = await fetch("http://localhost:8080/api/games/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGame),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Game registered:", data);
        // Optionally clear form fields
        setTitle('');
        setGenre('');
        setDescription('');
        setPrice('');
      } else {
        console.error("Failed to register game");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit">Register Game</button>
    </form>
  );
}

export default GameRegister;
