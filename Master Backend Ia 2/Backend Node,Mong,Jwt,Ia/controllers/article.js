//Backend Node,Mong,Jwt,Ia\controllers\article.js
//204 Importacion del path de node para trabajar con rutas de archivos
const path = require("path");
//205 Importacion del fs de node para trabajar con archivos
const fs = require("fs");

//157.Importaciones
const validate = require("../helpers/validate-article");
//163. Importamos el modelo de articulo para crear objetos de tipo articulo y guardarlos en la base de datos, ya que el modelo de articulo es el que define la estructura de los datos del articulo, por lo que necesitamos el modelo de articulo para crear objetos de tipo articulo y guardarlos en la base de datos.
const Article = require("../models/article");
//209. Importamos del arhcivo dotenv el valor de la clave OPENAI_API_KEY para poder utilizar la api de openai en el metodo generate,
const dotenv = require("dotenv");
//210. Importamos el cliente de openai para poder utilizar la api de openai en el metodo generate, para eso importamos la clase OpenAIApi del paquete openai,
const OpenAI = require("openai");

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
      message: "Validación del articulo no superada",
    });
  }

  //181 Sacar identidad usuario
  let userIdentity = req.user.id;
  console.log(req.user);
  //182 Buscar el articulo por su id y comprobar que el usuario identificado es el propietario del articulo, para buscar el articulo en la base de datos por su id, y comprobar que el usuario identificado es el propietario del articulo, ya que solo el propietario del articulo puede actualizarlo, por lo que utilizamos el metodo findById de mongoose para buscar el articulo en la base de datos por su id, y luego comprobamos que el campo user del articulo es igual al id del usuario identificado, para comprobar que el usuario identificado es el propietario del articulo, ya que el campo user del articulo es un campo de tipo Schema.ObjectId que hace referencia al modelo de usuario, por lo que el campo user del articulo contiene el id del usuario que ha creado el articulo, por lo que comparamos el campo user del articulo con el id del usuario identificado para comprobar que el usuario identificado es el propietario del articulo.
  Article.findById(body.id)
    .then((article) => {
      if (article.user.toString() === userIdentity.toString()) {
        //177 Busqueda y actualizacion
        Article.findByIdAndUpdate(body.id, body, { new: true })
          .then((articleUpdated) => {
            if (!articleUpdated) {
              return res.status(404).json({
                status: "error",
                message: "El articulo no existe",
              });
            }

            //178 Devolver un resultado
            return res.status(200).json({
              status: "success",
              article: articleUpdated,
            });
          })
          .catch((error) => {
            return res.status(500).json({
              status: "error",
              message: "Error al actualizar articulo",
            });
          });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        message: "Error al buscar articulo",
      });
    });
};

