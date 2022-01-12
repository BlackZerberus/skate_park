//imports 
const path = require('path')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const {selectAllSkaters, insertSkater, updateSkater, updateEstado, deleteSkater, selectLogin, selectSkater} = require('../models/database')

require('dotenv').config()
const {SECRET} = process.env

/**
 * Funcion que consulta todos los registros de la tabla skaters y los obtiene en formato JSON
 * por medio del atributo results.
 * @returns {JSON} Json con la respuesta a la operacion de Consulta.
 */
const getSkaters = async() => {

    try {
        const {rows} = await selectAllSkaters()
        return {
            status: "success",
            code: 200,
            message: "Datos obtenidos.",
            results: rows
        }
    } catch (error) {
        console.log(error.message)
        return {
            status: "failed",
            code: 500,
            message: "No se pudieron Obtener los datos"
        }
    }

}


/**
 * Funcion que almacena un archivo en el servidor e intenta realizar un INSERT a la base de datos.
 * @param {object} body Objeto que contiene el payload del body enviado a traves de POST
 * @param {object} files Objeto que contiene el archivo a cargar en el servidor
 * @returns {JSON} Json con la respuesta a la operacion de Insercion.
 */
const postSkater = async(body, files) => {
    
    const values = Object.values(body)
    const {email, nombre} = body
    const {foto} = files
    const nombreimagen = `${email}_${nombre}_img`

    try {
        await foto.mv(path.resolve(`${__dirname}/../public/img/${nombreimagen}.jpg`))
    } catch (error) {
        console.log(error.message)
    }

    try {
        const {rows} = await insertSkater([...values, nombreimagen])
        return {
            status:"success",
            code: 201,
            message: "Inserción realizada con exito.",
            results: rows[0]
        }
        
    } catch (error) {
        console.log(error.message)
        return {
            status:"failed",
            code: 500,
            message: error.message
        }
    }
}


/**
 * Funcion que consulta en la DB si un skater existe basandose en sus credenciales (email y password).
 * si la consulta se resuelve correctamente pero sin resultados, se devolvera un json con un mensaje de error,
 * de lo contrario se generara un json con un token(JWT).
 * @param {object} body Objeto que contiene el payload del body enviado a traves de POST
 * @returns {JSON} Json con la respuesta a la operacion de SELECT.
 */
const postLogin = async(body) => {
    const {email, password} = body
    try {
        const res = await selectLogin([email, password])
        const {rowCount, rows} = res
        if(rowCount === 0) return {
            status: "failed",
            code: 404,
            message: "no existe el usuario o las credenciales son incorrectas.",
        }
        return {
            status: "success",
            code: 200,
            message: "verified",
            token: jwt.sign({skater: rows[0]}, SECRET, {expiresIn: "2m"})
        }
    } catch (error) {
        console.log(error.message)
        return {
            status: "failed",
            code: 500,
            message: error.message,
        }
    }
}


/**
 * Funcion encargada de modificar los datos de un skater, para esto debe proporcionar un token
 * el cual es entregado al momento de validar las credenciales.
 * @param {string} token string que contiene el JTW, si no se proporciona o se proporciona 
 * uno incorrecto o caducado, no se podra acceder al contenido.
 * @param {object} body objeto que contiene el payload
 * @returns {JSON} Json con la respuesta a la operacion de UPDATE.
 */
const putSkater = async (token, body) => {
    try {
        token = token.split(" ")[1]
        const {skater} = jwt.verify(token, SECRET)
        body.id = skater.id
    } catch (error) {
        return {
            status: "failed",
            code: 403,
            message: error.message
        }
    }
    
    const values = Object.values(body)

    try {
        const {rows} = await updateSkater(values)
        return {
            status: "success",
            code: 201,
            message: "Registro actualizado.",
            results: rows[0] 
        }
    } catch (error) {
        console.log(error.message)
        return {
            status: "failed",
            code: 500,
            message: error.message,
        }
    }
    
}


/**
 * Funcion que elimina un skater de la DB, tambien elimina la foto de perfil almacenada
 * en el server, para lo cual se hace una consulta previa al registro para determinar el
 * nombre del archivo.
 * @param {string} token El token con el id del registro a eliminar
 * @returns {JSON} Json con la respuesta a la operacion de DELETE.
 */
const delSkater = async(token) => {
    token = token.split(" ")[1]
    let decoded = {}
    try {
        decoded = jwt.verify(token, SECRET)
    } catch (error) {
        return {
            status: "failed",
            code: 403,
            message: error.message,
        }
    }
    try {
        const {rows} = await selectSkater(decoded.id)
        const {email, nombre} = rows[0]
        const nombreimagen = `${email}_${nombre}_img`
        
        const {rowCount} = await deleteSkater(decoded.id)
        if (rowCount == 0) return {
            status: "failed",
            code: 404,
            message: "No existe un usuario con el ID indicado.",
        }

        fs.unlinkSync(path.resolve(`${__dirname}/../public/img/${nombreimagen}.jpg`))

        return {
            status: "success",
            code: 200,
            message: "Registro eliminado.",
            id: decoded.id,
        }

    } catch (error) {
        console.log(error.message)
        return {
            status: "failed",
            code: 500,
            message: error.message,
        }
    }
}


/**
 * Funcion encargada de aprobar a un skater utilizando UPDATE en su respectivo registro.
 * @param {object} body el body del payload con los atributos estado e id. 
 * @returns @returns {JSON} Json con la respuesta a la operacion de UPDATE.
 */
const putEstado = async(body) => {
    const values = Object.values(body)
    try {
        const {rows} = await updateEstado(values)
        return {
            status: "success",
            code: 201,
            message: "Registro Aprobado.",
            results: rows[0]
        }
    } catch (error) {
        console.log(error.message)
        return {
            status: "failed",
            code: 500,
            message: error.message,
        }
    }
}


//exports
module.exports = {
    postSkater,
    getSkaters,
    postLogin,
    putSkater,
    delSkater,
    putEstado,
}