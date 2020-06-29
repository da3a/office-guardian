const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const exphbs  = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')  

//Load Config
dotenv.config({path: './config/config.env'})


//passport config
require('./config/passport')(passport)

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars

app.engine('.hbs',
     exphbs({
//     helpers: {
//     formatDate,
//     stripTags,
//     truncate,
//     editIcon,
//     select,
//   },
  defaultLayout: 'main',extname: '.hbs'}));
app.set('view engine', '.hbs');

//sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false, 
  store: new MongoStore({mongooseConnection: mongoose.connection})
})
)

//passport middleware

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')))


//Routes

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT

app.listen(PORT, console.log(`Server running on: ${process.env.NODE_ENV} mode on port: ${process.env.PORT}`))