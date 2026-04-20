//16.Importar la dependencia de mongoose
const mongoose = require('mongoose');

//17.Conectarnos a la base de datos
const connection = async () => {
//Comentario del paso 17: esta conexion es suceptible a errores, por lo que se recomienda usar un bloque try catch para manejar los errores de conexion. Si todo va bien, usamos una await para esperar que se establezca la conexion a la base de datos, y luego imprimimos un mensaje de exito. Si ocurre un error, lo capturamos en el bloque catch y lo imprimimos en la consola, ademas de lanzar un nuevo error para que pueda ser manejado por quien llame a esta funcion.
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/bd-log");
        console.log("Conectado a la base de datos");

    } catch(error) {
        console.error('Error connecting to MongoDB:', error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}

//18.Exportar la funcion de conexion para que pueda ser usada en otros archivos
module.exports = connection;