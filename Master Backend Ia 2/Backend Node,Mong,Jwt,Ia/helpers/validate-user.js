//53. Importaciones
const validator = require("validator");

//54. Metodo para validar los datos de registro //118.Agreamos un parametro opcional para validar los datos de actualizacion, ya que no es necesario que el usuario actualice todos los datos, sino que solo algunos de ellos, por eso se le añade el ?? para que si no se le pasa un dato entonces se mantenga el dato anterior.
const validate = (params, withPassword = true) => {
  //55. la validacion siempre sera false, a no ser que se cumplan todas las condicones entonces pasara a true
  let validation = false;

  //56. Validar nombre: lel name podemods validarlo con varias cosas, priemro que el espacio no este vacio, aparte que la longitud del nombre tenga un minimo de caracteres y un maximo y comprobamos si es alfavetico y lo comprobamos en español
  let name =
    !validator.isEmpty(params.name) &&
    validator.isLength(params.name, { min: 3, max: 50 }) &&
    validator.isAlpha(params.name, "es-ES");

  //61. Validar apellido

  let surname =
    !validator.isEmpty(params.surname) &&
    validator.isLength(params.surname, { min: 3, max: 50 }) &&
    validator.isAlpha(params.surname.replace(/\s/g, ""), "es-ES");

  //62. Nick
  let nick =
    !validator.isEmpty(params.nick) &&
    validator.isLength(params.nick, { min: 3, max: 60 });

  //63. Email
  let email =
    !validator.isEmpty(params.email) && validator.isEmail(params.email);

  //64.Contraseña  119. Para validar la contraseña en el caso de la actualizacion, si el parametro withPassword es false entonces no se validara la contraseña, ya que no es necesario que el usuario actualice su contraseña cada vez que quiera actualizar sus datos, sino que solo actualice los datos que quiera actualizar, por eso se le añade el ?? para que si no se le pasa un dato entonces se mantenga el dato anterior.
  let password = true;
  if (withPassword) {
    password =
      !validator.isEmpty(params.password) &&
      validator.isLength(params.password, { min: 8, max: 100 });
  }

  //57.65 Comprobar que todo se cumple, si alguno de estos no se valida bien entonces en cualquier de estos casos sacaraia el error.
  if (!name || !surname || !nick || !email || !password) {
    throw new Error("No se ha superado la validacion !!");
  } else {
    console.log("Validacion superada!!");
    validation = true;
  }

  return validation;
};

//58.Exportamos el modulo
module.exports = validate;
