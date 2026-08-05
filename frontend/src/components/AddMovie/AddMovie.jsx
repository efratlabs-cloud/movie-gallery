import { useState } from "react";
import styles from './AddMovie.module.css';
import Error from "../Error/Error"; // ודאי שהנתיבים תקינים לפי המבנה שלך
import Input from "../Input/Input";
import Button from "../Button/Button";
import { createMovie } from "../../api/movies";

export default function AddMovie({ onAddMovie, onClose }) {
  // ניהול הסטייט של שדות הטופס
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [director, setDirector] = useState("");
  const [poster, setPoster] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // חובה: מונע מהדפדפן לרענן את העמוד בעת שליחת טופס
    setError(""); // איפוס שגיאות קודמות

    // ולידציה בסיסית - חובה שם ושנה
    if (!title || !year) {
      setError("Title and Year are required fields.");
      return;
    }

    try {
      // הכנת האובייקט לשליחה לשרת (המרת השנה למספר)
      const movieData = { 
        title, 
        year: Number(year), 
        director, 
        poster 
      };

      // שליחה לשרת (נשלח בקשת POST עם הטוקן)
      const newSavedMovie = await createMovie(movieData);

      // קריאה לפונקציה של דף האב כדי להוסיף את הסרט לרשימה ולסגור את הפופאפ
      onAddMovie(newSavedMovie);
    } catch (err) {
      setError(err.message || "Failed to add movie.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.container}>
        <button className={styles.closeBtn} onClick={onClose}>X</button>
        <h1>הוסף סרט חדש</h1>
        
        {/* שימוש בטופס מאפשר שליחה גם בלחיצה על Enter */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input 
            type="text" 
            label="Title" 
            placeholder="הכנס את שם הסרט" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
          />
          <Input 
            type="number" 
            label="Year" 
            placeholder="הכנס את שנת יציאת הסרט" 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required 
          />
          <Input 
            type="text" 
            label="Director" 
            placeholder="הכנס את שם הבמאי" 
            value={director}
            onChange={(e) => setDirector(e.target.value)}
          />
          <Input 
            type="url" 
            label="Poster" 
            placeholder="הכנס את כתובת התמונה" 
            value={poster}
            onChange={(e) => setPoster(e.target.value)}
          />
          
          {/* הצגת שגיאה במידה ויש */}
          {error && <Error message={error} />}
          
          <Button type="submit" 
           btnDescription="הוסף סרט " />
        </form>
      </div>
    </div>
  );
}