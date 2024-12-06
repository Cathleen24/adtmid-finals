import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCards from '../../../../components/MovieCards/MovieCards';
import { useMovieContext } from '../../../../context/MovieContext';

const Home = () => {
  const navigate = useNavigate();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { movieList, setMovieList, setMovie } = useMovieContext();

  const BEARER_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWFlOTAxZjU5ZmE4YTQyZGRjN2RhMWUxMzRmOTFjZCIsIm5iZiI6MTczMjUxODMxMS45NzYsInN1YiI6IjY3NDQyMWE3ODkzYmU2MDliZTNhOGIwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0vzHGuKof4Ra66tKOFu39w0ztr4WCRpW-5Q6JR7jrJk"; // Replace with your actual token

  const getMovies = (query = '') => {
    // Fetch movies from API with optional search query
    axios
      .get(`/movies`, {
        headers: {
          Authorization: BEARER_TOKEN, 
        },
      })
      .then((response) => {
        if (response.data && response.data.length) {
          setMovieList(response.data);
          const random = Math.floor(Math.random() * response.data.length);
          setFeaturedMovie(response.data[random]);
        } else {
          console.log("No movies found in the API response");
        }
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getMovies(searchQuery); // Fetch movies based on the search query
  };

  useEffect(() => {
    getMovies(); // Initially load movies
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (movieList.length) {
        setIndex((prevIndex) => (prevIndex + 1) % movieList.length); // Increment index and loop around
      }
    }, 5000); // Change featured movie every 5 seconds for smooth transition

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, [movieList]);

  useEffect(() => {
    if (movieList.length) {
      setFeaturedMovie(movieList[index]);
    }
  }, [index, movieList]);

  // Filter movie list based on search query
  const filteredMovies = movieList.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main-container">
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a movie..."
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      {/* Featured Movie Section */}
      {featuredMovie && movieList.length ? (
        <div className="featured-list-container">
          <div
            className="featured-backdrop"
            style={{
              backgroundImage: `url(${
                featuredMovie.backdropPath !==
                'https://image.tmdb.org/t/p/original/undefined'
                  ? featuredMovie.backdropPath
                  : featuredMovie.posterPath
              })`,
            }}
            onClick={() => {
              // Navigate to the movie details page when the backdrop is clicked
              navigate(`/main/view/${featuredMovie.id}`);
              setMovie(featuredMovie); // Set the selected movie to context
            }}
          >
            <span className="featured-movie-title">{featuredMovie.title}</span>
          </div>
        </div>
      ) : (
        <div className="featured-list-container-loader"></div>
      )}

      {/* Movie Cards List */}
      <div className="list-container">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCards
              key={movie.id}
              movie={movie}
              onClick={() => {
                // Navigate to the movie details page when a movie card is clicked
                navigate(`/main/view/${movie.id}`);
                setMovie(movie); // Set the selected movie to context
              }}
            />
          ))
        ) : (
          <div>No movies found</div>
        )}
      </div>
    </div>
  );
};

export default Home;
