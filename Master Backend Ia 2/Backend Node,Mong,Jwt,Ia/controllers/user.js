
//Backend Node,Mong,Jwt,Ia\controllers\user.js
//138. Importamos el modulo path de node para poder trabajar con las rutas de los archivos, como por ejemplo, para sacar la extension de un archivo, para construir la ruta de un archivo, etc.
const path = require("path");
const fs = require("fs");

//58. Importaciones
const validate = require("../helpers/validate-user");
//66 Importamos nuestro modelo de usuario para poder ingresar a la base de datos
const User = require("../models/user");
// 69. Importamos la libreria bcrypt para poder hashear las contraseñas
const bcrypt = require("bcryptjs");
//88. Importamos el helper jwt
const jwt = require("../helpers/jwt");
const user = require("../models/user");

//27. Acciones
const register = (req, res) => {
  //51.1 Recoger los datos de la peticion,creamos una variable que se llama body este y hacemos el req.boy para recoger los datos de la peticion, lo que me envie el usuario por un formulario o por donde sea y este body lo puedo enviar como data en la respuesta que doy en el metodo( en el return)
  let body = req.body;

  // 52.60  Validar los datos creaion de folder helper.
  try {
    validate(body);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Validacion deusuario no superada",
      data: body,
    });
  }

  //67. Control de usuarios duplicados
  User.find({
    $or: [
      { email: body.email.toLowerCase() },
      { nick: body.nick.toLowerCase() },
    ],
  })
    .then(async (users) => {
      if (users && users.length >= 1) {
        return res.status(400).json({
          status: "error",
          message: "El usuario ya existe !!",
        });
      }

      //70. Cifrar la contraseña
      let password = await bcrypt.hash(body.password, 10);
      //71. pasamos la password cifrada al body para que se guarde en la base de datos y la sobreescribimos sobre la password que habiamos genereado
      body.password = password;

      //72.Creamos el objeto de usuario para poder guardarlo, pero lo pasamos a miniusculas primero
      body.email = body.email.toLowerCase();
      body.nick = body.nick.toLowerCase();

      let userToSave = new User(body);

      //74. Guardar el usuario en la base de datos:
      userToSave
        .save()
        .then((userSaved) => {
          if (!userSaved) {
            //77.error
            return res.status(500).json({
              status: "error",
              message: "El usuario no ha sido guardado correctamente",
            });
          }

          //76.Quitar contraseña antes de devolver el usuario
          const userCleaned = userSaved.toObject();
          delete userCleaned.password;

          //75.Se devuelve respuesta de usuario guardado
          return res.status(200).json({
            status: "success",
            user: userCleaned,
          });
        })
        .catch((error) => {
          //76.error
          return res.status(500).json({
            status: "error",
            message: "Error al guardar el usuario",
          });
        });

      //. Devolver la respuesta

      //27-51.1 se usan en un mismo punto, es decir, en el punto 27 para hacer el return y en el 56 para devolver la respuesta, el return es el inicio de la funcion del register, pero posteriormente estaremos uncluyendo encima del mismo para que el metodo registro funcionem para eso veremos la numeracion a parir del numero 51. Y en el paso 74-75 este return es comentado.

      //return res.status(200).json({
      //status: 200,
      //message: "Acción para registrar usuario",
      //51.2 el body que instanciamos en el punto 52.1 lo pasamos en este metodo para recoger los datos de la petcion con un objeto json con los datos que me envia el cliente
      //body: req.body,
      //
      //});

      //73. Aqui creamor el catch, para capturar un posible error en el find
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Error en la consutla de usuario duplicado",
      });
    });
};

const login = (req, res) => {
  //77. Recoger los datos del body: aqui recogemos los datos que me envie los usarios o la pection que me haga el cliente que sea
  let body = req.body;

  // 78.Comprobar que me llega bien: Si no me llega el body.email o si no me llega el body.password entonces voy a devilver un error
  if (!body.email || !body.password) {
    return res.status(400).json({
      status: "error",
      message: "Falatn datos por enviar",
    });
  }

  //79. Comprobar que el usuario existe: comprobamos si realmente existe ese usuario
  User.findOne({
    email: body.email.toLowerCase(),
  })
    .then((user) => {
      //79. Comprobrar la contraseña
      let pwd = bcrypt.compareSync(body.password, user.password);

      if (!pwd) {
        return res.status(400).json({
          status: "error",
          message: "Contraseña incorrecta",
        });
      }

      //89. Creo el token jwt
      let token = jwt.createToken(user);

      //80. Devuelvo el resultado
      return res.status(200).json({
        status: "success",
        user: {
          _id: user._id,
          nick: user.nick,
          email: user.email,
        },
        token: token,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Error al buscar al usuario",
      });
    });
};

