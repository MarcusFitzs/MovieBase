const { Schema, model } = require('mongoose')

const movieSchema = new Schema({
    tconst: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'IMDb ID is required.']
    },
    titleType: {
        type: String,
        trim: true,
    },
    primaryTitle: {
        type: String,
        trim: true,
    },
    startYear: {
        type: Number,
        trim: true,
    },
    runtimeMinutes: {
        type: Number,
        trim: true,
    },
    genres: {
        type: String,
        trim: true,
    },
    averageRating: {
        type: Number,
        trim: true,
    },
    numVotes: {
        type: Number,
        trim: true,
    },
}, {
    timestamps: true
});

module.exports = model('Movies', movieSchema);