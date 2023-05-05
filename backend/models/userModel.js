const mongoose = require('mongoose') // mongo db package
const bcrypt = require('bcrypt') // package used to encrypt the password fro safe storagin in DB
const validator = require('validator') // package to validate email and password

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// static sign up method
userSchema.statics.signup = async function (email, password) {
    // it has to be a regular func not arrow because we use this keyword
    // validation
    if (!email || !password) {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Passwod is not strong enough')
    }
    //-------------------------------------------
    const exists =  await this.findOne({email})

    if (exists) {
        throw Error("Email already in use")
    }

    const salt =  await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({
        email,
        password: hash
    })
    return user
}

// static login method 
userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled')
    } 

    const user =  await this.findOne({email})

    if (!user ) {
        throw Error("Incorrect Email")
    }

    const match = await bcrypt.compare(password, user.password) // compares hashed pasword with the user entry 

    if (!match) {
        throw Error('Invalid Password')
    }

    return user
}

module.exports = mongoose.model('User', userSchema)