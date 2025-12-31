import { useState } from "react";
import './App.css'; // Asegurate de tener tus estilos aquí 

// 1. Importamos las piezas de nuestro hexágono 
import type { Receta, CategoriaComida} from "./core/domain/Receta";
import { LocalRecetaRepository } from "./infrastructure/local/LocalRecetaRepository"; //->Datos falsos
// import { ApiRecetaRepository } from "./infrastructure/api/ApiRecetaRepository";

// 2. Importamos el componente visual 
import TarjetaComida from "./ui/components/TarjetaComida";

// 3. Importamos imagenes (Vite maneja así los assets)
// Nota: Asegurate de tener estas imágenes en src/assets o usa URLs de internet temporalmente 
import imgDesayuno from "./assets/desayuno.jpg";
import imgAlmuerzo from "./assets/almuerzos.jpg";
import imgCena from "./assets/cenas.jpg";
import imgPostre from "./assets/postres.jpg";

import FormularioReceta from './ui/components/FormularioReceta';
import type { NuevaReceta } from "./core/domain/Receta";

// INSTANCIAMOS EL ADAPTADOR (Aquí enchufamos la "base de datos")
const repositorio = new LocalRecetaRepository(); //-> base de datos fals
// const repositorio = new ApiRecetaRepository();

function App() {
  // 4. ESTADO CON TIPADO
  // En JS: useState(null)
  // En TS: useState<Receta | null>(null) -> "Esto guardará una Receta O nada (null)"    

  const [recetaActual, setRecetaActual] = useState<Receta | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

//----------------------------------------------------------------------//
// Función que conecta el formulario con el repositorio
  const guardarReceta = async (receta: NuevaReceta) => {
    const exito = await repositorio.crear(receta);
    if (exito){
      console.log("¡Se guardó en BD!");
      // Aquí podrías actualizar algo si quieres
    }else{
      alert("Hubo un error al guardar");
    }
  };
//----------------------------------------------------------------------//

  // 5. Función para pedir datos al repositorio
  const manejarSeleccion = async (categoria: CategoriaComida) =>{
    setCargando(true); // Activamos "Cargando..."
    setRecetaActual(null); // Limpiamos la anterior
    
    // ¡Aquí usamos la arquitectura hexágonal!
    // No sabemos si viene de internet o local, solo pedimos "obtenerAleatoria"
    const recetaEncontrada = await repositorio.obtenerAleatoria(categoria);
    setRecetaActual(recetaEncontrada);
    setCargando(false);
  };

  return(
    <div className="contenedor-principal">
      <h1>Recetario</h1>

      {/* SECCIÓN DE TARJETAS */}
      <div className="tarjeta">
        <TarjetaComida 
            titulo="Desayuno" 
            imagenSrc={imgDesayuno} 
            alHacerClick={() => manejarSeleccion('desayuno')} 
        />
        <TarjetaComida 
            titulo="Almuerzo" 
            imagenSrc={imgAlmuerzo} 
            alHacerClick={() => manejarSeleccion('almuerzo')} 
        />
        <TarjetaComida 
            titulo="Cena" 
            imagenSrc={imgCena} 
            alHacerClick={() => manejarSeleccion('cena')} 
        />
        <TarjetaComida 
            titulo="Postre" 
            imagenSrc={imgPostre} 
            alHacerClick={() => manejarSeleccion('postre')} 
        />
      </div>
      {/* SECCIÓN DE RESULTADO (Renderizado condicional)*/}
      <div className="tarjeta-detalle">
        {cargando && <p>⏳ Buscando la mejor receta para ti...</p>}
        {!cargando && recetaActual && (
          <>
          <h2>{recetaActual.titulo}</h2>
          <img src={recetaActual.imagen} alt={recetaActual.titulo} style={{maxWidth: '100%', borderRadius: '10px'}}/>
          <h3>Ingredientes:</h3>
          <ul>
            {/*Ts sabe que 'ingredientes' es un array de strings */}
            {recetaActual.ingredientes.map((ingrediente, index)=>(
              <li key={index}>{ingrediente}</li>
            ))}
          </ul>
          <h3>Preparación:</h3>
          <p>{recetaActual.preparacion}</p>
          </>
        )}
      </div>
      <FormularioReceta alEnviar={guardarReceta}/>
    </div>
  );
}

export default App;