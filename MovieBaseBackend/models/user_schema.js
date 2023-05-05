const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

let validateEmail = function (email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        //lowercase: true,
        required: [true, 'Name is required.']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, 'Email is required.'],
        validate: [validateEmail, 'Please enter a valid email address.']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required.']
    },
    pfp: {
        type: String
    },
}, {
    timestamps: true
});

userSchema.methods.comparePassword = function (password) {
    console.log("password - " + password)
    console.log("this.password - " + this.password)
    return bcrypt.compareSync(password, this.password, function (result) {
        return result
    });
};

module.exports = model('User', userSchema);