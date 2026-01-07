import { useState } from "react";

import type { NuevaReceta, Receta, CategoriaComida } from "../../../core/domain/Receta";

// ---- CAMBIO IMPORTANTE: Usamos la API real ----
//import { LocalRecetaRepository } from "../../../infrastructure/local/LocalRecetaRepository"; //->Datos falsos
//const repositorio = new LocalRecetaRepository(); //-> base de datos fals

import { ApiRecetaRepository } from "../../../infrastructure/api/ApiRecetaRepository"; //->Datos reales

// Instanciamos el repositorio real
const repositorio = new ApiRecetaRepository();

export const useRecipeBook = () => {

    const [cargando, setCargando] = useState<boolean>(false);
    const [recetaActual, setRecetaActual] = useState<Receta | null>(null);

    // NUEVO ESTADO: Para saber si estamos editando una receta
    const [recetaEditando, setRecetaEditando] = useState<Receta | null>(null);
//---------------------------------------------------------------------//    
    // 1. Obtener Receta (GET)
    const manejarSeleccion = async (categoria: CategoriaComida) =>{
        setCargando(true);
        setRecetaActual(null);
        setRecetaEditando(null); // Limpiamos edición si cambiamos de plato

        const recetaEncontrada = await repositorio.obtenerAleatoria(categoria);
        setRecetaActual(recetaEncontrada);
        setCargando(false);
    };
//---------------------------------------------------------------------//
    // 2. Guardar Receta (Crear POST o actualizar PUT)
    const guardarReceta = async (datosFormulario: NuevaReceta) => {
        try{
            if (recetaEditando){
                // --- MODO Actualizar---
                // Reconstruimos la receta completa en el ID original 
                const recetaParaActualizar: Receta = {
                    ...datosFormulario,
                    id: recetaEditando.id
                };

                await repositorio.actualizar(recetaParaActualizar);
                alert("¡Receta actualizada con exito!");

                // Actualizar la vista actual 
                setRecetaActual(recetaParaActualizar);
                setRecetaEditando(null); // Salimos del modo edición

            } else {
                // --- Modo Crear ---
                const exito = await repositorio.crear(datosFormulario);
                if (exito) alert('¡Receta creada en BD!');
                else alert('Error al crear');  
            }
        } catch (error){
            console.error(error);
            alert('Error de conexión')
        }
    };
//---------------------------------------------------------------------//
    // 3. Eliminar (DELETE)
    const eliminarReceta = async () => {
        if (!recetaActual) return;
        
        if (confirm('¿Estás seguro de borrar esta receta?')){
            try{
                await repositorio.eliminar(recetaActual.id);
                alert('Receta eliminada');
                setRecetaActual(null); // Limpiamos la pantalla
                setRecetaEditando(null);
            } catch (error){
                console.error("💥 EL ERROR EXACTO ES:", error);
                alert('Error al eliminar');
            }
        }
    };
//---------------------------------------------------------------------//
    // 4. Funciones auxiliares para el formulario
    const iniciarEdicion = () => {
        if (recetaActual) setRecetaEditando(recetaActual);
    };

    const cancelarEdicion = () => {
        setRecetaEditando(null);
    };

    return {
        cargando,
        recetaActual,
        recetaEditando, // Exportamos esto para que el formulario sepa
        events:{
            guardarReceta,
            manejarSeleccion,
            eliminarReceta,
            iniciarEdicion,
            cancelarEdicion
        }
    };
}