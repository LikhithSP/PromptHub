import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { promptsAPI } from '../utils/api';
import { supabase } from '../lib/supabaseClient';
import './CreatePrompt.css';

const CreatePrompt = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    prompt: '',
    tags: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState('');
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
      const { title, category, prompt, tags, image_url } = response.data;
      setFormData({
        title,
        category,
        prompt,
        tags: tags.join(', '),
      });
      if (image_url) {
        setImagePreview(image_url);
        setImageName(image_url.split('/').pop());
      }
    } catch (err) {
      setError('Failed to load prompt');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('prompts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('prompts')
        .getPublicUrl(fileName);

      return publicUrl.publicUrl;
    } catch (err) {
      console.error('Image upload error:', err);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageUrl = imagePreview;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        image_url: imageUrl || null,
      };

      if (isEditMode) {
        await promptsAPI.update(id, submitData);
      } else {
        await promptsAPI.create(submitData);
      }

      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save prompt');
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
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Enter prompt title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="General">General</option>
              <option value="Creative Writing">Creative Writing</option>
              <option value="Business">Business</option>
              <option value="Coding">Coding</option>
              <option value="Education">Education</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Cover Image (Optional)</label>
            <div className="image-upload">
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setImageName('');
                    }}
                    className="btn-remove-image"
                  >
                    <i className="fa-solid fa-x"></i> Remove
                  </button>
                </div>
              )}
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="image" className="file-label">
                <i className="fa-solid fa-image"></i> {imageName || 'Choose Image'}
              </label>
              <p className="hint">PNG, JPG, WebP. Max 5MB</p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prompt">Prompt *</label>
            <textarea
              id="prompt"
              name="prompt"
              placeholder="Enter your prompt here..."
              value={formData.prompt}
              onChange={handleChange}
              required
              rows="8"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              id="tags"
              type="text"
              name="tags"
              placeholder="e.g. creative, ai, writing"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Saving...' : isEditMode ? 'Update Prompt' : 'Create Prompt'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePrompt;
