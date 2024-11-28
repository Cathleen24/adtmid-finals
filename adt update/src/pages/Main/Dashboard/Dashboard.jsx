import './Dashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch movies
  const getMovies = () => {
    axios.get('/movies').then((response) => {
      setMovies(response.data);
    });
  };

  useEffect(() => {
    getMovies();
  }, []);

  
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome</h1>
        <p>Discover, search, and manage your movies</p>
      </header>

      {/* Search Bar (No icon, just input field) */}
      <section className="search-bar">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      {/* Movie List Section */}
      <section className="dashboard-movies">
        <div className="movie-cards">
          {filteredMovies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img src={movie.posterPath} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="dashboard-footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
