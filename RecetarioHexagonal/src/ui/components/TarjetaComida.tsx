// src/ui/components/TarjetaComida.tsx

// 1. IMPORTANTE: Definimos que acepta este componente.
// Esto es exclusivode TypeScript.

interface TarjetaComidaProps {
    titulo: string; // Obligatorio que sea texto
    imagenSrc: string; // Obligatorio que sea texto
    alHacerClick: () => void; // ¡Mira esto! Es una función que no devuelve nada (void)
}

// 2. Usamos la interfaz en la función

export default function TarjetaComida({titulo, imagenSrc, alHacerClick}: TarjetaComidaProps){
    return (
        <label className="tarjeta-comida">
            <p>{titulo}</p>
            {/*Fíjate que si escribes "imagenSrc." Te saldrán métodos de texto 
                porque Ts sabe que es un string . ¡Magia!*/}
            <button onClick={alHacerClick}>
                <img src={imagenSrc} alt={`Foto de ${titulo}`} />
            </button>
        </label>
    );
}