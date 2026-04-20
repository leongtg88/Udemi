console.log("Archivo index.js cargado:", new Date().toLocaleTimeString());

// 14.Importar dependencias
const express = require("express");
const cors = require("cors");

//19.Conectarme a la bd
const connection = require("./database/conecction");

// 20.Crear el servidor de node
const app = express();
const port = 3907;

//21. Configurar el cors
app.use(cors());

//22. Converir los datos del body a objetos de js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//34. Cargar configuracion de rutas
const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/article");
app.use("/api/user", userRoutes);
app.use("/api/article", articleRoutes);

//23 Ruta de prueba
app.get("/api/pruebitas", (req, res) => {
  return res.status(200).json({
    titulo: "Man to the moon",
    descripcion: "Plicula de Jim Carrey",
  });
});

//24.Poner el sevidor a escuchar peticiones http
// Conectar a la base de datos y, si tiene éxito, iniciar el servidor
connection()
  .then(() => {
    // Iniciar servidor solo si la conexión a la BD es exitosa
    app.listen(port, () => {
      console.log("Servidor de node escuchando en el puerto: " + port);
    });
  })
  .catch((error) => {
    console.error(
      "Error al conectar a la base de datos, el servidor no se ha iniciado.",
      error,
    );
  });
