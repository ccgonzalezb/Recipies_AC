import { useState, useEffect } from "react";
import type { NuevaReceta, CategoriaComida, Receta } from "../../core/domain/Receta";

interface Props {
    // Función que pasará el padre para guardar
    alEnviar: (receta:NuevaReceta) => void;
    // Nuevas PROPS
    recetaParaEditar: Receta | null;
    alCancelar: () => void;
} 

export default function FormularioReceta({alEnviar, recetaParaEditar, alCancelar}: Props)
{
    // Estados para guardar lo que escribe el usuario
    const [titulo, setTitulo] = useState('');
    const [categoria, setCategoria] = useState<CategoriaComida>('desayuno');
    const [ingredientesTexto, setIngredientesTexto] = useState(''); // El usuario escribirá separado por comas
    const [preparacion, setPreparacion] = useState('');
    const [imagen, setImagen] = useState('');

    // --- MAGIA: Detectar cambios en recetaParaEditar---
    useEffect(() => {
        if (recetaParaEditar){
            // Si llega una receta, llenamos los campos
            setTitulo(recetaParaEditar.titulo);
            setCategoria(recetaParaEditar.categoria);
            setIngredientesTexto(recetaParaEditar.ingredientes.join(', '));
            setPreparacion(recetaParaEditar.preparacion);
            setImagen(recetaParaEditar.imagen);
        } else {
            // Si no hay receta (o cancelamos), limpiamos 
            limpiar();
        }
    }, [recetaParaEditar]);

    const limpiar = () => {
        setTitulo('');
        setCategoria('desayuno');
        setIngredientesTexto('');
        setPreparacion('');
        setImagen('');
    }

    const manejarEnvio = (e:React.FormEvent) =>{
        e.preventDefault(); // Evita que se recargue la página

        //Convertimos el texto "pan, huevo, sal" en array ["pan","huevo","sal"]
        const listaIngredientes = ingredientesTexto.split(',').map(i => i.trim());

        // Creamos el objeto receta
        const nuevaReceta: NuevaReceta = {
            titulo,
            categoria,
            ingredientes: listaIngredientes,
            preparacion,
            imagen
        };

        // Llamamos a la función del padre
        alEnviar(nuevaReceta);
        if (!recetaParaEditar) limpiar(); // Solo limpiar si estamos creando
    };

    //Cambiamos el color del botón si estamos editando 
    const textoBoton = recetaParaEditar ? 'Actualizar receta': 'Guardar reeceta';
    const colorBoton = recetaParaEditar ? "#f59e0b" : "#2563eb"; // Naranja vs Azul

    return (
        <form onSubmit={manejarEnvio} className="detalle" style={{marginTop: '20px', borderTop: '2px solid #eee', paddingTop: '20px'}}>
            <h2>{recetaParaEditar ? '✏️ Editando Receta' : '🍳 Crear Nueva Receta'}</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap:'10px'}}>
                <input
                    type="text"
                    placeholder="Nombre del plato (ej: Arepa)"
                    value={titulo}
                    onChange={e => setTitulo(e.target.value)}
                    required
                    style={{padding: '10px'}}
                />
                <select 
                    value={categoria}
                    onChange={e => setCategoria(e.target.value as CategoriaComida)}
                    style={{padding: '10px'}}
                >
                    <option value="desayuno">Desayuno</option>
                    <option value="almuerzo">Almuerzo</option>
                    <option value="cena">Cena</option>
                    <option value="postre">Postre</option>
                </select>

                <textarea
                    placeholder="Ingredientes (separados por coma: Pan, Huevo, Sal)"
                    value={ingredientesTexto}
                    onChange={e => setIngredientesTexto(e.target.value)}
                    required
                    style={{padding: '10px', minHeight: '60px'}}
                />

                <textarea
                    placeholder="Preparación..."
                    value={preparacion}
                    onChange={e => setPreparacion(e.target.value)}
                    required
                    style={{padding: '10px', minHeight: '100px'}}
                />

                <input
                    type="text"
                    placeholder="URL de imagen (opcional)"
                    value={imagen}
                    onChange={e => setImagen(e.target.value)}
                    required
                    style={{padding: '10px'}}
                />

                <div style={{display:'flex', gap:'10px'}}>
                    <button 
                        type="submit"
                        style={{padding: '10px', backgroundColor: colorBoton, color:'white', border:'none', borderRadius: '5px', cursor: 'pointer', flex: 1}}>
                            {textoBoton}
                    </button>
                    {recetaParaEditar && (
                        <button type="button" onClick={alCancelar} style={{padding: '10px', backgroundColor: '#9ca3af', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Cancelar
                        </button>
                    )}
                </div> 
            </div>
        </form>
    );
}