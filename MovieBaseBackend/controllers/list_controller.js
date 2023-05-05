const List = require('../models/list_schema.js')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

const getAllLists = (req, res) => {
    List.find()
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

const getSingleList = (req, res) => {
    List.findById(req.params.id)
        .then((data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json(`Movie with id ${req.params.id} not found.`)
            }
        });
}

const addList = (req, res) => {
    let listData = req.body

    List.create(listData)
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

const getUserLists = (req, res) => {
    List.find({userID: req.params.userID})
        .populate('userID')
        .then((data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json(`No lists by ${req.params.userID} found.`)
            }
        });
}

module.exports = {
    getAllLists,
    getSingleList,
    addList,
    getUserLists
}