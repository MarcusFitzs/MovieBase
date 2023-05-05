const ListContent = require('../models/listContent_schema.js')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

const getAllListContent = (req, res) => {
    ListContent.find()
    .populate('movieID')
    .populate('listID')
        .then((data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json("No lists found.")
            }
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json("None found.")
        });
}

const getSingleListContent = (req, res) => {
    ListContent.findById(req.params.id)
        .then((data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json(`Movie with id ${req.params.id} not found.`)
            }
        });
}

const addListContent = (req, res) => {
    let listContentData = req.body

    ListContent.create(listContentData)
        .then((data) => {
            if (data) {
                res.status(201).json(data)
            }
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                res.status(422).json(err) //Unprocessable Entity
            } else {
                console.error(err)
                res.status(500).json(err) //Internal Server Error 
            }
        })
}

const getUserListContent = (req, res) => {
    ListContent.find({listID: req.params.listID}).populate('movieID')
        .then((data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json(`No lists by ${req.params.listID} found.`)
            }
        });
}

module.exports = {
    getAllListContent,
    getSingleListContent,
    addListContent,
    getUserListContent
}