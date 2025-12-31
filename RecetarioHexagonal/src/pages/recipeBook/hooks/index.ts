import { useState } from "react";

import type { NuevaReceta } from "../../../core/domain/Receta";
import { LocalRecetaRepository } from "../../../infrastructure/local/LocalRecetaRepository"; //->Datos falsos
import type { Receta, CategoriaComida} from "../../../core/domain/Receta";

const repositorio = new LocalRecetaRepository(); //-> base de datos fals


export const useRecipeBook = () => {

    const [cargando, setCargando] = useState<boolean>(false);
    const [recetaActual, setRecetaActual] = useState<Receta | null>(null);

    // Función que conecta el formulario con el repositorio
    const guardarReceta = async (receta: NuevaReceta) => {
        const exito = await repositorio.crear(receta);
        if (exito) {
            console.log("¡Se guardó en BD!");
            // Aquí podrías actualizar algo si quieres
        } else {
            alert("Hubo un error al guardar");
        }
    };

    // 5. Función para pedir datos al repositorio
    const manejarSeleccion = async (categoria: CategoriaComida) => {
        setCargando(true); // Activamos "Cargando..."
        setRecetaActual(null); // Limpiamos la anterior

        // ¡Aquí usamos la arquitectura hexágonal!
        // No sabemos si viene de internet o local, solo pedimos "obtenerAleatoria"
        const recetaEncontrada = await repositorio.obtenerAleatoria(categoria);
        setRecetaActual(recetaEncontrada);
        setCargando(false);
    };
    return {cargando, recetaActual, events: { guardarReceta, manejarSeleccion } };

}