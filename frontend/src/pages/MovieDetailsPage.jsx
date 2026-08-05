import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovie } from "../api/movies";
import Error from "../components/Error/Error";
import styles from "./MovieDetailsPage.module.css";
import { deleteMovie } from "../api/movies";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMovie() {
      try {
        const movieDetails = await getMovie(id);

        setMovie(movieDetails);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    }
    fetchMovie();
  }, []);

  return (
    <div className={styles.pageContainer}>
      {movie ? (
        <div className={styles.contentWrapper}>
          <img className={styles.poster} src={movie.poster} alt={movie.title} />

          <div className={styles.details}>
            <h1 className={styles.title}>{movie.title}</h1>

            <div className={styles.metaRow}>
              <span className={styles.year}>{movie.year}</span>
              <span className={styles.duration}>{movie.duration} min</span>
              <span className={styles.genre}>{movie.genre.join(" | ")}</span>
            </div>

            <p className={styles.rating}>⭐ {movie.rating}</p>

            <div className={styles.crew}>
              <p>
                <strong>Director:</strong> {movie.director}
              </p>
              <p>
                <strong>Lead Actor:</strong> {movie.leadActor}
              </p>
            </div>

            <p className={styles.description}>{movie.description}</p>
            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => navigate(-1)}>
                חזרה לגלריה
              </button>

              <button
                className={styles.deleteBtn}
                onClick={() => {
                  window.confirm(
                    "Are you sure you want to delete this movie?",
                  ) && deleteMovie(movie._id).then(() => navigate("/movies"));
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className={styles.message}>{error && <Error message={error} />}</p>
      
      )}
    </div>
  );
}
