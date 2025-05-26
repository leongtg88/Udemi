
fetch("https://reqres.in/api/users/2")
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        mostrarUsuario(data.data);
})
.catch (error => {
    console.error("Error al pedir los datos del servidor", error);
});

const mostrarUsuario = user => {

    let caja = document.querySelector("#user");
    caja.innerHTML = ` 
        <h2> ${user.first_name} ${user.last_name}<h2>
        <img src="${user.avatar}" />

    `;

};