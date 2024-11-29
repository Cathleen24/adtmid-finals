import './Dashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null); 
  const [showMoreInfo, setShowMoreInfo] = useState(false); 
  const [castAndCrews, setCastAndCrews] = useState([]); 
  const [videos, setVideos] = useState([]); 
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  const BEARER_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI";

  
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

  
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowMoreInfo(false); 

    axios
      .get(`https://api.themoviedb.org/3/movie/${movie.tmdbId}/credits`, {
        headers: {
          Authorization: BEARER_TOKEN,
        },
      })
      .then((response) => {
        const { cast, crew } = response.data;
        setCastAndCrews({ cast, crew });
      });
    
    axios
      .get(`https://api.themoviedb.org/3/movie/${movie.tmdbId}/videos`, {
        headers: {
          Authorization: BEARER_TOKEN,
        },
      })
      .then((response) => {
        setVideos(response.data.results);
      });
    
    axios
      .get(`https://api.themoviedb.org/3/movie/${movie.tmdbId}/images`, {
        headers: {
          Authorization: BEARER_TOKEN,
        },
      })
      .then((response) => {
        setPhotos(response.data.backdrops);
      });
  };

  
  const handleBack = () => {
    setSelectedMovie(null);
    setCastAndCrews([]);
    setVideos([]);
    setPhotos([]);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome</h1>
        <p>Discover, search, and manage your movies</p>
      </header>

      {/* Search Bar */}
      <section className="search-bar">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      {/* Movie List Section */}
      {!selectedMovie ? (
        <section className="dashboard-movies">
          <div className="movie-cards">
            {filteredMovies.map((movie) => (
              <div
                className="movie-card"
                key={movie.id}
                onClick={() => handleMovieClick(movie)} 
              >
                <img src={movie.posterPath} alt={movie.title} />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="movie-details">
          {/* Back Button */}
          <button className="back-button" onClick={handleBack}>
            &larr; Back
          </button>

          <div className="movie-detail-container">
            <div className="movie-header">
              <img
                className="movie-poster"
                src={selectedMovie.posterPath || 'https://via.placeholder.com/200x300?text=No+Image'}
                alt={selectedMovie.title || 'No Poster Available'}
              />
              <div className="movie-details-container">
                <h2>{selectedMovie.title}</h2>
                <p>{selectedMovie.overview}</p>

                <div className="details-list">
                  <div className="detail-item">
                    Popularity: <span>{selectedMovie.popularity}</span>
                  </div>
                  <div className="detail-item">
                    Release Date: <span>{selectedMovie.releaseDate}</span>
                  </div>
                  <div className="detail-item">
                    Vote Average: <span>{selectedMovie.voteAverage} / 10</span>
                  </div>
                </div>

                {/* More Info Button */}
                <button className="more-info-button" onClick={() => setShowMoreInfo(!showMoreInfo)}>
                  {showMoreInfo ? 'Hide Info' : 'More Info'}
                </button>
              </div>
            </div>

            {/* Show More Info */}
            {showMoreInfo && (
              <div className="more-info-section">
                {/* Cast and Crew Section */}
                <h3>Cast & Crew</h3>
                <div className="cast-section">
                  {castAndCrews.cast?.map((cast) => (
                    <div key={cast.id} className="cast-item">
                      {cast.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${cast.profile_path}`}
                          alt={cast.name}
                        />
                      ) : (
                        <div>No Image</div>
                      )}
                      <p>{cast.name}</p>
                      <p>{cast.character}</p>
                    </div>
                  ))}
                </div>

                {/* Videos Section */}
                <h3>Videos</h3>
                <div className="videos-section">
                  {videos.map((video) => (
                    <div key={video.id} className="video-frame-container">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.key}`}
                        title={video.name}
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))}
                </div>

                {/* Photos Section */}
                <h3>Photos</h3>
                <div className="photos-section">
                  {photos.map((photo) => (
                    <img
                      key={photo.file_path}
                      src={`https://image.tmdb.org/t/p/original${photo.file_path}`}
                      alt="Movie Scene"
                      className="photo-thumbnail"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="dashboard-footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
