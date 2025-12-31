import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import App from './App.tsx'
import {RecipeBook} from './pages/recipeBook'
import './App.css'; // Asegurate de tener tus estilos aquí 


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecipeBook />
  </StrictMode>,
)
