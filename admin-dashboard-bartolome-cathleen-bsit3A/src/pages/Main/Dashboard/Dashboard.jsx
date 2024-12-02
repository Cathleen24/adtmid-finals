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
  const [topWatchedMovies, setTopWatchedMovies] = useState([]);
  const navigate = useNavigate();

  const BEARER_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI";

  const getMovies = () => {
    axios.get('/movies').then((response) => {
      setMovies(response.data);
    });
  };

  const getTopWatchedMovies = () => {
    axios
      .get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          region: 'AS', 
          sort_by: 'popularity.desc',
          page: 1,
          language: 'en-US',
        },
        headers: {
          Authorization: BEARER_TOKEN,
        },
      })
      .then((response) => {
        setTopWatchedMovies(response.data.results.slice(0, 15)); 
      });
  };

  useEffect(() => {
    getMovies();
    getTopWatchedMovies(); 
  }, []);

  const getMovieRating = (movie) => {
    if (movie.adult) {
      return 'SPG (18+)';
    }

    const matureKeywords = ['bed scene', 'sex', 'nudity', 'adult content', 'sexual', 'violence'];
    const overviewLowerCase = movie.overview.toLowerCase();

    for (let keyword of matureKeywords) {
      if (overviewLowerCase.includes(keyword)) {
        return 'SPG (18+)';
      }
    }

    if (movie.voteAverage >= 7) {
      return 'PG';
    }
    return 'G';
  };

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

  const removeMovieFromTopWatched = (movieId) => {
    setTopWatchedMovies(topWatchedMovies.filter(movie => movie.id !== movieId));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome!</h1>
        <p>Discover, search, and manage your movies</p>
      </header>

      {}
      <section className="search-bar">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      {}
      <section className="dashboard-main">
        <div className="total-movie-list">
          <h3>Total Movies: {movies.length}</h3>
        </div>

        {}
        <div className="top-watched-movies">
          <h3>Top Most Watched Movies in Asia</h3>
          <div className="horizontal-scroll">
            {topWatchedMovies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="movie-info">
                  <h4>{movie.title}</h4>
                  {}
                  <button
                    className="remove-button"
                    onClick={() => removeMovieFromTopWatched(movie.id)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        {!selectedMovie ? (
          <div className="dashboard-movies">
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
                    <p className="movie-rating">Rating: {getMovieRating(movie)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <section className="movie-details">
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

                  <button className="more-info-button" onClick={() => setShowMoreInfo(!showMoreInfo)}>
                    {showMoreInfo ? 'Hide Info' : 'More Info'}
                  </button>
                </div>
              </div>

              {showMoreInfo && (
                <div className="more-info-section">
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
      </section>

      <footer className="dashboard-footer">
        <p>&copy; 2024 Movie Dashboard</p>
      </footer>
    </div>
  );
}

export default Dashboard;
