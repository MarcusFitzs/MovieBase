const { Schema, model } = require('mongoose')

const userRatingSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
        trim: true,
        required: [true, 'User ID is required.']
    },
    movieID: {
        type: Schema.Types.ObjectId,
        ref: "Movies",
        trim: true,
        required: [true, 'Movie ID is required.']
    },
    rating: {
        type: Number,
        trim: true,
        required: [true, 'A rating is required.']
    }
}, {
    timestamps: true
});

module.exports = model('UserRatingContents', userRatingSchema);