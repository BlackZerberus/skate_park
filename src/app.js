//imports
const express = require('express')
const fileUpload = require('express-fileupload')
const root = require('./routes/root.routes')
const apiSkater = require('./routes/api.routes')
const exphbs = require('express-handlebars')


//variables de entorno 
require('dotenv').config() 

const app = express()

//settings
const {EXPRESS_PORT, EXPRESS_HOST} = process.env
app.set('views', __dirname + '/views')
app.engine('.hbs', exphbs({
    extname: '.hbs'
}))
app.set("view engine", ".hbs")

//middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(fileUpload({
    limits: {
        fileSize: 5000000
    },
    abortOnLimit: true,
    responseOnLimit: "El peso del archivo excede el limite permitido (5mb)",
}))
app.use('/public', express.static(__dirname + '/public'))
app.use('/', root)
app.use('/api', apiSkater)

app.listen(EXPRESS_PORT, EXPRESS_HOST ,() => console.log(`Servidor corriendo en ${EXPRESS_HOST}:${EXPRESS_PORT}`))