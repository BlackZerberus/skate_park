//funcionalidad para actualizar el estado de cada skater
const table = document.getElementById("adminTable")

table.addEventListener("click", async(e) => {
    if (e.target.type == "checkbox") {
        try {
            await axios.put('http://localhost:3000/api/aprobar', {estado: true, id: e.target.id})
            e.target.checked = true
            e.target.disabled = true
        } catch (error) {
            alert(error.message)
        }
    }
})