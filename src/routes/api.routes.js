//imports
const express = require('express')
const {postSkater, getSkaters, postLogin, putSkater, delSkater, putEstado} = require('../controllers/skaters')

const router = express.Router()

//endpoint /skaters
router.get('/skaters',async(req, res) => {
    const json = await getSkaters()
    res.status(json.code).json(json)
})

//endpoint /skater
router.route('/skater')
.post(async(req, res) => {
    const {body, files} = req
    const json = await postSkater(body, files)
    res.status(json.code).json(json)
})
.put(async(req, res) => {
    const {body} = req
    const token = req.get("Authorization")
    const json = await putSkater(token, body)
    res.status(json.code).json(json)
})
.delete(async(req, res) => {
    token = req.get("Authorization")
    const json = await delSkater(token)
    res.status(json.code).json(json)
})

//ruta /login
router.post('/login', async(req, res) => {
    const json = await postLogin(req.body)
    res.status(json.code).json(json)
})

//ruta /aprobar
router.put('/aprobar', async(req, res) => {
    const json = await putEstado(req.body)
    res.status(json.code).json(json)
})

//exports
module.exports = router