const profile = (req, res) => {
  //107. En este metodo vamos a recibir el id del usuario por la url, es decir, por los parametros de la url  por getque tenemos routes/user.js Incluimos el id del usuario para poder sacar su perfil.
  let id = req.params.id;

  //108.Buscamos dentro de la coleccion de usuarios el id que nos lega por la url, es decir, el id del usuario que queremos sacar su perfil, para eso usamos el metodo findById de mongoose y le pasamos el id que nos llega por la url, si lo encuentra entonces devuelve el usuario y si no lo encuentra devuelve un error.
  User.findById(id)
    .select({
      password: 0, // Excluimos la contraseña de la respuesta
      created_at: 0, // Excluimos la fecha de creación de la respuesta
    })
    .then((myUser) => {
      //110. Si el usuario existe entonces devolvemos su perfil
      if (!myUser) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado",
        });
      }
      //111. Si todo va bien entonces devolvemos el perfil del usuario
      return res.status(200).json({
        status: 200,
        user: myUser,
      });

      //     return res.status(200).json({
      //      status: 200,
      //      message: "Acción para ver los datos del perfil de un usuario",
      //      107.1 Devolvemos el id del usuario que recibimos por la url para comprobar que nos llega bien
      //       id,

      //109 Si el usuario no existe entonces devolvemos un error
    })
    .catch((error) => {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    });
};

