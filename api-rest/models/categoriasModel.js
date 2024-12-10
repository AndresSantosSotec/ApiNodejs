const db = require('../db');

const getCategorias = async () => {
    try {
        const result = await db.query('SELECT * FROM CategoriaProductos');
        return result.recordset; // React espera una lista de categorías
    } catch (error) {
        throw new Error('Error al obtener las categorías: ' + error.message);
    }
};

const createCategoria = async (categoria) => {
    const { nombre, usuarios_idusuarios, estados_idestados } = categoria;
    try {
        // Verificar si la categoría ya existe
        const existingCategoria = await db.query('SELECT * FROM CategoriaProductos WHERE nombre = @param1', [nombre]);
        if (existingCategoria.recordset.length > 0) {
            throw new Error('La categoría ya existe.');
        }

        const result = await db.query(
            `INSERT INTO CategoriaProductos (nombre, usuarios_idusuarios, estados_idestados)
             VALUES (@param1, @param2, @param3);
             SELECT SCOPE_IDENTITY() AS idCategoria;`,
            [nombre, usuarios_idusuarios, estados_idestados]
        );
        return { id: result.recordset[0].idCategoria, nombre }; // React necesita el ID creado
    } catch (error) {
        throw new Error('Error al crear la categoría: ' + error.message);
    }
};

module.exports = {
    getCategorias,
    createCategoria,
};
