const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
app.use(bodyParser.json());

// Importar rutas
const clientesRoutes = require('./routes/clientes');
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');
const ordenRoutes = require('./routes/orden');
const estadosRoutes = require('./routes/estados');

// Registrar rutas
app.use('/api/clientes', clientesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/orden', ordenRoutes);
app.use('/api/estados', estadosRoutes);

// Puerto y servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
