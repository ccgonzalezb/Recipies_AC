// src/infrastructure/api/ApiRecetaRepository.ts

import type { Receta, CategoriaComida, NuevaReceta } from "../../core/domain/Receta";
import type { RecetaRepository } from "../../core/domain/RecetaRepository";

export class ApiRecetaRepository implements RecetaRepository{

    // Implementamos la misma función del contrato
    async obtenerAleatoria(categoria: CategoriaComida): Promise<Receta | null> {
        try{
            // 1. Hacemos la petición al backend real
            const respuesta = await fetch(`http://localhost:3000/api/recetas/${categoria}`);
            
            // 2. Si el servidor responde 404 (No encontrado) u otro error 
            if (!respuesta.ok){
                return null
            }
            // 3. Convertimos la respuesta a JSON
            const data = await respuesta.json();
            
            // 4. Devolvemos los datos .
            // Como tu backend ya devuelve el JSON con la estructura correcta 
            // (id, titulo, ingredientes...), TypeScript lo acepta felizmente
            return data as Receta;
        } catch (error){
            console.error('Error conectando con el backend', error);
            return null; //Si falla internet devolvemos null
        }
    }
//----------------------------------------------------------------//
    // Nuevo: implementamos la función CREAR
    async crear(receta: NuevaReceta): Promise<boolean>{
        try{
            const respuesta = await fetch('http://localhost:3000/api/recetas',{
                method: 'POST', // Metodo para guardar
                headers:{
                    'content-type': 'application/json',// Avisamos que enviamos JSON
                },
                body: JSON.stringify(receta) // Convertimos el objeto JS a texto para viajar por internet
            });
            return respuesta.ok; // Devuelve true si el servidor dijo "201 Created"
        }catch (error){
            console.error("Error creando receta: ", error);
            return false
        }
    }
//----------------------------------------------------------------//
}