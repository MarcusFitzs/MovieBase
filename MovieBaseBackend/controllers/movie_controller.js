const Movie = require('../models/movie_schema.js')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

const getAllMovies = (req, res) => {
    Movie.find()
        .then((data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json("No movies found.")
            }
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json("None found.")
        });
}

const getSingleMovie = (req, res) => {
    Movie.findById(req.params.id)
        .then((data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json(`Movie with id ${req.params.id} not found.`)
            }
        });
}

const getRecommendedMovie = (req, res) => {
    Movie.find({tconst: req.params.tconst})
        .then((data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json(`No movies with IMDb ID ${req.params.tconst} found.`)
            }
        });
}

module.exports = {
    getAllMovies,
    getSingleMovie,
    getRecommendedMovie
}