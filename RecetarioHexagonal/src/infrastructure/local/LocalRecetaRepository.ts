// src/infrastructure/local/LocalRecetaRepository.ts

import type {Receta, CategoriaComida, NuevaReceta} from '../../core/domain/Receta';
import type { RecetaRepository } from '../../core/domain/RecetaRepository';
import { sleep, getRandomBasicInt } from '../../utils';

// 1. Aquí ponemos tus datos viejos ("Hardcodeados")
// TypeScript revisará que no te falte ninguna coma ni escribas mal los campos
const BASE_DE_DATOS_FALSA: Receta[]= [
    {
        id: 1,
        titulo: "Avena con frutas",
        categoria: "desayuno",
        ingredientes: ["100g Avena", "Agua", "Frutas", "Nueces"],
        preparacion: "Hervir el agua, echar la avena y servir con frutas.",
        imagen: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=500&q=60" // Foto real de internet
    },
    {
        id: 2,
        titulo: "Sándwich de Pavo",
        categoria: "almuerzo",
        ingredientes: ["2 Panes", "Jamón de Pavo", "Lechuga", "Tomate"],
        preparacion: "Tostar el pan y armar el sándwich.",
        imagen: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        titulo: "Tartar de Salmón",
        categoria: "cena",
        ingredientes: ["Salmón fresco", "Aguacate", "Salsa de Soja", "Limón"],
        preparacion: "Cortar todo en cubitos y mezclar con la salsa.",
        imagen: "https://images.unsplash.com/photo-1519708227418-e8d316e890f9?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 4,
        titulo: "Pudin de Chocolate",
        categoria: "postre",
        ingredientes: ["Pan viejo", "Leche", "Chocolate", "Huevos"],
        preparacion: "Mezclar todo y hornear al baño maría.",
        imagen: "https://images.unsplash.com/photo-1563729768474-d77dbb933a9e?auto=format&fit=crop&w=500&q=60"
    }
];

// 2. La clase adaptador 
// La palabra clave 'implements' es lo importante.
// Significa: "Juro solemnemente que esta clase tiene la función obtenerAleatoria".

export class LocalRecetaRepository implements RecetaRepository{
    async obtenerAleatoria(categoria: CategoriaComida): Promise<Receta | null> {
        // Simular que tardamos un poquito (como una base de datos real)
        await sleep({ms:500})// Espera medio segundo
        // 1. Filtramos: Buscamos solo las de la categoria que pidieron 
        const recetasFiltradas = BASE_DE_DATOS_FALSA.filter(r => r.categoria === categoria);

        // 2. Si no hay ninguna, devolvemos null
        if (recetasFiltradas.length === 0){
            return null;
        }

        // 3. Elegimos una al azar 
        /*
        const indiceAleatorio = Math.floor(Math.random() * recetasFiltradas.length);
        return recetasFiltradas[indiceAleatorio];
        */
        const indiceAleatorio = getRandomBasicInt({min:0, max:recetasFiltradas.length-1});
        return recetasFiltradas[indiceAleatorio];
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
