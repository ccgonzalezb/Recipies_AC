// src/core/domain/Receta.ts
// ESTO ES UN TIPO PERSONALIZADO
// Le decimos al inspector: "solo aceptamosesta 4 palabras exactas".
// Si intentas escribir 'desayuno' con mayúscula o 'snack', dará un error

export type CategoriaComida = 'desayuno' | 'almuerzo' | 'cena' | 'postre';

// ESTO ES UNA INTERFAZ (EL MOLDE)
// Define que forma DEBE tener obligatoriamente una receta.

export interface Receta{
    id: number; // Tiene que ser un numero
    titulo: string; // Tiene que ser texto
    categoria: CategoriaComida; // Tiene que ser una de las 4 palabras de arriba
    ingredientes: string[]; // Los corchetes [] significan "Lista de textos"
    preparacion: string; // Texto largo
    imagen: string // Texto (la ruta de la imagen)
}

//------------------------------------------------//
// NUEVO: Definimos qué es una "Receta Nueva" (Es igual a una Receta pero SIN id)
// Omit<Receta, 'id'> es un truco de TS para decir "Copia todo menos el id"
export type NuevaReceta = Omit<Receta, 'id'>;
//------------------------------------------------//