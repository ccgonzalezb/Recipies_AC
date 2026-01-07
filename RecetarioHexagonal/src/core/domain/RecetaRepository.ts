// src/core/domain/RecetaRepository.ts

// 1. Importamos el molde que creamos antes 
import type { Receta, CategoriaComida, NuevaReceta } from "./Receta"; // -> Importamos NuevaReceta

// 2. Definimos el Contrato del Repositorio
// Esto dice: "Cualquier cosa que quiera llamarse 'RecetaRepository'
// DEBE tener una función llamada 'obtenerAleatoria'".

export interface RecetaRepository {
    // Nombre de la función: (parámetro: tipo) => lo que devuelve
    obtenerAleatoria(categoria: CategoriaComida):
    Promise<Receta | null>;
    // NUEVO: Agregamos la firma de la función crear 
    // Recibe una NuevaReceta y promete devolver un boolean (true si se guardó, false si falló)
    crear(receta: NuevaReceta): Promise<boolean>;
    eliminar(id:number):Promise<void>;
    actualizar(receta:Receta):Promise<void>;
}


