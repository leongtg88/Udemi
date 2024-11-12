
import reactLogo from './assets/react.svg'
import './App.css'
import Saludar from './components/Saludar';
import SaludarBoton from './components/SaludarBoton';

function App() {
  
  const userName = "Leon Trujillo";
  const edad= "32";

  const user ={

    
    edad: 26,
    color: "azul"
  }

  const saludarFn = (nombre, edad) => {
    console.log("Hola " + nombre + "tiene" + edad +" años."  );
  };

  return (
  <>

      <div>
        <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <Saludar userInfo={user}/>
        <SaludarBoton  userInfo = {user} saludarFn = {saludarFn} />
      </div>
      <h1>React</h1>

  </>
  )
}

export default App
