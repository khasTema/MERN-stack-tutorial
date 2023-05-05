const express = require('express');

// controler functions 
const { loginUser, signupUser } = require('../controllers/userController')

const router = express.Router()

// login routes
router.post('/login', loginUser)


// sign up route
router.post('/signup', signupUser)

module.exports = router