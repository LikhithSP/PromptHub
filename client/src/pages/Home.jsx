import { useState, useEffect } from 'react';
import { promptsAPI } from '../utils/api';
import PromptCard from '../components/PromptCard';
import './Home.css';

const Home = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    fetchPrompts();
  }, [page, search, category]);

  useEffect(() => {
    fetchAvailableCategories();
  }, []); // Fetch categories only once on mount

  const fetchAvailableCategories = async () => {
    try {
      const response = await promptsAPI.getAvailableCategories();
      setAvailableCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.q = search;
      if (category) params.category = category;

      console.log('Fetching prompts with params:', params);
      const response = await promptsAPI.getAll(params);
      console.log('Prompts response:', response);
      setPrompts(response.data.prompts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      console.error('Error details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) return;

    try {
      await promptsAPI.delete(id);
      fetchPrompts();
      fetchAvailableCategories(); // Refresh categories after delete
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete prompt');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPrompts();
  };

  return (
    <div className="home">
      <div 
        className="hero"
        style={{
          backgroundImage: 'url(https://www.shutterstock.com/image-illustration/modern-fractal-glass-gradient-background-600nw-2717890317.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <h1>
          <img src="/favicon.svg" alt="Prompt icon" style={{height: '2em', verticalAlign: 'middle', marginRight: '0.5em'}} />
          Welcome to PromptHub
        </h1>
        <p>
          "Explore creative AI prompts, and publish your own to inspire others."
        </p>
      </div>

      <div className="container">
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search for prompts by keyword or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button type="submit"><i className="fa-solid fa-magnifying-glass"></i> Search</button>
        </form>

        {loading ? (
          <div className="loading">Loading prompts...</div>
        ) : prompts.length === 0 ? (
          <div className="no-prompts">No prompts found. Be the first to create one!</div>
        ) : (
          <>
            <div className="prompts-grid">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} onDelete={handleDelete} />
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn-page"
                >
                  <i className="fa-solid fa-chevron-left"></i> Previous
                </button>
                <span className="page-info">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                  className="btn-page"
                >
                  Next <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
