const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Office = require('../models/Office')

//desc Login/Landing Page
//route GET/

router.get('/', ensureGuest, (req, res) => {
    res.render('login', { layout: 'login' })

})

//desc Dashboard Page
//route GET/ dashboard

router.get('/dashboard', ensureAuth, async (req, res) => {

    try {
        const offices = await Office.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            offices

        })
        }
    catch (err) {
        console.error(err)
        res.render(['error/500'])
    }

})

module.exports = router