const byUser = (req, res) => {
  //.190 Sacar el parametro de las rutas, por lo que sacamos el parametro page de req.params. y si no existe entonces asignamos el valor 1 a , para mostrar la primera pagina de articulos por defecto, ya que el parametro page es opcional en la ruta, por lo que si no se pasa el parametro page entonces se mostrara la primera pagina de articulos por defecto.
  let params = req.params;

  //191. Controlar la pagina en la que estamos, si me llegara params.page, de esta manera consigo asignar el valor de params.page a page, y si no me llegara params.page entonces page se quedaria con el valor 1, para mostrar la primera pagina de articulos por defecto, ya que el parametro page es opcional en la ruta.
  let page = 1;
  if (params.page) {
    page = params.page;
  }

  //192. Configurar la paginacion, cuantos articulos tendre por pagina y creamos un objeto de opciones para la paginacion, donde le pasamos la pagina actual, el limite de articulos por pagina y el orden de los articulos, para mostrar los articulos ordenados por fecha de creacion de forma descendente, ya que el metodo paginate de mongoose necesita un objeto de opciones para configurar la paginacion, y el objeto de opciones tiene que tener la propiedad page con el numero de pagina actual, la propiedad limit con el numero de articulos por pagina y la propiedad sort con el orden de los articulos, para mostrar los articulos ordenados por fecha de creacion de forma descendente utilizamos sort: {create_at: -1}, ya que el campo create_at es el campo de fecha de creacion del articulo, y el valor -1 indica que el orden es descendente, mientras que el valor 1 inidicari que el orden es ascendente.

  let itmesPerPage = 10;

  const options = {
    page: page,
    limit: itmesPerPage,
    sort: { create_at: -1 },
    // agregamos la propiedad populate para mostrar los datos del uusuario que ha creado el articulo
    populate: {
      path: "user",
      select: "-password -__v -created_at -email",
    },
  };

  //193. Consultar y listar los articulos(moongose paginate con todas sus opciones) e incluimos {user: req.params. userId} lo pasamos en el primer  parametro que tenga un onjeto para hacer condiciones, cuyo user sea igual a  {user: req.params.userId} y asi saca todos los resultados posibles
  Article.paginate({ user: req.params.userId }, options)
    .then((result) => {
      if (!result.docs) {
        return res.status(404).json({
          status: "error",
          message: "No hay articulos para mostrar",
        });
      }

      //. Devolver resultado
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

const remove = (req, res) => {
  // 185 Recoger los datos del body
  let id = req.params.id;

  //186 Sacar identidad usuario
  let userIdentity = req.user.id;
  console.log(req.user);
  //187 Buscar el articulo por su id y comprobar que el usuario identificado es el propietario del articulo, para buscar el articulo en la base de datos por su id, y comprobar que el usuario identificado es el propietario del articulo, ya que solo el propietario del articulo puede actualizarlo, por lo que utilizamos el metodo findById de mongoose para buscar el articulo en la base de datos por su id, y luego comprobamos que el campo user del articulo es igual al id del usuario identificado, para comprobar que el usuario identificado es el propietario del articulo, ya que el campo user del articulo es un campo de tipo Schema.ObjectId que hace referencia al modelo de usuario, por lo que el campo user del articulo contiene el id del usuario que ha creado el articulo, por lo que comparamos el campo user del articulo con el id del usuario identificado para comprobar que el usuario identificado es el propietario del articulo.
  Article.findById(id)
    .then((article) => {
      if (article.user.toString() === userIdentity.toString()) {
        // 188Busqueda y actualizacion
        Article.findByIdAndDelete(id)
          .then((articleDeleted) => {
            if (!articleDeleted) {
              return res.status(404).json({
                status: "error",
                message: "El articulo no existe",
              });
            }

            // Devolver un resultado
            return res.status(200).json({
              status: "success",
              article: articleDeleted,
            });
          })
          .catch((error) => {
            return res.status(500).json({
              status: "error",
              message: "Error al actualizar articulo",
            });
          });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        message: "Error al buscar articulo",
      });
    });
};

const search = (req, res) => {
  //195 Recogemos el parametro de la url y creamos el Article.find en el que podemos meter un objeto y meter diferentes condiciones como un or lo que hace equivalente a sql or content lo que sea, que el title tenga unos parametros, que el string contenga el texto que envio, al final es una busqueda por expresion regular y lo mismo vamos a hacr con el contenido. Luego hacemos un sort para ordenarlo descendete y se recogen los articulos con el then y dentro del callback devolvemos los resultados
  let searchString = req.params.search;

  Article.find({
    $or: [
      { title: { $regex: searchjString, $options: "i" } },
      { content: { $regex: searchjString, $options: "i" } },
    ],
  })
    .sort({ created_at: -1 })
    .them((articles) => {
      //196
      if (!article) {
        return res.status(404).json({
          status: "error",
          message: "No hay articulos que coincidan con tu busqueda",
        });
      }

      return res.status(200).json({
        status: "Success",
        articles,
      });
    });
};
//197. En el paso 197 vamos a tomar el metodo de upload de controllers/user.js y lo vamos a pegar en controllers/article.js, ya que el metodo de upload de controllers/user.js es un metodo para subir archivos, y el metodo de upload de controllers/article.js es un metodo para subir archivos, por lo que podemos utilizar el mismo metodo de upload para subir archivos tanto en controllers/user.js como en controllers/article.js, ya que el proceso de subida de archivos es el mismo tanto para los avatares de los usuarios como para las imagenes de los articulos, por lo que podemos reutilizar el mismo codigo para subir archivos tanto en controllers/user.js como en controllers/article.js, y luego lo que cambia es la configuracion de multer en routes/user.js y routes/article.js, ya que la configuracion de multer es diferente para los avatares de los usuarios y para las imagenes de los articulos, por lo que tenemos que configurar multer de manera diferente en routes/user.js y routes/article.js, pero el proceso de subida de archivos es el mismo tanto para los avatares de los usuarios como para las imagenes de los articulos
const upload = async (req, res) => {
  //198 .Recoger el id del usuario identificado
  const userId = req.user.id;
  const articleId = req.body.id;

  //199.Recoger el fichero de la peticion
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "La peticion no incluye la imagen del articulo ",
    });
  }
  //. Sacar el npmbre del archivo
  try {
    //. Sacar el nombre del archivo procesado por multer
    const { originalname, filename, path: filePath } = req.file;

    // Sacar la extension del archivo
    const ext = path.extname(originalname).toLocaleLowerCase();
    const validExtensions = [".png", ".jpg", ".jpeg", ".gif"];
    if (!validExtensions.includes(ext)) {
      //200. Si la extensión no es válida, eliminamos el archivo subido
      fs.unlinkSync(filePath);

      return res.status(400).json({
        status: "error",
        message:
          "Archivo no válido. Solo se permiten imágenes (png, jpg, jpeg, gif).",
      });
    }

    //202 Aqui comprobamos que el usuario identificado es el propietario del arcitulo, para eso buscamos el articulo en la base de datos por su id, y comprobamos que el campo user del articulo es igual al id del usuario identificado
    const article = await Article.findById(articleId);
    if (!article) {
      // Si el artículo no existe, eliminamos el archivo subido
      fs.unlinkSync(filePath);
      return res.status(404).json({
        status: "error",
        message: "Artículo no encontrado",
      });
    }
    if (article.user.toString() !== userId.toString()) {
      return res.status(400).json({
        status: "error",
        message: "No tienes permiso para actualizar la imagen de este artículo",
      });
    }

    //201 Si todo va bien buscamos y actualizamos el articulo en la base de datos, para eso usamos el metodo findOneAndUpdate de mongoose y le pasamos el id del usuario identificado que queremos actualizar, el objeto con los datos nuevos que queremos actualizar y el parametro new: true para que nos devuelva el nuevo articulo actualizado, si todo va bien entonces devolvemos la respuesta con el articulo actualizado y si no todo va bien entonces devolvemos un error.
    const articleUpdated = await Article.findByIdAndUpdate(
      articleId,
      { image: filename },
      { new: true, select: "-password" },
    );
    if (!articleUpdated) {
      return res.status(404).json({
        status: "error",
        message: "Error al actualizar el articulo",
      });
    }

    return res.status(200).json({
      status: "success",
      article: articleUpdated,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error al  actualizar el articulo ",
      error: error.message,
    });
  }
};

