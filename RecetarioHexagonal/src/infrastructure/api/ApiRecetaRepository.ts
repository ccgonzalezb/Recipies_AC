// src/infrastructure/api/ApiRecetaRepository.ts

import type {
  Receta,
  CategoriaComida,
  NuevaReceta,
} from "../../core/domain/Receta";
import type { RecetaRepository } from "../../core/domain/RecetaRepository";

export class ApiRecetaRepository implements RecetaRepository {
  // Implementamos la misma función del contrato
  async obtenerAleatoria(categoria: CategoriaComida): Promise<Receta | null> {
    try {
      // 1. Hacemos la petición al backend real
      const respuesta = await fetch(
        `http://localhost:3000/api/recetas/${categoria}`
      );

      // 2. Si el servidor responde 404 (No encontrado) u otro error
      if (!respuesta.ok) {
        return null;
      }
      // 3. Convertimos la respuesta a JSON
      const data = await respuesta.json();

      // 4. Devolvemos los datos .
      // Como tu backend ya devuelve el JSON con la estructura correcta
      // (id, titulo, ingredientes...), TypeScript lo acepta felizmente
      return data as Receta;
    } catch (error) {
      console.error("Error conectando con el backend", error);
      return null; //Si falla internet devolvemos null
    }
  }
  //----------------------------------------------------------------//
  // Nuevo: implementamos la función CREAR
  async crear(receta: NuevaReceta): Promise<boolean> {
    try {
      const respuesta = await fetch("http://localhost:3000/api/recetas", {
        method: "POST", // Metodo para guardar
        headers: {
          "content-type": "application/json", // Avisamos que enviamos JSON
        },
        body: JSON.stringify(receta), // Convertimos el objeto JS a texto para viajar por internet
      });
      return respuesta.ok; // Devuelve true si el servidor dijo "201 Created"
    } catch (error) {
      console.error("Error creando receta: ", error);
      return false;
    }
  }
  //----------------------------------------------------------------//
  // Implementamos la función ELIMINAR
  async eliminar(id: number): Promise<void> {
    // 1. imprimir para depurar (Verificar que llega el ID)
    console.log("Intentando eliminar ID: ", id);

    // 2. Llamamos al endpoint (SOLO URL Y METODO)
    const respuesta = await fetch(`http://localhost:3000/api/recetas/${id}`, {
      method: "DELETE",
      // Borramos headers y body, No son necesarios para un DELETE simple
    });

    // 👇 AGREGA ESTO: Vamos a ver qué código devuelve el servidor (200, 404, 500?)
    console.log("📡 STATUS DEL SERVIDOR:", respuesta.status);

    if (!respuesta.ok) {
      throw new Error("Error al eliminar receta del servidor");
    }
  }

  //----------------------------------------------------------------//
  // Implementamos la función ACTUALIZAR
  async actualizar(receta: Receta): Promise<void> {
    // 1. Validamos que tenga ID (por seguridad de TypeScript)
    if (!receta.id) throw new Error("La receta no tiene ID");
    // 2. Llamamos al endpoint PUT
    const respuesta = await fetch(
      `http://localhost:3000/api/recetas/${receta.id}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        // Enviamos todo el objeto receta como JSON
        body: JSON.stringify(receta),
      }
    );

    if (!respuesta.ok) {
      throw new Error("Error al actualizar receta");
    }
  }
}
