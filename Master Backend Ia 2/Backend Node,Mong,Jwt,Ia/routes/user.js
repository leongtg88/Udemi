// 31. Importaciones
const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");
//94.Importamos metodo para usar el middleware // 143. La tomamos para llevarlo a rotutes y lo llvamos a routes articles.js 
const { auth } = require("../middleware/auth");


//128.Subida de archivos
const multer = require("multer");

//129.Configuracion de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, "avatar-" + Date.now() + "-" + file.originalname);}
});

//131.Creamos el middleware de multer
const uploadAvatar = multer({ storage: storage });

//32 .Definir las rutas, se usa el metodo que se necesite, get, put, post, adentro tiene el nombre de la ruta, luego un midleware que se ejecute.
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", UserController.profile);
router.put("/update", UserController.update);
//127. Se añade el auth para que solo los usuarios identificados puedan subir su avatar, ya que si no se le añade el auth cualquier usuario podria subir un avatar a cualquier usuario //131 se incluye l metodo uploadAvatar.single("file0" que me permite indicarle el liunk de los archivos que vamos a mandarle para que multer se encargue de procesar el archivo que se le envia en la peticion, el nombre del campo del archivo debe ser "file" para que multer lo reconozca y lo procese correctamente. //141. Como ya no estamos usando el id lo quitamos ya que esta dentro de auth y lo podemos sacar de ahi, por lo que quitamos el id de la ruta y lo quitamos del controlador, ya que el id lo vamos a sacar del token que se le pasa al middleware auth, por lo que el id lo vamos a sacar del req.user que es donde auth guarda los datos del usuario identificado, por lo que ya no necesitamos el id en la ruta ni en el controlador.
router.put("/upload", [auth, uploadAvatar.single("file0")], UserController.upload);
router.get("/avatar/:filename", UserController.avatar);
//91. Creamos la ruta para probar la autenticacion de los usuarios identificados // 95 se añade un segundo paramatro despues de la primera (,)  y le pasamos el auth  
router.get("/solo-para-identificados", [auth], UserController.soloParaUsuariosIdentificados);
//
//
//33.Exportar las rutas
module.exports = router;