const poster = (req, res) => {
  //. Vamos a recibir un fichero por la url, es decir, el nombre del archivo de avatar que queremos sacar, para eso usamos el metodo get de express y le pasamos el nombre del archivo por la url, para eso usamos el parametro :filename en la ruta, y luego en este metodo avatar recogemos ese parametro con req.params.filename para poder sacar el archivo de avatar que queremos sacar.
  let filename = req.params.file;
  let filePath = "./uploads/posters/" + file;

  fs.stat(filePath, (err, exists) => {
    if (err || !exists) {
      return res.sendFile(path.resolve)(filePath);
    } else {
      return res.status(404).json({
        status: "error",
        message: "El la imagen no existe",
      });
    }
  });
};

//212. cargamos la confg de dotenv
dotenv.config();

//211 Hacemos la conexion de openai
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generate = async (req, res) => {
  //214 Recibir theme del arituclo por la url, para eso usamos el parametro :theme en la ruta, y luego en este metodo generate recogemos ese parametro con req.params.theme para poder generar el articulo con ese tema.
  const { theme } = req.params;

  //215 Vamos a generar el prompt que uno sera del sistema y el otro del usuario

  //215.1 Prompt del sistema

  const promptSystem = `
  
  Eres un generador de articulos de${theme}, el usuario te va a pedir que redactes un artiuclo (titulo y texto para el contenido solo debes responder con un articulo al tema que te pida el usuario, cualquier otra conversacion o respuesta esta prohibida, solo debes responder con el articulo solicitado por el usuario) El fomrato de salida del articulo debe ser el siguiente (un objeto json): 
  
  {
  
  "title": "Aqui el titulo",
  "content": "Aqui el contenido del articulo"
  
  }

  El titulo debe tener maximo 120 caracteres, el contenido debe tener maximo 1000 caracters.
  
  `;

  //215.2 Prompt del usuario
  const promptUser = "Necesito que redactes un articulo de " + theme;

  //216 Llamar al modelo de openai
  try {
    //llamada
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano-2025-08-07",
      messages: [
        { role: "system", content: promptSystem },
        { role: "user", content: promptUser },
      ],
      max_tokens: 700,
      reponse_format: {
        type: "json_object",
      },
    });

    //217 Recoger el resultado
    const articleObject = JSON.parse(completion.choices[0].message.content);

    //218 Sacar id de usuario identificado
    let identityId = req.user.id;
    articleObject.user = identityId;
    //.219 Crea objeto para articulos
    let articleToSave = new Article(articleObject);

    //220. Guardar el articulo en la base de datos
    articleToSave.save().then((article) => {
      
      if (!article) {
        return res.status(404).json({
          status: "error",
          message: "El articulo no se ha guardado!!",
        });
      }

      //221. Devolver una respuesta
      return res.status(200).json({
        status: "success",
        article: article,
      });
    });
    //

    //Guardar el articulo en la base de datos (metodo save)

    //Devolver un resultado
    return res.status(200).json({
      status: "success",
      message: "Acción para generar una articulo con IA",
      completion,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error al generar el articulo",
    });
  }

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
