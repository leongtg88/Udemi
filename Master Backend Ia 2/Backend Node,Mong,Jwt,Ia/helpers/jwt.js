//Backend Node,Mong,Jwt,Ia\helpers\jwt.js
//82. Importar dependencias
const jwt = require("jwt-simple");
const { default: isTaxID } = require("validator/lib/isTaxID");

//83.Clave secreta
const secret = "Clave-de-mi-backend-DE-NODE-puntoJS";


//84. Crear funcion para generar tokens
const createToken = (user) => {

    //86.
    let now = Math.floor(Date.now() / 1000);
    let expiration = now + 30 * 24 * 60 * 60;



//85. Creamos un payload que es la informacion que se va usar para crear ese token
        let payload = {
            id: user._id,
            name: user.name,
            surname: user.surname,
            nick: user.nick,
            email: user.email,
            bio: user.bio,
            avatar: user.avatar,
            iat: now,
            exp: expiration
        };

        //87 Generamos el token, le pasamos el payload y la clave secreta
        return jwt.encode(payload, secret);

}
//.88 Exportamos y lo importamos en el controllador de user.js
module.exports = {
    createToken,
    secret
}