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

  // NOVA FUNÇÃO: Preview EXATO da landing page
  const renderLandingPagePreview = () => {
    const mainImageUrl = imageUrls[mainImageIndex];
    const hasValidImage = mainImageUrl && mainImageUrl.trim() !== '';
    
    // Objeto simulando um game para o preview
    const previewGame = {
      id: 'preview',
      title: title || 'Título do Jogo',
      price: price ? parseFloat(price) : 0,
      imgURL: mainImageUrl || '',
      genre: genre,
      description: description
    };
    
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '320px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        zIndex: 1000,
        border: '2px solid #007bff'
      }}>
        <div style={{
          background: '#007bff',
          color: 'white',
          padding: '10px 15px',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          🎮 Preview da Landing Page
        </div>
        
        <div style={{ padding: '15px' }}>
          {/* Usando EXATAMENTE seu GameCard component com as classes CSS originais */}
          <div className="game-card">
            <div className="imgDiv">
              {hasValidImage ? (
                <img 
                  src={mainImageUrl} 
                  alt={previewGame.title} 
                  className="game-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.style.cssText = 'width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #999; font-size: 14px;';
                    placeholder.textContent = '❌ Erro ao carregar';
                    e.target.parentNode.appendChild(placeholder);
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f0f0f0',
                  color: '#999',
                  fontSize: '14px'
                }}>
                  📷 Adicione uma imagem
                </div>
              )}
            </div>
            
            <div className="game-details">
              <h3 className="game-title">{previewGame.title}</h3>
              <p className="game-price">${previewGame.price.toFixed(2)}</p>
              <button className="buy-button">Buy</button>
            </div>
          </div>
        </div>
        
        {/* Informações extras apenas para o preview */}
        {(genre || description) && (
          <div style={{
            padding: '10px 15px',
            borderTop: '1px solid #e0e0e0',
            fontSize: '11px',
            color: '#666',
            background: '#f8f9fa'
          }}>
            {genre && <div><strong>Gênero:</strong> {genre}</div>}
            {description && (
              <div style={{ marginTop: '5px' }}>
                <strong>Descrição:</strong> {description.length > 40 
                  ? description.substring(0, 40) + '...' 
                  : description}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🎮 Iniciando cadastro do jogo...');

    // Validações básicas
    if (!title.trim()) {
      alert('❌ Título é obrigatório!');
      return;
    }
    
    if (!genre.trim()) {
      alert('❌ Gênero é obrigatório!');
      return;
    }
    
    if (!description.trim()) {
      alert('❌ Descrição é obrigatória!');
      return;
    }
    
    if (!price || parseFloat(price) <= 0) {
      alert('❌ Preço deve ser maior que zero!');
      return;
    }

    // Filtrar URLs de imagem vazias
    const filteredImageUrls = imageUrls.filter(url => url.trim() !== '');
    
    if (filteredImageUrls.length === 0) {
      alert('❌ Adicione pelo menos uma imagem!');
      return;
    }
    
    // Reorganizar as URLs de imagem para que a principal fique primeiro
    let organizedImageUrls = [...filteredImageUrls];
    if (mainImageIndex < organizedImageUrls.length) {
      const mainImage = organizedImageUrls.splice(mainImageIndex, 1)[0];
      organizedImageUrls.unshift(mainImage);
    }
    
    // Payload corrigido para corresponder exatamente ao modelo Game do backend
    const newGame = { 
      title: title.trim(), 
      genre: genre.trim(), 
      description: description.trim(), 
      price: parseFloat(price), 
      imgURL: organizedImageUrls, // DEVE ser um array, não string
      indexPrincipal: 0 // Campo obrigatório do backend
    };
    
    console.log('📋 Dados do jogo a serem enviados:', newGame);
    console.log('🔗 URLs das imagens (array):', newGame.imgURL);
    console.log('💰 Preço (tipo):', typeof newGame.price, newGame.price);
    console.log('📍 Index Principal:', newGame.indexPrincipal);

    try {
      console.log('📤 Enviando requisição para o backend...');
      
      const response = await fetch("http://localhost:8080/api/games/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(newGame),
      });

      console.log('📨 Resposta recebida:', response);
      console.log('📊 Status da resposta:', response.status);
      console.log('📊 Status OK?:', response.ok);

      // Tentar ler a resposta como texto primeiro
      const responseText = await response.text();
      console.log('📝 Resposta como texto:', responseText);

      if (response.ok) {
        let data;
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          console.log('⚠️ Resposta não é JSON válido, mas requisição foi bem-sucedida');
          data = { message: 'Jogo cadastrado com sucesso!' };
        }
        
        console.log("✅ Jogo cadastrado com sucesso:", data);
        alert('🎮 Jogo cadastrado com sucesso!');
        
        // Limpar campos do formulário
        setTitle('');
        setGenre('');
        setDescription('');
        setPrice('');
        setImageUrls(['']);
        setMainImageIndex(0);
      } else {
        // Tentar parsear erro do backend
        let errorMessage = 'Erro desconhecido';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || responseText;
          console.error("❌ Detalhes do erro do backend:", errorData);
        } catch {
          errorMessage = responseText || `Erro HTTP ${response.status}`;
        }
        
        console.error("❌ Erro do servidor:", errorMessage);
        console.error("❌ Status:", response.status);
        console.error("❌ Headers da resposta:", response.headers);
        
        // Mostrar diferentes tentativas
        alert(`❌ Erro 400 - Bad Request\n\nTentativa 1: Verifique se o backend está rodando\nTentativa 2: Dados podem estar em formato incorreto\n\nDetalhes: ${errorMessage}`);
      }
    } catch (error) {
      console.error("💥 Erro de conexão:", error);
      console.error("💥 Detalhes do erro:", error.message);
      alert(`❌ Erro ao conectar com o servidor: ${error.message}`);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Preview da Landing Page */}
      {(title || imageUrls[mainImageIndex]) && renderLandingPagePreview()}
      
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
    </div>
  );
}

export default GameRegister;