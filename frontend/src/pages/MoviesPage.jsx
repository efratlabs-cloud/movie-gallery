//import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMovies } from "../api/movies.js";
import { getMe } from "../api/auth.js";
import Error from "../components/Error/Error";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import styles from "./MoviesPage.module.css";
import AddMovie from "../components/AddMovie/AddMovie";

export default function MoviesPage() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const userData = await getMe();
        setUser(userData);

        const moviesData = await getMovies();
      
        setMovies(moviesData);
        setLoading(false);
        
        const filteredMovies = moviesData.filter(
          (movie) =>
            movie.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            movie.year.toString().includes(searchValue) ||
            movie.genre?.some((g) =>
              g.toLowerCase().includes(searchValue.toLowerCase()),
            ),
        );

        setMovies(filteredMovies);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
    fetchMovies();
  }, [searchValue]);

  const handleAddMovie = (newMovie) => {
    setMovies([...movies, newMovie]);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Welcome {user?.fullName}</h1>
      </header>

      <div className={styles.searchSection}>
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search movies..."
        />
        <Button
          btnDescription="הוסף סרט חדש"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {loading ? (
        <p className={styles.message}>טוען סרטים...</p>
      ) : movies.length === 0 ? (
        <p className={styles.message}>לא נמצאו סרטים...</p>
      ) : (
        <ul className={styles.movieGrid}>
          {movies.map((movie) => (
            <li
              key={movie._id}
              className={styles.movieCard}
              onClick={() => navigate(`/movies/${movie._id}`)}
            >
              <img
                className={styles.poster}
                src={movie.poster}
                alt={movie.title}
              />
              <div className={styles.cardInfo}>
                <h2 className={styles.title}>{movie.title}</h2>
                <p className={styles.year}>Year: {movie.year}</p>
                <p className={styles.rating}>⭐ {movie.rating}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {error && <Error message={error} />}
      
      {isModalOpen && (
        <AddMovie
          onAddMovie={handleAddMovie}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
