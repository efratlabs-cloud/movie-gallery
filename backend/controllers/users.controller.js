// backend/controllers/users.controller.js
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

// JWT token generation
const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Google OAuth2 client setup
const googleClientId = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register a new user
const register = async (req, res) => {
  try {
  const { username, email, fullName, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      error: "Missing fields ⚠️",
      message: "Username, email, and password are required.",
    });
  }
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.status(409).json({
      error: "User already exists 🙅",
      message: "A user with that username or email already exists.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = await User.create({
    username,
    email,
    fullName: fullName || username,
    password: hashedPassword,
  });

  const token = signToken(newUser._id);
  
  res.status(201).json({
    message: "User registered successfully 🎉",
    token,
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName
    },
  });
} catch (error) {
  res.status(500).json({ error: "Internal server error", message: error.message });
}
};

// Login user
const login = async (req, res) => {
  try {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Missing fields ⚠️",
      message: "Username and password are required.",
    });
  }
  const existingUser = await User.findOne({ username }).select("+password");
  if (!existingUser) {
    return res.status(404).json({
      error: "User not found 👤",
      message: "No user with that username exists.",
    });
  }
  const isMatch = await bcrypt.compare(password, existingUser.password);
  if (!isMatch) {
    return res.status(401).json({
      error: "Invalid credentials 🔒",
      message: "The username or password is incorrect.",
    });
  }

  const token = signToken(existingUser._id);

  res.status(200).json({
    message: "Login successful 🎉",
    token,
    user: {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      fullName: existingUser.fullName
    },
  });
  }catch (error) {
  res.status(500).json({ error: "Internal server error", message: error.message });
}
};

// Google OAuth2 login
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        error: "Missing credential ⚠️",
        message: "Google credential is required.",
      });
    }

    const idVerify = await googleClientId.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });

    const payload = idVerify.getPayload();

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        username: payload.email,
        email: payload.email,
        fullName: payload.name,
        avatar: payload.picture
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      message: "Google login successful 🎉",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      },
    });

  } catch (error) {
    res.status(401).json({ error: "Google login failed 🚫", message: error.message });
  }
}

// Get current logged-in user
const getMe = async (req, res) => {
  try {
    const userId = await User.findById(req.userId);
     
    if (!userId) {
      return res.status(404).json({
        error: "User not found 👤",
        message: "No user with that ID exists.",
      }); 
    }
     
    res.json(userId);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

// Get all users with optional search and genre filtering
const getAllUsers = (req, res) => {
  const { search, genre } = req.query;

  const filter = {};

  if (search) {
    filter.$or = [
       { username: { $regex: search, $options: "i" } },
       { fullName: { $regex: search, $options: "i" } },
    ]
  }

  if (genre) {
    result = result.filter((u) =>
      u.favoriteGenres.some((g) => g.toLowerCase() === genre.toLowerCase()),
    );
  }

  res.json(result);
};

// Get user by ID
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      error: "User not found 👤",
      message: `No user with id ${id} in our community.`,
    });
  }

  res.json(user);
};

// Create a new user
const createUser = (req, res) => {
  const { username, email, fullName, avatar, favoriteGenres } = req.body;

  if (!username || !email) {
    return res.status(400).json({
      error: "Missing fields ⚠️",
      message: "Both 'username' and 'email' are required.",
    });
  }

  const taken = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase(),
  );
  if (taken) {
    return res.status(409).json({
      error: "Username taken 🙅",
      message: `The username '${username}' is already in use.`,
    });
  }

  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    username,
    email,
    fullName: fullName || username,
    avatar:
      avatar ||
      `https://placehold.co/200x200/1a1a2e/eaeaea?text=${encodeURIComponent(username)}`,
    joinedAt: new Date().toISOString().split("T")[0],
    favoriteGenres: favoriteGenres || [],
    watchlist: [],
  };

  users.push(newUser);

  res.status(201).json(newUser);
};

// Get user's watchlist
const getUserWatchlist = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      error: "User not found 👤",
      message: `No user with id ${id}.`,
    });
  }

  const watchlistMovies = user.watchlist
    .map((movieId) => movies.find((m) => m.id === movieId))
    .filter(Boolean);

  res.json({
    user: user.username,
    count: watchlistMovies.length,
    movies: watchlistMovies,
  });
};

// Add a movie to user's watchlist
const addToWatchlist = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      error: "User not found 👤",
      message: `No user with id ${id}.`,
    });
  }

  const { movieId } = req.body;

  if (!movieId) {
    return res.status(400).json({
      error: "Missing field ⚠️",
      message: "'movieId' is required in the body.",
    });
  }

  const movie = movies.find((m) => m.id === movieId);
  if (!movie) {
    return res.status(404).json({
      error: "Movie not found 🎬",
      message: `Can't add - no movie with id ${movieId}.`,
    });
  }

  if (user.watchlist.includes(movieId)) {
    return res.status(409).json({
      error: "Already in watchlist 📋",
      message: `'${movie.title}' is already in ${user.username}'s watchlist.`,
    });
  }

  user.watchlist.push(movieId);

  res.status(201).json({
    message: `'${movie.title}' added to ${user.username}'s watchlist 🍿`,
    watchlist: user.watchlist,
  });
};

// Remove a movie from user's watchlist
const removeFromWatchlist = (req, res) => {
  const id = parseInt(req.params.id);
  const movieId = parseInt(req.params.movieId);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      error: "User not found 👤",
      message: `No user with id ${id}.`,
    });
  }

  const index = user.watchlist.indexOf(movieId);
  if (index === -1) {
    return res.status(404).json({
      error: "Not in watchlist 📋",
      message: `Movie ${movieId} isn't in ${user.username}'s watchlist.`,
    });
  }

  user.watchlist.splice(index, 1);

  res.json({
    message: `Movie ${movieId} removed from ${user.username}'s watchlist 🗑️`,
    watchlist: user.watchlist,
  });
};

// Export all controller functions
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  register,
  login,
  getMe,
  googleLogin,
};
