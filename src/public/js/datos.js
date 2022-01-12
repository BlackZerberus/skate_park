//archivo js que interactua con el formulario de actualizar y eliminar datos
const form = document.getElementById("formDatos")
const btnActualizar = document.getElementById("btn-actualizar")
const btnEliminar = document.getElementById("btn-eliminar")

const nombre = document.getElementById("nombre")
const password = document.getElementById("password")
const anosExperiencia = document.getElementById("anosExperiencia")
const especialidad = document.getElementById("especialidad")


btnActualizar.addEventListener("click", async(e) => {
    e.preventDefault()
    try {
        await axios.put('http://localhost:3000/api/skater', {
            nombre: nombre.value, 
            password: password.value, 
            anosExperiencia: anosExperiencia.value, 
            especialidad: especialidad.value 
        },
        {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        alert("registro actualizado")
    }
    catch (error) {
        alert("Ha ocurrido un error:" + error.message)
    }
    finally {
        form.submit()
    }
})

btnEliminar.addEventListener("click", async(e) => {
    e.preventDefault()
    try {
        const {data} = await axios.delete(`http://localhost:3000/api/skater`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    alert("registro eliminado")
    } catch (error) {
        alert("Ha ocurrido un error:" + error.message)
    }
    finally {
        form.submit()
    }
})