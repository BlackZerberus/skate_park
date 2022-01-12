//imports
require('dotenv').config()
const express = require('express')
const axios = require('axios').default
const jwt = require('jsonwebtoken')
const {postSkater} = require('../controllers/skaters')
const {SECRET} = process.env

const router = express.Router()

//rutas
router.get('/', async(req, res) => {
    const {data} = await axios.get('http://localhost:3000/api/skaters')
    res.render("homeView", {
        skaters: data.results
    })
})

router.get('/login', (req, res) => {
    res.render("loginView")
})

router.get('/registro', async(req, res) => {
    res.render("registroView")
})

router.post('/registro', async(req, res) => {
    const {body, files} = req
    const json = await postSkater(body, files)
    json.code == 201
    ?res.redirect('/')
    :res.status(json.code).send()
})

router.get('/datos', async(req, res) => {
    const {token} = req.query
    if(!token) return res.status(401).send("acceso restringido")
    try {
        const decoded = await jwt.verify(token, SECRET)
        res.render("datosView", {skater: decoded.skater})
    } catch (error) {
        res.status(401).json(error.message)
    }
})

router.get('/admin',async (req, res) => {
    const {data} = await axios.get('http://localhost:3000/api/skaters')
    res.render("adminView", {
        skaters: data.results
    })
})

//exports
module.exports = router
