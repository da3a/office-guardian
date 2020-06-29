const express = require('express')

const router = express.Router()


//desc Login/Landing Page
//route GET/

router.get('/', (req, resp) => {
    resp.render('login', {layout: 'login'})

})

//desc Dashboard Page
//route GET/ dashboard

router.get('/dashboard', (req, resp) => {
    resp.render('dashboard')

})

module.exports = router