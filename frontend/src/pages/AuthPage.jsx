// frontend/src/pages/AuthPage.jsx
import { useState, useEffect, useRef } from "react";
import styles from "./AuthPage.module.css";
import Error from "../components/Error/Error";
import { login, register, googleLogin } from "../api/auth.js";
import { saveToken, getToken } from "../lib/token.js";
import { useNavigate } from "react-router-dom";


// AuthPage component handles user authentication (login and registration)
export default function AuthPage() {
  // Initialize state variables for form data, error messages, and mode (login or register)
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  const [error, setError] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });

  const googleRef = useRef(null);

  // Handle input changes for form fields
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  // Handle Google login response
  const handleGoogleLogin = async (response) => {
    try {
      const data = await googleLogin(response.credential)

      saveToken(data.token);
      navigate("/movies", { replace: true });
    }catch (error) {
      setError(error.message);
    }
  }

  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;


    // Initialize Google Sign-In
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });
    
    // Render the Google Sign-In button
    window.google.accounts.id.renderButton(googleRef.current, {
      size: "large",
      width: "100%",
      theme: "outline",
    });

    isInitialized.current = true;
  }, []);


  // Handle form submission for login or registration
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = isLogin ? await login({ username: formData.username, password: formData.password }) : await register(formData);
      
      saveToken(data.token);
      navigate("/movies", { replace: true });

    } catch (error) {
      setError(error.message);
    }
  }

  // Determine if the current mode is login or register
  const isLogin = mode === "login";
  if (getToken()) {
    navigate("/movies", { replace: true });
  }

  // Render the authentication page with form fields and buttons for login/register and Google login
  return (
    <div className={styles.container}>
      <div className={styles.formSide}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>GA Movies </h1>
          <span className={styles.titleIcon}>🎬</span>
        </div>
        <p className={styles.subtitle}>
          {isLogin ? "Welcome back!" : "Welcome to Movies!"}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            name="username"
            placeholder="Username"
            onChange={handleInputChange}
            value={formData.username}
            required
          />

          {!isLogin && (
            <>
              <input
                className={styles.input}
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleInputChange}
                value={formData.email}
                required
              />

              <input
                className={styles.input}
                name="fullName"
                placeholder="Full Name"
                onChange={handleInputChange}
                value={formData.fullName}
                required
              />
            </>
          )}
          <input
            className={styles.input}
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleInputChange}
            value={formData.password}
            required
          />
          {!error && <Error message={error} />}
          <button type="submit" className={styles.submit}>
            {isLogin ? "Login" : "Signin"}
          </button>
        </form>
       
       
          <div ref={googleRef}></div>

        <button className={styles.toggle} type="button" onClick={() => setMode(isLogin ? "signin" : "login")}>
          {isLogin ? "No account yet? Register" : "Have an account? Login"}
        </button>
        
      </div>

      <div className={styles.imageSide}>
        <img
          className={styles.image}
          src="/media/images/movie-theather.jpg"
          alt="Movie Theater"
        />
        <div className={styles.overlay}>
          <h2 className={styles.overlayTitle}>
            🍿 Your Movies, everywhere 🎬
            <span className={styles.span}> Try our new movies for free </span>
          </h2>
        </div>
      </div>
    </div>
  );
}
