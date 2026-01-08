const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

require("dotenv").config(); // <--- Agrega esto arriba del todo
// 1. CONFIGURACIÓN DE LA BASE DE DATOS
const db = mysql.createConnection({
  host: process.env.DB_HOST, // Leemos la variable
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // <--- ¡PON TU CLAVE AQUÍ!
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) console.error("Error conectando a BD:", err);
  else console.log("✅ Rutas conectadas a MySQL");
});

//-------------------------------------------------------------------------------//
// 1. GET (Leer)
// OJO: Ya no ponemos "/api/recetas/:categoria", solo "/:categoria"
router.get("/:categoria", (req, res) => {
  const { categoria } = req.params;

  // SQL: "Dame 1 receta de esta categoría ordenada al azar"
  const sql =
    "SELECT * FROM recetas WHERE categoria = ? ORDER BY RAND() LIMIT 1";

  db.query(sql, [categoria], (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (resultados.length > 0) {
      // ¡ENCONTRADO!
      // Nota importante: MySQL devuelve los resultados en un array.
      // Tomamos el primero (y único).
      res.json(resultados[0]);
    } else {
      // NO HAY RECETAS
      res.status(404).json({ error: "No hay recetas de ese tipo aun" });
    }
  });
});
//----------------------------------------------//
// 2. POST (Crear)
// La ruta es raíz "/" porque en index.js ya dijimos que esto es "/api/recetas"
router.post("/", (req, res) => {
  // 1. Desempaquetamos los datos que llegan
  const { titulo, categoria, ingredientes, preparacion, imagen } = req.body;

  // 2. Validación simple (Evitar guardas cosas vacias)
  if (!titulo || !categoria || !ingredientes || !preparacion) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  // 3. Convertimos el Array de ingredientes a Texto JSON para MySql
  // MySql no guarda Arrays nativos, guarda strings que parecen arrays '["pan","agua"]'
  const ingredientesJSON = JSON.stringify(ingredientes);
  // Si no mandan imagen, ponemos una por defecto
  const imagenFinal =
    imagen || "https://via.placeholder.com/500?text=Sin+Imagen";

  // 4. La consulta SQL
  const sql =
    "INSERT INTO recetas (titulo, categoria, ingredientes, preparacion, imagen) VALUES (?,?,?,?,?)";

  db.query(
    sql,
    [titulo, categoria, ingredientesJSON, preparacion, imagenFinal],
    (err, result) => {
      if (err) {
        console.error("Error SQL: ", err);
        return res.status(500).json({ error: "Error al guardar en BD" });
      }

      // Responder ÉXITO (Código 201 = Created)
      res.status(201).json({
        mensaje: "Receta creada con éxito",
        id: result.insertId,
      });
    }
  );
});
//----------------------------------------------//
// 3. DELETE (Eliminar)
// Ruta solo "/:id"
router.delete("/:id", (req, res) => {
  // 2. Extraemos el 'id', no la categoría
  const { id } = req.params;

  // 3. SQL Simple: Borra donde el id coincida
  // ¡SIN "VALUES"!
  const sql = "DELETE FROM recetas WHERE id = ? ";

  db.query(sql, [id], (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al borrar" });
    }

    // 4. Verificamos si realmente borró algo
    if (resultados.affectedRows === 0) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }
    res.json({ message: "Receta eliminada correctamente" });
  });
});
//----------------------------------------------//
// 4. PUT (Actualizar/Modificar) 🔄
// Ruta: /:id (Necesitamos saber CUÁL modificar)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  // Recibimos los datos nuevos desde el formulario
  const { titulo, categoria, ingredientes, preparacion, imagen } = req.body;

  // Validamos que venga lo mínimo necesario
  if (!titulo || !categoria) {
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios para actualizar" });
  }

  // Convertimos ingredientes a JSON otra vez (igual que en el POST)
  const ingredientesJSON = JSON.stringify(ingredientes);

  // SQL UPDATE: "Actualiza la tabla recetas, ESTABLECE estos valores DONDE el id sea tal"
  const sql = `
        UPDATE recetas 
        SET titulo = ?, categoria = ?, ingredientes = ?, preparacion = ?, imagen = ? 
        WHERE id = ?
    `;

  db.query(
    sql,
    [titulo, categoria, ingredientesJSON, preparacion, imagen, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al actualizar" });
      }

      // Si affectedRows es 0, significa que el ID no existe (ej: ID 9999)
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Receta no encontrada para actualizar" });
      }

      res.json({ message: "Receta actualizada correctamente" });
    }
  );
});
//----------------------------------------------//

module.exports = router; // ¡Importante exportarlo!
