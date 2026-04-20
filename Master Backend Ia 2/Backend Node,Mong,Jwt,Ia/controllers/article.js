//157.Importaciones
const validate = require("../helpers/validate-article");
//163. Importamos el modelo de articulo para crear objetos de tipo articulo y guardarlos en la base de datos, ya que el modelo de articulo es el que define la estructura de los datos del articulo, por lo que necesitamos el modelo de articulo para crear objetos de tipo articulo y guardarlos en la base de datos.
const Article = require("../models/article");

//36 Acciones

const save = (req, res) => {
  //148. Recoger  los datos del articulo por post
  let body = req.body;

  //149. Validar los datos//158 Validamos pasando el validate(body) dentro de un bloque try catch, ya que el validate lanza un error si la validacion no se supera, por lo que si el validate lanza un error entonces el bloque catch se ejecutara y devolvera una respuesta con el error, y si el validate no lanza un error entonces el bloque try se ejecutara correctamente y se continuara con el codigo siguiente al bloque try catch, por lo que si la validacion se supera entonces se continuara con el codigo siguiente al bloque try catch, y si la validacion no se supera entonces se devolvera una respuesta con el error y no se continuara con el codigo siguiente al bloque try catch
  try {
    validate(body);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Validacion de datos incorrecta",
    });
  }

  //.159 Sacar el id del usuario identificado por el middleware de autenticacion, ya que el articulo tiene que estar relacionado con un usuario, por lo que sacamos el id del usuario identificado con req.user.id, ya que el middleware de autenticacion añade el objeto user al req con los datos del usuario identificado,  y el body del articulo tiene que tener una propiedad user con el id del usuario identificado, por lo que asignamos el id del usuario identificado a body.user, para relacionar el articulo con el usuario identificado.
  let identityId = req.user.id;
  body.user = identityId;
  //160. Crea objeto para articulos
  let articleToSave = new Article(body);

  //161. Guardar el articulo en la base de datos> si utilizamos el metodo save de mongoose, este metodo devuelve una promesa, por lo que podemos utilizar el metodo then para manejar la respuesta de la promesa, y el metodo catch para manejar los errores de la promesa, por lo que si el articulo se guarda correctamente entonces se ejecutara el bloque then y se devolvera una respuesta con el articulo guardado, y si hay un error al guardar el articulo entonces se ejecutara el bloque catch y se devolvera una respuesta con el error.
  articleToSave
    .save()
    .then((article) => {
      if (!article) {
        return res.status(404).json({
          status: "error",
          message: "El articulo no se ha guardado!!",
        });
      }

      //162. Devolver una respuesta
      return res.status(200).json({
        status: "success",
        article: article,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({
        status: "error",
        message: "Error al guardar el articulo",
        error,
      });
    });
};

const list = (req, res) => {
  //164. Sacar el parametro de las rutas, donde tenemos una que se llama page, por lo que sacamos el parametro page de req.params.page, y si no existe entonces asignamos el valor 1 a page, para mostrar la primera pagina de articulos por defecto, ya que el parametro page es opcional en la ruta, por lo que si no se pasa el parametro page entonces se mostrara la primera pagina de articulos por defecto.
  let params = req.params;

  //165. Controlar la pagina en la que estamos, si me llegara params.page, de esta manera consigo asignar el valor de params.page a page, y si no me llegara params.page entonces page se quedaria con el valor 1, para mostrar la primera pagina de articulos por defecto, ya que el parametro page es opcional en la ruta.
  let page = 1;
  if (params.page) {
    page = params.page;
  }

  //166. Configurar la paginacion, cuantos articulos tendre por pagina y creamos un objeto de opciones para la paginacion, donde le pasamos la pagina actual, el limite de articulos por pagina y el orden de los articulos, para mostrar los articulos ordenados por fecha de creacion de forma descendente, ya que el metodo paginate de mongoose necesita un objeto de opciones para configurar la paginacion, y el objeto de opciones tiene que tener la propiedad page con el numero de pagina actual, la propiedad limit con el numero de articulos por pagina y la propiedad sort con el orden de los articulos, para mostrar los articulos ordenados por fecha de creacion de forma descendente utilizamos sort: {create_at: -1}, ya que el campo create_at es el campo de fecha de creacion del articulo, y el valor -1 indica que el orden es descendente, mientras que el valor 1 inidicari que el orden es ascendente.

  let itmesPerPage = 10;

  const options = {
    page: page,
    limit: itmesPerPage,
    sort: { create_at: -1 },
    //174 agregamos la propiedad populate para mostrar los datos del uusuario que ha creado el articulo
    populate: {
      path: "user",
      select: "-password -__v -created_at -email",
    },
  };

  //169. Consultar y listar los articulos(moongose paginate con todas sus opciones)
  Article.paginate({}, options)
    .then((result) => {
      if (!result.docs) {
        return res.status(404).json({
          status: "error",
          message: "No hay articulos para mostrar",
        });
      }

      //170. Devolver resultado
      return res.status(200).json({
        status: "success",
        page,
        itmesPerPage,
        total: result.totalDocs,
        articles: result.docs,
        pages: Math.ceil(result.totalDocs / itmesPerPage),
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Error al listar los articulos",
        error,
      });
    });
};

const detail = (req, res) => {
  //171. Sacar el id del articulo de la url, para sacar el id del articulo de req.params.id, ya que el id del articulo es un parametro de la ruta, por lo que sacamos el id del articulo de req.params.id, para buscar el articulo en la base de datos y mostrar su detalle.
  let Id = req.params.id;

  //172. Buscar el articulo por su id, para buscar el articulo en la base de datos por su id, ya que el metodo findById de mongoose busca un documento en la base de datos por su id, por lo que utilizamos el metodo findById de mongoose
  Article.findById(Id)
    //173. Utilizar el metodo populate de mongoose para mostrar los datos del usuario que ha creado el articulo, ya que el campo user del articulo es un campo de tipo Schema.ObjectId que hace referencia al modelo de usuario, por lo que utilizamos el metodo populate de mongoose para mostrar los datos del usuario que ha creado el articulo, y le pasamos el nombre del campo user para que mongoose sepa que tiene que mostrar los datos del usuario que ha creado el articulo. Utilizamos select para seleccionar los campos que queremos mostrar del usuario, en este caso no queremos mostrar el password, ni el __v, ni el created_at, ni el email, por lo que utilizamos select: "-password -__v -created_at -email" para indicar que no queremos mostrar esos campos del usuario, ya que el metodo populate de mongoose devuelve un objeto con los datos del usuario que ha creado el articulo, y ese objeto tiene los campos password, __v, created_at y email, por lo que utilizamos select para indicar que no queremos mostrar esos campos del usuario.
    .populate({
      path: "user",
      select: "-password -__v -created_at -email",
    })
    .then((article) => {
      if (!article) {
        return res.status(404).json({
          status: "error",
          message: "No se ha encontrado el articulo",
        });
      }

      return res.status(200).json({
        status: "success",
        article: article,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Error al buscar el articulo",
        error,
      });
    });
};





const update = (req, res) => {
    //175 Recoger los datos del body
    let body = req.body;

    // 176 Validar los datos
    try {
        validate(body);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: "Validación del articulo no superada"
        });
    }

    //181 Sacar identidad usuario
    let userIdentity = req.user.id;
    console.log(req.user);
    //182 Buscar el articulo por su id y comprobar que el usuario identificado es el propietario del articulo, para buscar el articulo en la base de datos por su id, y comprobar que el usuario identificado es el propietario del articulo, ya que solo el propietario del articulo puede actualizarlo, por lo que utilizamos el metodo findById de mongoose para buscar el articulo en la base de datos por su id, y luego comprobamos que el campo user del articulo es igual al id del usuario identificado, para comprobar que el usuario identificado es el propietario del articulo, ya que el campo user del articulo es un campo de tipo Schema.ObjectId que hace referencia al modelo de usuario, por lo que el campo user del articulo contiene el id del usuario que ha creado el articulo, por lo que comparamos el campo user del articulo con el id del usuario identificado para comprobar que el usuario identificado es el propietario del articulo.
    Article.findById(body.id).then(article => {
        if (article.user.toString() === userIdentity.toString()) {
            
            //177 Busqueda y actualizacion
            Article.findByIdAndUpdate(body.id, body, { new: true })
                .then(articleUpdated => {
                    if (!articleUpdated) {
                        return res.status(404).json({
                            status: "error",
                            message: "El articulo no existe"
                        });
                    }

                    //178 Devolver un resultado
                    return res.status(200).json({
                        status: "success",
                        article: articleUpdated
                    });
                })
                .catch(error => {
                    return res.status(500).json({
                        status: "error",
                        message: "Error al actualizar articulo"
                    });
                });
        }
    }).catch(error => {
        return res.status(500).json({
            status: "error",
            message: "Error al buscar articulo"
        });
    });
}


