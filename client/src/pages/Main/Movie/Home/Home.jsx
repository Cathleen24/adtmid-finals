import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCards from '../../../../components/MovieCards/MovieCards';
import { useMovieContext } from '../../../../context/MovieContext';

const Home = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const { movieList, setMovieList, setMovie } = useMovieContext();

  const getMovies = () => {
    // Get the movies from the API or database
    axios
      .get('/movies', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setMovieList(response.data);
        const random = Math.floor(Math.random() * response.data.length);
        setFeaturedMovie(response.data[random]);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (movieList.length) {
        const random = Math.floor(Math.random() * movieList.length);
        setFeaturedMovie(movieList[random]);
      }
    }, 5000);
    return;
  }, [featuredMovie]);

  return (
    <div className="main-container">
      <h1 className="page-title">Movies</h1>
      {featuredMovie && movieList.length ? (
        <div className="featured-list-container">
          <div
            className="featured-backdrop"
            style={{
              background: `url(${
                featuredMovie.backdropPath !==
                'https://image.tmdb.org/t/p/original/undefined'
                  ? featuredMovie.backdropPath
                  : featuredMovie.posterPath
              }) no-repeat center center`,
            }}
          >
            <span className="featured-movie-title">{featuredMovie.title}</span>
          </div>
        </div>
      ) : (
        <div className="featured-list-container-loader"></div>
      )}
      <div className="list-container">
        {movieList.map((movie) => (
          <MovieCards
            key={movie.id}
            movie={movie}
            onClick={() => {
              // Navigate to the movie details page
              navigate(`/main/view/${movie.id}`);
              setMovie(movie); // Set the selected movie to context
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
