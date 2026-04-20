// 39. Importaciones
const express = require("express");
const router = express.Router();
//144. Cargamos el middleware de la autenticacion
const { auth } = require("../middleware/auth");

const ArticleController = require("../controllers/article");



//146. Configuracion de subida de archivos lo pdemos hacer igual que hicimos con los avatares. Podemos tomar el trozo de cofigo de routes/user.js los pasos 128, 129 y 131 y lo pegamos en routes/article.js,


//146 .128.Subida de archivos
const multer = require("multer");

//146 129.Configuracion de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/posters");
  },
  filename: (req, file, cb) => {
    cb(null, "poster-" + Date.now() + "-" + file.originalname);}
});
``
//146 131.Creamos el middleware de multer
const uploadPoster = multer({ storage: storage });


//40.Defino las rutas //145. Añadimos el middleware de autenticacion a las rutas que queremos proteger, en este caso a la ruta de guardar un articulo, ya que solo los usuarios identificados pueden guardar un articulo, por lo que añadimos el middleware auth como segundo parametro despues de la ruta y antes del controlador, ya que el middleware se ejecuta antes que el controlador //185. Añadimos el id en la ruta remove para eliminar un articulo, ya que necesitamos el id del articulo para eliminarlo, por lo que añadimos :id en la ruta y luego lo recogemos en el controlador con req.params.id
router.post("/save", auth, ArticleController.save);
router.get("/list/:page", ArticleController.list);
router.get("/detail/:id", ArticleController.detail);
router.post("/generate-ia", auth, ArticleController.generate);
router.put("/update", auth, ArticleController.update);
router.delete("/remove/:id", auth, ArticleController.remove);
router.get("/by-user/:userId", ArticleController.byUser);
router.get("/search/:search", ArticleController.search);
router.put("/upload", auth, ArticleController.upload);
router.get("/poster/:fill", ArticleController.poster);




//40. Exporto las rutas
module.exports = router;