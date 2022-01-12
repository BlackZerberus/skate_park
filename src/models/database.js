//imports
const {Pool} = require('pg')
require('dotenv').config()

//config

const {DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE} = process.env

const pool = new Pool({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE,
})

/**
 * funcion que obtiene todos los registros de la tabla skaters
 * @returns {object} el objeto QueryResult con los datos de la consulta
 * @throws sqlError
 */
const selectAllSkaters = async () => {

    const sqlQuery = {
        text: "SELECT id, nombre, anos_experiencia, especialidad, estado, foto FROM skaters;"
    }


    const client = await pool.connect()

    try {    
        const res = await client.query(sqlQuery)
        return res
    } catch (error) {
        throw error
    }
    finally {
        client.release()
    }
}

/**
 * Funcion que inserta un registro en la Tabla skater.
 * @param {Array<string>} values array con los valores solicitados:
 * email, nombre, password, anos_experiencia, especialidad, foto, estado. 
 * @returns {object} QueryResult con el resultado del Insert.
 * @throws sqlError
 */
const insertSkater = async (values) => {

    const sqlQuery = {
        text: `INSERT INTO SKATERS 
        (email, nombre, password, anos_experiencia, especialidad, estado, foto)
        VALUES ($1, $2, $3, $4, $5, false, $6)
        RETURNING *;`,
        values,
    }

    const client = await pool.connect()
    try {
        const res = await client.query(sqlQuery)
        return res
    } catch (error) {
        throw error
    }
    finally {
        client.release()
    }
}


/**
 * Funcion que consulta si existe un registro determinado por su email y contraseña.
 * @param {Array<string>} values array con los valores solicitados: email y password.
 * @returns {object} QueryResult con el resultado de la consulta.
 * @throws sqlError 
 */
const selectLogin = async(values) => {

    const sqlQuery = {
        text: `SELECT * FROM skaters WHERE email=$1 AND password=$2`,
        values
    }

    const client = await pool.connect()
    try {
        const res = await client.query(sqlQuery)
        return res
    } catch (sqlError) {
        throw sqlError
    }
    finally {
        client.release()
    }
}

/**
 * Funcion que actualiza un registro en la tabla skaters.
 * @param {Array<string>} values array con los valores solicitados:
 * nombre, password, años de experiencia y especialidad. 
 * @returns {object} QueryResult con el resultado del UPDATE
 * @throws sqlError
 */
const updateSkater = async (values) => {
    
    const sqlQuery = {
        text: `UPDATE skaters SET nombre=$1, password=$2, anos_experiencia=$3, especialidad=$4
        WHERE id=$5 RETURNING *;`,
        values,
    }

    const client = await pool.connect()
    try {
        const res = await client.query(sqlQuery)
        return res
    } catch (sqlError) {
        throw sqlError
    }
    finally {
        client.release()
    }

}

/**
 * Funcion que elimina un registro de skater basandose en un id dado.
 * @param {string} id El id del skater a eliminar
 * @returns {object} QueryResult con el resultado del DELETE
 * @throws sqlError
 */
const deleteSkater = async(id) => {

    const sqlQuery = {
        text: `DELETE FROM skaters WHERE id=$1 RETURNING *`,
        values: [id],
    }

    const client = await pool.connect()
    try {
        const res = await client.query(sqlQuery)
        return res
    } catch (sqlError) {
        throw sqlError
    }
    finally {
        client.release()
    }
}


/**
 * Funcion que modifica la columna estado de un skater en base a su id.
 * @param {array<string>} values Array con los valores solicitados: estado e id.
 * @returns {object} QueryResult con el resultado del UPDATE
 * @throws sqlError
 */
const updateEstado = async (values) => {

    const sqlQuery= {
        text: `UPDATE skaters SET estado=$1 WHERE id=$2 RETURNING *;`,
        values,
    }

    const client = await pool.connect()
    try {
        const res = await client.query(sqlQuery)
        return res
    } catch (sqlError) {
        throw sqlError
    }
    finally {
        client.release()
    }

}


/**
 * funcion que obtiene un registro de skater basado en su id.
 * @param {string} id 
 * @returns {object} QueryResult con el resultado del SELECT
 * @throws sqlError
 */
const selectSkater = async(id) => {

    const sqlQuery = {
        text: "SELECT * FROM skaters WHERE id=$1;",
        values: [id]
    }

    const client = await pool.connect()

    try {
        const res = await client.query(sqlQuery)
        return res
    } catch (sqlError) {
        throw sqlError
    }
    finally {
        client.release()
    }
}

//exports
module.exports = {
    selectAllSkaters,
    insertSkater,
    selectLogin,
    updateSkater,
    deleteSkater,
    updateEstado,
    selectSkater,
}