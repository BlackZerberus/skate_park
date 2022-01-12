//codigo que realiza un post a la api para verificar las credenciales.
const formLogin = document.getElementById('formLogin')
tokenForm = document.getElementById("token")

formLogin.addEventListener("submit", async(e) => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    try {
        const {data} = await axios.post('http://localhost:3000/api/login', {
        email,
        password
        })
        const {token} = data
        if(!token) throw new Error()
        tokenForm.value = token
        //guardamos en el localstorage
        localStorage.setItem("token", token)
        formLogin.submit()
    } catch (error) {
        alert(error.message)
    }
    
})