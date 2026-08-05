const express = require('express');
const moviesController = require('../controllers/movies.controller');
const auth = require('../guard/authentication')

const router = express.Router();

router.get('/', auth, moviesController.getAllMoviesByFilter);
router.get('/:id', auth, moviesController.getMovieById);
router.post('/', moviesController.createMovie);
router.put('/:id', moviesController.updateMovie);
router.delete('/:id', moviesController.deleteMovie);


module.exports = router;