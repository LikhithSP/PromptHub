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

  useEffect(() => {
    fetchPrompts();
  }, [page, search, category]);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.q = search;
      if (category) params.category = category;

      const response = await promptsAPI.getAll(params);
      setPrompts(response.data.prompts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) return;

    try {
      await promptsAPI.delete(id);
      fetchPrompts();
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
      <div className="hero">
        <h1>
          <img src="/favicon.svg" alt="Prompt icon" style={{height: '2em', verticalAlign: 'middle', marginRight: '0.5em'}} />
          Welcome to PromptHub
        </h1>
        <p>Discover and share amazing AI prompts</p>
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
                <PromptCard key={prompt._id} prompt={prompt} onDelete={handleDelete} />
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
