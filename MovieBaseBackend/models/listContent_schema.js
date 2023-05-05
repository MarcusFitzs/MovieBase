const { Schema, model } = require('mongoose')

const listContentSchema = new Schema({
    listID: {
        type: Schema.Types.ObjectId,
        ref: "Lists",
        trim: true,
        required: [true, 'List ID is required.']
    },
    movieID: {
        type: Schema.Types.ObjectId,
        ref: "Movies",
        trim: true,
        required: [true, 'Movie ID is required.']
    }
}, {
    timestamps: true
});

module.exports = model('ListContents', listContentSchema);