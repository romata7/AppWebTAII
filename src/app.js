const express = require('express')
const app = express()
const autoIncrement = require('mongoose-auto-increment')

//connecting to db
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/dbtaii', {
    useNewUrlParser: true
})
    .then(db => console.log('connected to dbtaii'))
    .catch(err => console.log(err))

const connection = mongoose.createConnection('mongodb://localhost/dbtaii', {
    useNewUrlParser: true
})
autoIncrement.initialize(connection)

//importing routes
const indexRoutes = require('./routes/index')

//setting
app.set('port', process.env.PORT || 3000)
const path = require('path')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//middlewares
const morgan = require('morgan')
app.use(morgan('dev'))
app.use(express.urlencoded({
    extended: false
}))
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use('/', indexRoutes)

//starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port ' + app.get('port'))
})