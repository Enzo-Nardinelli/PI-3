'use client'
import { useState } from 'react';
import './ImageGallery.css';

function ImageGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // If no images or empty array, show placeholder
  if (!images || images.length === 0) {
    return <div className="image-gallery-container">
      <div className="main-image-container">
        <div className="placeholder-image">No Image Available</div>
      </div>
    </div>;
  }

  // Navigate to previous image
  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // Navigate to next image
  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Go directly to a specific image
  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="image-gallery-container">
      <div className="main-image-container">
        <img 
          src={images[currentIndex]} 
          alt={`Game image ${currentIndex + 1}`} 
          className="main-image"
        />
        
        {/* Only show navigation arrows if there's more than one image */}
        {images.length > 1 && (
          <>
            <button 
              className="arrow left-arrow" 
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              &#8249;
            </button>
            <button 
              className="arrow right-arrow" 
              onClick={goToNext}
              aria-label="Next image"
            >
              &#8250;
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="thumbnails-container">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`} 
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Image counter */}
      {images.length > 1 && (
        <div className="image-counter">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;