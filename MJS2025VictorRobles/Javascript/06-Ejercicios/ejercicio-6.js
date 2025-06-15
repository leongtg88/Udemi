/*
Ejercicio 6

En mi tienda de video Juegos tenemos una oferta.

Si compras un juego de 50 euros o mas, te hacemos un 20%de descuento.

Si un cliente compra el Tekken 15 que cuesta 50 euros en cuant se le queda?


const compraJuego = Number;
const aplicaOferta = 50;
const descuento =  compraJuego * 0.20;
const precioconDescuento = compraJuego - descuento; 

const clientOferta = (Number) => {
    if (Number >= 50 ){
        return precioconDescuento;

    } else {
        return compraJuego;
    }
}

console.log(clientOferta(51));
*/
/* Tu código tiene varios problemas de lógica y sintaxis:

compraJuego está definido como el tipo Number y nunca recibe el valor real de la compra.

Calculas descuento y precioconDescuento antes de conocer el precio concreto, usando compraJuego indefinido.

En la función clientOferta, usas el nombre Number como parámetro, lo cual oculta la clase global Number y es confuso.
*/

const clientOferta = (precio) => {
  if (precio >= 50) {
    const descuento = precio * 0.20;
    return precio - descuento;
  }
  return precio;
};

console.log(clientOferta(50)); // 40

/*
como puedo aprenden a identificar bien como definir las variables?
🗒️ Answer
Entiende el propósito de la variable:

Pregúntate qué dato vas a almacenar (números, texto, booleanos, objetos).

Elige la palabra clave adecuada:

Usa const si el valor no cambiará.

Usa let si el valor puede reasignarse.

Evita var en código moderno por su hoisting confuso [1].

Aplica convenciones de nombres:

Usa nombres descriptivos en camelCase (por ejemplo, precioTotal, contadorDeVentas) para mejorar la legibilidad [2].

Considera el ámbito (scope):

Las variables declaradas con let y const son de bloque ({ … }), mientras que var es de función.

Practica con ejemplos reales:

Crea pequeños scripts donde declares variables para almacenar datos de usuarios, precios o conteos.

Revisa la consola y ajusta nombres según su función.

Consulta documentación y tutoriales:

MDN Web Docs y w3schools ofrecen ejercicios y ejemplos interactivos para afianzar conceptos [1] [2].*/