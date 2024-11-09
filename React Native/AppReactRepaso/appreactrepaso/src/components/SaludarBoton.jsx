import React from "react";

export default function SaludarBoton (props){

    const saludar = () =>{
        alert("Hola Leon Gustavo Trujillo");
    }
    return(
        <div>
            <button onClick={saludar}>Hola</button>
        </div>
    );
}