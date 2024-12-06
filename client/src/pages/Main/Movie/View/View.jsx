import { useEffect, useState } from 'react';
import { useMovieContext } from '../../../../context/MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function View() {
  const { movie, setMovie } = useMovieContext();
  const [castAndCrews, setCastAndCrews] = useState({ cast: [], crew: [] });
  const [videos, setVideos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null); // State to track the currently playing video
  const { movieId } = useParams();
  const navigate = useNavigate();

  const BEARER_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWFlOTAxZjU5ZmE4YTQyZGRjN2RhMWUxMzRmOTFjZCIsIm5iZiI6MTczMjUxODMxMS45NzYsInN1YiI6IjY3NDQyMWE3ODkzYmU2MDliZTNhOGIwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0vzHGuKof4Ra66tKOFu39w0ztr4WCRpW-5Q6JR7jrJk"; 

  useEffect(() => {
    if (movieId) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
          const tempData = {
            id: response.data.tmdbId,
            original_title: response.data.title,
            overview: response.data.overview,
            popularity: response.data.popularity,
            poster_path: response.data.posterPath,
            release_date: response.data.releaseDate,
            vote_average: response.data.voteAverage,
          };
          setMovie(tempData);
        })
        .catch((error) => {
          console.error('Error fetching movie:', error);
          navigate('/');
        });
    }
  }, [movieId, setMovie, navigate]);

  useEffect(() => {
    if (movie) {
      axios
        .get(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, {
          headers: { Authorization: BEARER_TOKEN },
        })
        .then((response) => {
          const { cast, crew } = response.data;
          setCastAndCrews({ cast, crew });
        });

      axios
        .get(`https://api.themoviedb.org/3/movie/${movie.id}/videos`, {
          headers: { Authorization: BEARER_TOKEN },
        })
        .then((response) => {
          setVideos(response.data.results);
        });

      axios
        .get(`https://api.themoviedb.org/3/movie/${movie.id}/images`, {
          headers: { Authorization: BEARER_TOKEN },
        })
        .then((response) => {
          setPhotos(response.data.backdrops);
        });
    }
  }, [movie]);

  const handlePlayVideo = (videoKey) => {
    setPlayingVideo(videoKey); // Set the current video key to play
  };

  const handleStopVideo = () => {
    setPlayingVideo(null); // Stop the currently playing video
  };

  return (
    <>
      {movie && (
        <div className="movie-detail-container">
          {/* Back Button */}
          <button
            className="back-button"
            onClick={() => navigate(-1)} // Navigate back to the previous page
          >
            &#8592; Back
          </button>

          <div className="movie-header">
            <img
              className="movie-poster"
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
                  : 'https://via.placeholder.com/200x300?text=No+Image'
              }
              alt={movie.original_title || 'No Poster Available'}
              style={{ width: '150px', height: '225px', objectFit: 'cover' }}
            />
            <div className="movie-details-container">
              <h2 className="movie-title">{movie.original_title}</h2>
              <p className="movie-overview">{movie.overview}</p>
              <div className="details-list">
                <div className="detail-item">
                  Popularity <span>{movie.popularity}</span>
                </div>
                <div className="detail-item">
                  Release Date <span>{movie.release_date}</span>
                </div>
                <div className="detail-item">
                  Vote Average <span>{movie.vote_average} / 10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="section-separator" />

          {/* Cast & Crew Section */}
          <h3 className="section-header">Cast & Crew</h3>
          <div className="cast-crew-section">
            <div className="cast-crew-list">
              {/* Cast Table */}
              <div className="cast-table-section">
                <h4 className="cast-crew-subheader">Cast</h4>
                <div className="cast-table-scroll">
                  <table className="cast-crew-table">
                    <thead>
                      <tr>
                        {/* Column Headers */}
                        <th>Name</th>
                        <th>Character</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {castAndCrews.cast.slice(0, 50).map((castMember) => (
                        <tr key={castMember.id}>
                          <td>{castMember.name}</td>
                          <td>{castMember.character}</td>
                          <td>
                            <img
                              className="cast-photo"
                              src={
                                castMember.profile_path
                                  ? `https://image.tmdb.org/t/p/w500${castMember.profile_path}`
                                  : 'https://via.placeholder.com/100x150?text=No+Image'
                              }
                              alt={castMember.name}
                              style={{ width: '100px', height: '150px', objectFit: 'cover' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Crew Table */}
              <div className="crew-table-section">
                <h4 className="cast-crew-subheader">Crew</h4>
                <div className="crew-table-scroll">
                  <table className="cast-crew-table">
                    <thead>
                      <tr>
                        {/* Column Headers */}
                        <th>Name</th>
                        <th>Job</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {castAndCrews.crew.slice(0, 50).map((crewMember) => (
                        <tr key={crewMember.id}>
                          <td>{crewMember.name}</td>
                          <td>{crewMember.job}</td>
                          <td>
                            <img
                              className="crew-photo"
                              src={
                                crewMember.profile_path
                                  ? `https://image.tmdb.org/t/p/w500${crewMember.profile_path}`
                                  : 'https://via.placeholder.com/100x150?text=No+Image'
                              }
                              alt={crewMember.name}
                              style={{ width: '100px', height: '150px', objectFit: 'cover' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="section-separator" />

          {/* Videos Section */}
          <h3 className="section-header">Videos</h3>
          <div className="videos-section">
            <div className="videos-grid">
              {videos.map((video) => (
                <div key={video.id} className="video-card">
                  {playingVideo === video.key ? (
                    <div className="video-player">
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${video.key}?autoplay=1`}
                        title={video.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div
                      className="video-thumbnail"
                      onClick={() => handlePlayVideo(video.key)}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                        alt={video.name}
                        className="thumbnail-image"
                      />
                      <div className="play-icon">&#9654;</div> {/* Play button overlay */}
                    </div>
                  )}
                  <div className="video-title">{video.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-separator" />

          {/* Photos Section */}
          <h3 className="section-header">Photos</h3>
          <div className="photos-section">
            {photos.map((photo) => (
              <img
                key={photo.file_path}
                className="photo-thumbnail"
                src={`https://image.tmdb.org/t/p/w500/${photo.file_path}`}
                alt="Photo"
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default View;
