//97.Importamos modulos
const jwt = require("jwt-simple");

//98. Importamos la clave secreta
const { secret } = require("../helpers/jwt");

//93.Middleware de autenticacion: vamos a terner en la funcion un require, response y un next que es una funcion que me permite pasar luegoa la accion del controlador.
exports.auth = (req, res, next) => {
  //Prueba realizada ene el paso 93: console.log("Hola, acabo de ejecutar el meddlaware de autenticacion");

  // 99.Comprobar si me llega la cabecera de autenticacion
  if (!req.headers.authorization) {
    return res.status(404).json({
      status: "error",
      message: "La peticion no tiene la cabecera de autenticacion",
    });
  }

  // 100.Limpiar el token
  let token = req.headers.authorization.replace(/['"]+/g, "");

  // 101. Decodificar el token
  try {
    //102.Podemos decodificar el token con la variable payload, le pasamos el token que llega de los header y la clave secret, si pasa bien entonces el payload es correcto.
    let payload = jwt.decode(token, secret);

    //103. Comprobacion del payload
    console.log(payload);

    //106.Comprobar la expiracion del token: comprobamos si el payload actual es menor o igual a la fecha unix
    let now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return res.status(404).json({
        status: "error",
        message: "Token caducado",
      });
    }

    //104. Añadir los datos del usuario a la request
    req.user = payload;

    // Pasar a la accion
    //96.olocamos la funcon next() en auth.jspara que el middleware termine de funcionar para que actualice la pantalla y podremos ver en la terminal que cada vez que ejecutmos el localhost se va a registrar el middleware.
    next();
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: "Token invalido",
    });
  }
};
