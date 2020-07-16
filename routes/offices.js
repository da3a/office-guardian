const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Office = require('../models/Office')

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('offices/add')
})

// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Office.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Office.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let office = await Office.findById(req.params.id).populate('user').lean()
    console.log(JSON.stringify(office))
    if (!office) {
      return res.render('error/404')
    }

    const headContent = `<script src="https://code.jquery.com/jquery-3.4.0.min.js" integrity="sha256-BJeo0qm959uMBGb65z40ejJYGSgR7REI4+CW1fNKwOg=" crossorigin="anonymous" type="text/javascript" charset="utf-8"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="/js/chart-device-data.js" type="text/javascript" charset="utf-8"></script>`


    res.render('offices/show', {
//      headContent,
      office,

    })
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const office = await Office.findOne({
      _id: req.params.id,
    }).lean()

    if (!office) {
      return res.render('error/404')
    }

    if (office.user != req.user.id) {
      res.redirect('/offices')
    } else {
      res.render('offices/edit', {
        office,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let office = await Office.findById(req.params.id).lean()

    if (!office) {
      return res.render('error/404')
    }

    if (office.user != req.user.id) {
      res.redirect('/offices')
    } else {
      office = await Office.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let office = await Office.findById(req.params.id).lean()

    if (!office) {
      return res.render('error/404')
    }

    if (office.user != req.user.id) {
      res.redirect('/offices')
    } else {
      await Office.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const offices = await Office.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('offices/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router