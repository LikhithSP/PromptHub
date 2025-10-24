import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { promptsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './PromptDetail.css';

const PromptDetail = () => {
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrompt();
  }, [id]);

  const fetchPrompt = async () => {
    try {
      const response = await promptsAPI.getById(id);
      setPrompt(response.data);
      setLikeCount(response.data.likes);
      setIsLiked(response.data.isLiked || false);
    } catch (err) {
      setError('Failed to load prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) return;

    try {
      await promptsAPI.delete(id);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete prompt');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt);
    alert('Prompt copied to clipboard!');
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like prompts');
      return;
    }
    
    if (!isAnimating) {
      setIsAnimating(true);
      
      try {
        const response = await promptsAPI.like(id);
        setIsLiked(response.data.isLiked);
        setLikeCount(response.data.likes);
      } catch (error) {
        console.error('Failed to like prompt:', error);
        alert('Failed to like prompt. Please try again.');
      }
      
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!prompt) return <div className="error">Prompt not found</div>;

  const canManage = user && prompt.user && user._id === prompt.user._id;

  return (
    <div className="detail-container">
      <div className="detail-box">
        <div className="detail-header">
          <div>
            <h1>{prompt.title}</h1>
            <div className="meta-info">
              <span className="category">{prompt.category}</span>
              <span><i className="fa-solid fa-user"></i> {prompt.author}</span>
              <button 
                className={`like-button ${isLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
                onClick={handleLike}
                aria-label="Like"
              >
                <i className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i> {likeCount}
              </button>
              <span><i className="fa-solid fa-calendar"></i> {new Date(prompt.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {canManage && (
            <div className="actions">
              <Link to={`/edit/${prompt._id}`} className="btn-edit">
                <i className="fa-solid fa-pen"></i> Edit
              </Link>
              <button onClick={handleDelete} className="btn-delete">
                <i className="fa-solid fa-trash"></i> Delete
              </button>
            </div>
          )}
        </div>

        <div className="tags">
          {prompt.tags.map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
        </div>

        <div className="prompt-content">
          <h3>Prompt:</h3>
          <pre>{prompt.prompt}</pre>
          <button onClick={handleCopy} className="btn-copy">
            <i className="fa-solid fa-copy"></i> Copy to Clipboard
          </button>
        </div>

        <div className="back-link">
          <Link to="/"><i className="fa-solid fa-arrow-left"></i> Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;
