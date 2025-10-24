import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { promptsAPI } from '../utils/api';
import './CreatePrompt.css';

const CreatePrompt = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    prompt: '',
    tags: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      fetchPrompt();
    }
  }, [id]);

  const fetchPrompt = async () => {
    try {
      const response = await promptsAPI.getById(id);
      const { title, category, prompt, tags } = response.data;
      setFormData({
        title,
        category,
        prompt,
        tags: tags.join(', '),
      });
    } catch (err) {
      setError('Failed to load prompt');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      if (isEditMode) {
        await promptsAPI.update(id, submitData);
      } else {
        await promptsAPI.create(submitData);
      }

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save prompt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <div className="create-box">
        <h2>
          {isEditMode ? (
            <>
              <i className="fa-solid fa-pen"></i> Edit Prompt
            </>
          ) : (
            <>
              <i className="fa-solid fa-sparkles"></i> Create New Prompt
            </>
          )}
        </h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter a descriptive title for your prompt"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="General">General</option>
              <option value="Creative">Creative</option>
              <option value="Writing">Writing</option>
              <option value="Technical">Technical</option>
              <option value="Business">Business</option>
              <option value="Marketing">Marketing</option>
              <option value="Education">Education</option>
              <option value="Music">Music</option>
              <option value="Fun">Fun</option>
              <option value="Startups">Startups</option>
              <option value="AI Tools">AI Tools</option>
              <option value="Productivity">Productivity</option>
              <option value="Design">Design</option>
              <option value="Coding">Coding</option>
              <option value="Data Analysis">Data Analysis</option>
            </select>
          </div>

          <div className="form-group">
            <label>Prompt *</label>
            <textarea
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              required
              rows="10"
              placeholder="Write your AI prompt here. Be specific and clear about what you want to achieve..."
            />
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Add relevant tags, separated by commas"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="btn-cancel">
              <i className="fa-solid fa-xmark"></i> Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Saving...
                </>
              ) : isEditMode ? (
                <>
                  <i className="fa-solid fa-check"></i> Update Prompt
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i> Create Prompt
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePrompt;
