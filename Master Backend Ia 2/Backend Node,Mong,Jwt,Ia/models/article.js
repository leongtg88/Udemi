//46 Importamos Schema de mongoose
const { Schema, model } = require("mongoose");
//167. Importamos el modelo de articulo para utilizar el metodo paginate de mongoose, ya que el metodo paginate es un metodo del modelo de articulo, por lo que necesitamos el modelo de articulo para utilizar el metodo paginate y mostrar los articulos paginados
const mongoosePaginate = require("mongoose-paginate-v2");

//47 Definimos el esquema
const articleSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  //Este es uno de los campos mas importates, va a ser un Schema, esto lo que signiica que hara referencia a otro modelo, es un objeto que hara referencia cuyo nombre es User(o del modelo cuyo nombre es user) estp hace referencia al id del objeto user que defini en mi base de datos,decir yo tengo en mi base de datos un usuario con id 8. Cada usuario guardara sus articulos y cada articulo tendra su Object.Id
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  image: {
    type: String,
    default: "default.png",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

//168. Agregamos el plugin de paginacion al esquema de articulo, para poder utilizar el metodo paginate de mongoose, ya que el metodo paginate es un metodo del modelo de articulo, por lo que necesitamos agregar el plugin de paginacion al esquema de articulo para poder utilizar el metodo paginate y mostrar los articulos paginados
articleSchema.plugin(mongoosePaginate);

// 48. Exportamos el modelo
module.exports = model("Article", articleSchema, "articles");
