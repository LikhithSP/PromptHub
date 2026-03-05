import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { promptsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './PromptCard.css';

const PromptCard = ({ prompt, onDelete, onLikeUpdate }) => {
  const { user } = useAuth();
  const canManage = user && prompt.user_id && user.id === prompt.user_id;
  const [isLiked, setIsLiked] = useState(prompt.isLiked || false);
  const [likeCount, setLikeCount] = useState(prompt.likes);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to like prompts');
      return;
    }
    
    if (!isAnimating) {
      setIsAnimating(true);
      
      try {
        const response = await promptsAPI.like(prompt.id);
        setIsLiked(response.data.isLiked);
        setLikeCount(response.data.likes);
        
        if (onLikeUpdate) {
          onLikeUpdate(prompt.id, response.data.isLiked);
        }
      } catch (error) {
        console.error('Failed to like prompt:', error);
        alert('Failed to like prompt. Please try again.');
      }
      
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <Link to={`/prompt/${prompt.id}`} className="prompt-card-link">
      <div className="prompt-card">
        {prompt.image_url && (
          <div className="prompt-image-container">
            <img src={prompt.image_url} alt={prompt.title} className="prompt-image" />
          </div>
        )}
        <div className="prompt-header">
          <h3>{prompt.title}</h3>
          <span className="category">{prompt.category}</span>
        </div>
        <p className="prompt-text">{prompt.prompt.substring(0, 150)}...</p>
        <div className="tags">
          {prompt.tags.map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
        </div>
        <div className="prompt-footer">
          <div className="meta">
            <span><i className="fa-solid fa-user"></i> {prompt.author}</span>
            <button 
              className={`like-button ${isLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
              onClick={handleLike}
              aria-label="Like"
            >
              <i className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i> {likeCount}
            </button>
          </div>
          <div className="actions">
            {canManage && (
              <>
                <Link to={`/edit/${prompt.id}`} className="btn-edit" onClick={(e) => e.stopPropagation()}>
                  <i className="fa-solid fa-pen"></i> Edit
                </Link>
                <button onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(prompt.id);
                }} className="btn-delete">
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PromptCard;