const update = async (req, res) => {
  //114. Metemos toda la logica de actualizar el usuario dentro de un try catch para poder capturar cualquier error que pueda surgir en el proceso de actualizar el usuario, como por ejemplo, si el usuario no existe, si los datos no son validos, etc.
  try {
    //115.Conseguir el id del usuario identificado
    const userIdentity = req.user;

    //116.Crear objeto con datos nuevos //122 incluimos el tolowerCase para que el usuario pueda actualizar su email o su nick por uno nuevo pero que se guarde en minusculas, y el ?? para que si el usuario no actualiza un dato entonces se mantenga el dato anterior, es decir, si el usuario no actualiza su nombre entonces se mantenga el nombre anterior, si no actualiza su apellido entonces se mantenga el apellido anterior, etc.
    let userToUpdate = {
      name: req.body.name ?? userIdentity.name,
      surname: req.body.surname ?? userIdentity.surname,
      nick: req.body.nick.toLowerCase() ?? userIdentity.nick,
      email: req.body.email.toLowerCase() ?? userIdentity.email,
      bio: req.body.bio ?? userIdentity.bio,
    };

    //117.Validar los datos //118. Para validar los datos de actualizacion le pasamos el parametro opcional conPassword a false, ya que no es necesario que el usuario actualice su contraseña cada vez que quiera actualizar sus datos, sino que solo actualice los datos que quiera actualizar, por eso se le pasa el false para que no valide la contraseña, y si el usuario no actualiza la contraseña entonces se mantenga la contraseña anterior.
    validate(userToUpdate, false);

    //120.Buscar si el usuario ya existe en la bd
    const user = await User.find({
      $or: [
        { email: userToUpdate.email.toLowerCase() },
        { nick: userToUpdate.nick.toLowerCase() },
      ],
    });

    //121. Recorrer y comprobar el usuario: si el userToString es diferente al userIdentity._id entonces ese usuario existe y no se puede actualizar, ya que el email y el nick deben ser unicos, por eso se hace esta comprobacion para evitar que el usuario pueda actualizar su email o su nick por uno que ya exista en la base de datos, pero si es el mismo entonces podemos actualizar  En el caso que sea diferente vamos a devolver un 404
    const userExist = user.some(
      (user) => user._id.toString() !== userIdentity._id.toString());

    //122 Actualizar el usuario en la base de datos y control de usuario duplicado: si el userExist es true entonces ese usuario ya existe y no se puede actualizar, por eso se devuelve un error, pero si el userExist es false entonces podemos actualizar el usuario, para eso usamos el metodo findOneAndUpdate de mongoose y le pasamos el id del usuario identificado que queremos actualizar, el objeto con los datos nuevos que queremos actualizar y el parametro new: true para que nos devuelva el usuario actualizado, si todo va bien entonces devolvemos la respuesta con el usuario actualizado y si no todo va bien entonces devolvemos un error.
    if (userExist) {
      return res.status(404).json({
        status: "error",
        message: "El usuario ya existe !!",
      });
    } 

    //123.Actualizamr el usuaruio en la base de datos, vamos a pasarle el id del usuario identificado que queremos actualizar, el objeto con los datos nuevos que queremos actualizar y el parametro new: true para que nos devuelva el  nuevo usuario actualizado, si todo va bien entonces devolvemos la respuesta con el usuario actualizado y si no todo va bien entonces devolvemos un error.
    const userUpdated = await User.findByIdAndUpdate(
      { _id: userIdentity._id },
      userToUpdate,
      { new: true, select: "-password" }
    );
if (!userUpdated) {
      return res.status(404).json({
        status: "error",
        message: "Error al actualizar el usuario",
      });
    }
    
//124. Devolver respuesta
    return res.status(200).json({
      status: "success",
      user: userUpdated,
  
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar el usuario",
    });
  }
};
//136.Incluimos el metodo await para esperar a que se procese el archivo que se le envia en la peticion, ya que multer procesa el archivo de forma asincrona, por eso se le incluye el await para esperar a que se procese el archivo antes de continuar con el resto del codigo, y asi poder sacar el nombre del archivo procesado por multer y guardarlo en la base de datos o hacer lo que sea necesario con ese archivo.
const upload = async (req, res) => {

  //133.Recoger el id del usuario identificado
  const userId = req.user.id;

  //134.Recoger el fichero de la peticion
  if(!req.file){
    return res.status(400).json({
      status: "error",
      message: "No se ha subido ningun archivo",
    });
  }
//135. Sacar el npmbre del archivo
  try{

    //137. Sacar el nombre del archivo procesado por multer
    const { originalname, filename, path: filePath} = req.file;

    //138 Sacar la extension del archivo
    const ext = path.extname(originalname).toLocaleLowerCase();
    const validExtensions = [".png", ".jpg", ".jpeg", ".gif"];
    if (!validExtensions.includes(ext)) {
      //139. Si la extensión no es válida, eliminamos el archivo subido
      fs.unlinkSync(filePath);
      return res.status(400).json({
        status: "error",
        message: "Archivo no válido. Solo se permiten imágenes (png, jpg, jpeg, gif).",
      });
    }
    
    //140.Si todo va bien buscamos y actualizamos el usuario en la base de datos, para eso usamos el metodo findOneAndUpdate de mongoose y le pasamos el id del usuario identificado que queremos actualizar, el objeto con los datos nuevos que queremos actualizar y el parametro new: true para que nos devuelva el nuevo usuario actualizado, si todo va bien entonces devolvemos la respuesta con el usuario actualizado y si no todo va bien entonces devolvemos un error.
    const userUpdated = await User.findByIdAndUpdate(
      id,
      { avatar: filename },
      { new: true, select: "-password" }
    );
    if (!userUpdated) { 
      return res.status(404).json({
        status: "error",
        message: "Error al actualizar el usuario",
      });
    }

    return res.status(200).json({
      status: "success",
      user: userUpdated,
    });
  } catch (error) {  console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Error al  actualizar el usuario ",
        error: error.message
      });
    };
};


const avatar = (req, res) => {

  //142. Vamos a recibir un fichero por la url, es decir, el nombre del archivo de avatar que queremos sacar, para eso usamos el metodo get de express y le pasamos el nombre del archivo por la url, para eso usamos el parametro :filename en la ruta, y luego en este metodo avatar recogemos ese parametro con req.params.filename para poder sacar el archivo de avatar que queremos sacar.
  let filename = req.params.file;
  let filePath = "./uploads/avatars/" + file;  

  fs.stat(filePath, (err, exists) => {
    if (err || !exists) {
      return res.sendFile(path.resolve)(filePath);
    
    }else{
      return res.status(404).json({
        status: "error",
        message: "El la imagen no existe",
      });       
    }
  

  });
};

//90. Creamos un metodo para probar la autenticacion
const soloParaUsuariosIdentificados = (req, res) => {
  return res.status(200).json({
    status: "success",
    message:
      "Tienes acceso a esta seccion porque estas correctamente identificado",
    //105. Dentro de mi metodo colocamos la propiedad datosDelUsuario
    datosDelUsuario: req.user,
  });
};

// 29.Exportaciones
module.exports = {
  register,
  login,
  profile,
  update,
  upload,
  avatar,
  soloParaUsuariosIdentificados,
};
