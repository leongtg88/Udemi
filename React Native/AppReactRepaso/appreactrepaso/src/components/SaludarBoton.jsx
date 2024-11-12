import React from "react";

export default function SaludarBoton (props){
    const {userInfo, saludarFn} = props;
    const {nombre = "Anonimo"} = userInfo;
    return(
        <div>
            <button onClick={()=>   saludarFn(props.userInfo)}>Hola</button>
        </div>
    );
}