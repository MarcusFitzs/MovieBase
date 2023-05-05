const express = require('express');
const cors = require('cors')
const jwt = require('jsonwebtoken')

// const imageUpload = require('./utils/image_upload');

require('dotenv').config();
require('./utils/db.js')();

const { register, login, loginRequired, getAllUsers, getSingleUser, editUser, deleteUser } = require('./controllers/user_controller')
const { getAllMovies, getSingleMovie, getRecommendedMovie } = require('./controllers/movie_controller')
const { getAllLists, getSingleList, addList, getUserLists } = require('./controllers/list_controller')
const { getAllListContent, getSingleListContent, addListContent, getUserListContent } = require('./controllers/listContent_controller')
const { getAllUserRatings, getSingleUserRating, addUserRating, getSpecificUserRating, editUserRating, getUsersUserRatings } = require('./controllers/userRating_controller')
// const { getAllComments, getSingleComment, addComment, editComment, deleteComment, getUserComments } = require('./controllers/comment_controller')
// const { getAllActors, getSingleActor, addActor, editActor, deleteActor } = require('./controllers/actor_controller')
// const { getAllCast, getSingleCast, addCast, editCast, deleteCast } = require('./controllers/cast_controller')


const port = process.env.PORT || 4000

const app = express();
app.use(cors());
app.use(express.json());
//app.use(express.static('public'));

// app.use('/public', express.static('public'))

// Check for approved token
app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        jwt.verify(req.headers.authorization.split(' ')[1], 'Y4Project', (err, decode) => {
            if (err) req.user = undefined
            req.user = decode
            next()
        })
    } else {
        req.user = undefined
        next()
    }
})

// User Routes 
app.post('/register', register)
app.post('/login', login)
app.get('/users', loginRequired, getAllUsers)
app.get('/users/:id', loginRequired, getSingleUser)
app.put('/users/:id', loginRequired, editUser)
app.delete('/users/:id', loginRequired, deleteUser)


// Movies Routes
app.get('/movies', getAllMovies)
app.get('/movies/:id', getSingleMovie)
app.get('/movies/rec/:tconst', getRecommendedMovie)
// app.post('/movies', loginRequired, imageUpload.single('image'), addMovie)
// app.put('/movies/:id', loginRequired, imageUpload.single('image'), editMovie)
// app.delete('/movies/:id', loginRequired, deleteMovie)

// User's Lists
app.get('/lists', getAllLists)
app.get('/lists/:id', getSingleList)
app.post('/lists', addList)
app.get('/lists/user/:userID', getUserLists)

// List Content
app.get('/listcontent', getAllListContent)
app.get('/listcontent/:id', getSingleListContent)
app.post('/ble', addListContent)
app.get('/listcontent/user/:listID', getUserListContent)

// User Ratings
app.get('/userRatings', getAllUserRatings)
app.get('/userRatings/:id', getSingleUserRating)
app.post('/userRatings', addUserRating)
app.get('/userRatings/user/:userID', getUsersUserRatings)
app.get('/userRatings/:userID/:movieID', getSpecificUserRating)
app.put('/userRatings/:id', editUserRating)

// app.get('/userRatings/dupes', removeDupes)


// Connect to the database
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});