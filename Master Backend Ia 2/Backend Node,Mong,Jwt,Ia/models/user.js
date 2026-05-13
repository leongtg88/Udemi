//Backend Node,Mong,Jwt,Ia\models\user.js

// 42. Importaciones de mongoose
const { Schema, model} = require("mongoose");



// 43. Definicion del esquema
const UserSchema = Schema({
    //Empezano por el nombre, le ponemos el tipo de valor en este caso para guardar el nombre y si es un campo requerido.
    name : { type : String, required: true},
    surname : { type: String, required: true},
    nick : { type: String, required: true},
    email : {type: String, required: true},
    //El campo no va a ser requerido pero tendra una imagen
    avatar : {type: String, default: "default.png"},
    bio : {type: String },
    password : { type : String, required: true},
    // En la fecha, no se la voy a madar por lo que automanticamente, mongdb me lo guardara
    created_at: {type: Date, default: Date.now},
    });



//44. Exportar modelo
module.exports = model("User", UserSchema, "users");