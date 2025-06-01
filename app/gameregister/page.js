'use client'
import { useState } from 'react';
import './page.css';

function GameRegister() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Adicionar um novo campo de URL de imagem
  const addImageField = () => {
    setImageUrls([...imageUrls, '']);
  };

  // Atualizar URL de imagem específica
  const updateImageUrl = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  // Remover campo de URL de imagem
  const removeImageField = (index) => {
    if (imageUrls.length > 1) {
      const newImageUrls = [...imageUrls];
      newImageUrls.splice(index, 1);
      setImageUrls(newImageUrls);
      
      // Ajustar o índice da imagem principal se necessário
      if (mainImageIndex === index) {
        setMainImageIndex(0);
      } else if (mainImageIndex > index) {
        setMainImageIndex(mainImageIndex - 1);
      }
    }
  };

  // Definir imagem principal
  const setAsMainImage = (index) => {
    setMainImageIndex(index);
  };

  // NOVA FUNÇÃO: Renderizar preview da imagem
  const renderImagePreview = (url, index) => {
    if (!url || url.trim() === '') return null;
    
    return (
      <div style={{ marginTop: '15px', marginBottom: '10px' }}>
        <img 
          src={url}
          alt={`Preview ${index + 1}`}
          style={{
            maxWidth: '200px',
            maxHeight: '150px',
            objectFit: 'cover',
            border: '2px solid #ddd',
            borderRadius: '8px',
            display: 'block',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = '<div style="padding: 15px; background: #ffebee; border: 2px dashed #f44336; border-radius: 8px; text-align: center; color: #d32f2f; font-size: 14px;">❌ Erro ao carregar imagem<br><small>Verifique se a URL está correta</small></div>';
            e.target.parentNode.appendChild(errorDiv);
          }}
        />
        {index === mainImageIndex && (
          <div style={{
            background: '#ffc107',
            color: '#333',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginTop: '8px',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            ⭐ Imagem Principal
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filtrar URLs de imagem vazias
    const filteredImageUrls = imageUrls.filter(url => url.trim() !== '');
    
    // Reorganizar as URLs de imagem para que a principal fique primeiro
    let organizedImageUrls = [...filteredImageUrls];
    if (mainImageIndex < organizedImageUrls.length) {
      // Remove a imagem principal e a coloca no início do array
      const mainImage = organizedImageUrls.splice(mainImageIndex, 1)[0];
      organizedImageUrls.unshift(mainImage);
    }
    
    const newGame = { 
      title, 
      genre, 
      description, 
      price: parseFloat(price), 
      imgURL: organizedImageUrls.length === 1 ? organizedImageUrls[0] : organizedImageUrls,
      mainImageIndex
    };
    
    console.log(newGame);

    try {
      const response = await fetch("http://localhost:8080/api/games/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGame),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Game registered:", data);
        alert('🎮 Jogo cadastrado com sucesso!');
        // Limpar campos do formulário
        setTitle('');
        setGenre('');
        setDescription('');
        setPrice('');
        setImageUrls(['']);
        setMainImageIndex(0);
      } else {
        console.error("Failed to register game");
        alert('❌ Erro ao cadastrar jogo!');
      }
    } catch (error) {
      console.error("Error:", error);
      alert('❌ Erro ao conectar com o servidor!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="game-register-form">
      <h2>Register New Game</h2>
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        required
      />
      
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      
      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      
      <div className="image-url-section">
        <h3>Game Images</h3>
        <p className="hint">A primeira imagem será usada como imagem principal por padrão. Você pode alterar a imagem principal clicando no botão "Definir como Principal".</p>
        
        {imageUrls.map((url, index) => (
          <div key={index} className={`image-url-field ${index === mainImageIndex ? 'main-image' : ''}`}>
            <div className="image-input-group">
              <input
                type="text"
                placeholder={`Image URL ${index + 1}${index === mainImageIndex ? ' (Principal)' : ''}`}
                value={url}
                onChange={(e) => updateImageUrl(index, e.target.value)}
              />
              
              <div className="image-actions">
                {index !== mainImageIndex && (
                  <button 
                    type="button" 
                    className="set-main-btn"
                    onClick={() => setAsMainImage(index)}
                  >
                    Definir como Principal
                  </button>
                )}
                
                {imageUrls.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => removeImageField(index)}
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
            
            {/* AQUI ESTÁ O PREVIEW DA IMAGEM */}
            {renderImagePreview(url, index)}
          </div>
        ))}
        
        <button 
          type="button" 
          className="add-image-btn" 
          onClick={addImageField}
        >
          Adicionar Outra Imagem
        </button>
      </div>
      
      <button type="submit" className="register-btn">Register Game</button>
    </form>
  );
}

export default GameRegister;