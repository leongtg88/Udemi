//.151 Importaciones
const validator = require("validator");

//.152  Metodo para validar los datos 
const validate = (params) => {
  //.153 la validacion siempre sera false, a no ser que se cumplan todas las condicones entonces pasara a true
  let validation = false;

  //.154 Validar titulo: 
  let title =
    !validator.isEmpty(params.title) &&
    validator.isLength(params.title, { min: 5, max: 150 }) &&
    validator.isAlpha(params.title, "es-ES");

  //154. Validar contenido

  let content =
    !validator.isEmpty(params.content) &&
    validator.isLength(params.content, { min: 5, max: max }) &&
    validator.isAlpha(params.content.replace(/\s/g, ""), "es-ES");

  
  //155 Comprobar que todo se cumple, si alguno de estos no se valida bien entonces en cualquier de estos casos sacaraia el error.
  if (!title|| !content) {
    throw new Error("No se ha superado la validacion !!");
  } else {
    console.log("Validacion superada!!");
    validation = true;
  }

  return validation;
};

//156.Exportamos el modulo
module.exports = validate;
