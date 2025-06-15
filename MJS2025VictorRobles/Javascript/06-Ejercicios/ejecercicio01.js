/* Ejercicio 1:

Calcula cuantas horas le llevaria llegar a la luna a una nave espacial y guarda el resultado en una variable.

La distancia desde la tierra hasta la luna es de 384.400 kilometros.

La velocidad de la nave es de 1225 kilometros por hora.

*/

const distancia = 384400;
const velo = 1225;

const tiempototal = distancia /  velo;

console.log(`El tiempo que tomo en llegar fue de ${Math.ceil(tiempototal)} horas `);