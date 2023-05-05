const { Schema, model } = require('mongoose')

const listSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
        trim: true,
        required: [true, 'User ID is required.']
    },
    listName: {
        type: String,
        trim: true,
        required: [true, 'List type is required.']
    }
}, {
    timestamps: true
});

module.exports = model('Lists', listSchema);