// backend/routes/users.js
// Import required modules and controllers
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const auth = require("../guard/authentication");

// auth routes
router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.post("/google-login", usersController.googleLogin);
router.get("/me", auth, usersController.getMe);


// controller routes

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);
router.post("/", usersController.createUser);

router.get("/:id/watchlist", usersController.getUserWatchlist);
router.post("/:id/watchlist", usersController.addToWatchlist);
router.delete("/:id/watchlist/:movieId", usersController.removeFromWatchlist);

module.exports = router;
