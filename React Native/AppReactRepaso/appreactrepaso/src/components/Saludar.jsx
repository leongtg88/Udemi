import React from "react";



export default function Saludar (props){
console.log(props.userInfo.name);
console.log(props.userInfo.edad);
console.log(props.userInfo.color);
    return(
        <div>
        <p>Hola {props.userInfo.name}, tienes {props.userInfo.edad} y tu color favorito es el {props.userInfo.color}</p>
        </div>
    );
}
/* en este componente se pasan props al app.jsx en donde las propiedades han sido guardadas en un objeto dentro de la variable user*/