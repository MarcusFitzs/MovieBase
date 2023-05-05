const UserRating = require('../models/userRating_schema.js')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

const getAllUserRatings = (req, res) => {
    UserRating.find()
    .populate('userID')
    .populate('movieID')
        .then((data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json("No ratings found.")
            }
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json("None found.")
        });
}

const getSingleUserRating = (req, res) => {
    UserRating.findById(req.params.id)
        .then((data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json(`Rating with id ${req.params.id} not found.`)
            }
        });
}

const addUserRating = (req, res) => {
    let userRatingData = req.body

    UserRating.create(userRatingData)
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

const getSpecificUserRating = (req, res) => {
    // UserRating.find({}, { item: 1, qty: 1, size: 1, status: 1 }).forEach(function(doc) {
    //     UserRating.remove({_id: { $gt: doc._id }, item: doc.item, qty: doc.qty, size: doc.size, status: doc.status })
    // })
    UserRating.find({userID: req.params.userID, movieID: req.params.movieID}).populate('userID').populate('movieID')
        .then((data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json(`No lists by ${req.params.listID} found.`)
            }
        });
}

// const removeDupes = () => {
//     UserRating.find({}, { item: 1, qty: 1, size: 1, status: 1 }).forEach(function(doc) {
//         UserRating.remove({_id: { $gt: doc._id }, item: doc.item, qty: doc.qty, size: doc.size, status: doc.status })
//     })
// }

// const removeDupes = async () => {
//     for await (let m of UserRating.find({}, { item: 1, qty: 1, size: 1, status: 1 })) {
//         m.remove({_id: { $gt: doc._id }, item: doc.item, qty: doc.qty, size: doc.size, status: doc.status })
//     }
// }

// const getUserUserRating = (req, res) => {
//     UserRating.find({listID: req.params.listID}).populate('movieID')
//         .then((data) => {
//             if (data) {
//                 res.status(200).json(data)
//             } else {
//                 res.status(404).json(`No lists by ${req.params.listID} found.`)
//             }
//         });
// }

const editUserRating = (req, res) => {
    let userRatingData = req.body

    UserRating.findByIdAndUpdate(req.params.id, userRatingData, {
        new: true
    })
    .then((data) => {
        if(data){
            res.status(201).json(data)
        }
    })
    .catch((err) => {
        if(err.name === "ValidationError"){
            res.status(422).json(err)
        }
        else {
            console.error(err)
            res.status(500).json(err)
        }
       
    })
}

const getUsersUserRatings = (req, res) => {
    UserRating.find({userID: req.params.userID})
        .populate('userID')
        .populate('movieID')
        .then((data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json(`No lists by ${req.params.userID} found.`)
            }
        });
}

module.exports = {
    getAllUserRatings,
    getSingleUserRating,
    addUserRating,
    // getUserUserRating
    getSpecificUserRating,
    // removeDupes
    editUserRating,
    getUsersUserRatings
}