const byUser = (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Acción para sacar articulos creados por un usuario",
  });
};

const remove = (req, res) => {
    // 185 Recoger los datos del body
    let id = req.params.id;



    //186 Sacar identidad usuario
    let userIdentity = req.user.id;
    console.log(req.user);
    //187 Buscar el articulo por su id y comprobar que el usuario identificado es el propietario del articulo, para buscar el articulo en la base de datos por su id, y comprobar que el usuario identificado es el propietario del articulo, ya que solo el propietario del articulo puede actualizarlo, por lo que utilizamos el metodo findById de mongoose para buscar el articulo en la base de datos por su id, y luego comprobamos que el campo user del articulo es igual al id del usuario identificado, para comprobar que el usuario identificado es el propietario del articulo, ya que el campo user del articulo es un campo de tipo Schema.ObjectId que hace referencia al modelo de usuario, por lo que el campo user del articulo contiene el id del usuario que ha creado el articulo, por lo que comparamos el campo user del articulo con el id del usuario identificado para comprobar que el usuario identificado es el propietario del articulo.
    Article.findById(id).then(article => {
        if (article.user.toString() === userIdentity.toString()) {
            
            // 188Busqueda y actualizacion
            Article.findByIdAndDelete(id)
                .then(articleDeleted => {
                    if (!articleDeleted) {
                        return res.status(404).json({
                            status: "error",
                            message: "El articulo no existe"
                        });
                    }

                    // Devolver un resultado
                    return res.status(200).json({
                        status: "success",
                        article: articleDeleted
                    });
                })
                .catch(error => {
                    return res.status(500).json({
                        status: "error",
                        message: "Error al actualizar articulo"
                    });
                });
        }
    }).catch(error => {
        return res.status(500).json({
            status: "error",
            message: "Error al buscar articulo"
        });
    });

const search = (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Acción para buscar articulo",
  });
};

const upload = (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Acción para subir articulo",
  });
};

const poster = (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Acción sacar imagen del  articulo",
  });
};

const generate = (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Acción para generar una articulo con IA",
  });
};

// 37. Exportaciones
module.exports = {
  save,
  list,
  detail,
  update,
  generate,
  byUser,
  remove,
  search,
  upload,
  poster,
};
