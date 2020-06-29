const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')


//desc Login/Landing Page
//route GET/

router.get('/', ensureGuest, (req, resp) => {
    resp.render('login', {layout: 'login'})

})

//desc Dashboard Page
//route GET/ dashboard

router.get('/dashboard', ensureAuth,  (req, resp) => {
    resp.render('dashboard')

})

module.exports = router