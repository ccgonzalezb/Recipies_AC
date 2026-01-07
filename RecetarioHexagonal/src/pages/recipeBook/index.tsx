//import { useState } from "react";

// 1. Importamos las piezas de nuestro hexágono 
//import type { Receta, CategoriaComida} from "../../core/domain/Receta";
//import { LocalRecetaRepository } from "../../infrastructure/local/LocalRecetaRepository"; //->Datos falsos
// import { ApiRecetaRepository } from "./infrastructure/api/ApiRecetaRepository";
import {useRecipeBook} from './hooks'

// 2. Importamos el componente visual 
import TarjetaComida from "../../ui/components/TarjetaComida";
import FormularioReceta from '../../ui/components/FormularioReceta';

// 3. Importamos imagenes (Vite maneja así los assets)
// Nota: Asegurate de tener estas imágenes en src/assets o usa URLs de internet temporalmente 
import imgDesayuno from "/img/desayuno.jpg";
import imgAlmuerzo from "/img/almuerzos.jpg";
import imgCena from "/img/cenas.jpg";
import imgPostre from "/img/postres.jpg";

//import type { NuevaReceta } from "../../core/domain/Receta";

// INSTANCIAMOS EL ADAPTADOR (Aquí enchufamos la "base de datos")
//const repositorio = new LocalRecetaRepository(); //-> base de datos fals
// const repositorio = new ApiRecetaRepository();

export const RecipeBook = () => {
  // 4. ESTADO CON TIPADO
  // En JS: useState(null)
  // En TS: useState<Receta | null>(null) -> "Esto guardará una Receta O nada (null)"    

  //const [recetaActual, setRecetaActual] = useState<Receta | null>(null);
  //const [cargando, setCargando] = useState<boolean>(false);
  const {cargando, 
        recetaActual,
        recetaEditando, // <---------- Nuevo 
        events:{guardarReceta, manejarSeleccion, eliminarReceta, iniciarEdicion, cancelarEdicion}} = useRecipeBook();


//----------------------------------------------------------------------//
// Función que conecta el formulario con el repositorio
/*  
const guardarReceta = async (receta: NuevaReceta) => {
    const exito = await repositorio.crear(receta);
    if (exito){
      console.log("¡Se guardó en BD!");
      // Aquí podrías actualizar algo si quieres
    }else{
      alert("Hubo un error al guardar");
    }
  };
  */
//----------------------------------------------------------------------//
/*
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
*/
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

          {/*---Botones de acciones nuevos*/}
          <div style={{display:'flex', gap: '10px', margin:'15px 0'}}>

            <button onClick={iniciarEdicion} style={{backgroundColor: '#f59e0b', color:'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer'}}>
              ✏️ Editar
            </button>
            <button onClick={eliminarReceta} style={{backgroundColor: '#ef4444', color:'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer'}}>
              🗑️ Eliminar
            </button>
          </div>
          {/*---------------------------- */}

          <h3>Ingredientes:</h3>
          <ul>
            {/*Ts sabe que 'ingredientes' es un array de strings */}
            {recetaActual.ingredientes.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>  
          <p>{recetaActual.preparacion}</p>
        </>
      )}
    </div>

    {/*FORMULARIO CONECTADO */}
    <FormularioReceta
      alEnviar={guardarReceta}
      recetaParaEditar={recetaEditando}
      alCancelar={cancelarEdicion}
    />  
  </div>
  );
}

export default RecipeBook;