const db = require('../db');

// Obtener todos los estados
const getEstados = async () => {
    try {
        const result = await db.query('SELECT * FROM estados');
        return result.recordset; // Lista de estados
    } catch (error) {
        throw new Error('Error al obtener los estados: ' + error.message);
    }
};

// Crear un nuevo estado
const createEstado = async (nombre) => {
    try {
        // Verificar si el estado ya existe
        const existingEstado = await db.query('SELECT * FROM estados WHERE nombre = @param1', [nombre]);
        if (existingEstado.recordset.length > 0) {
            throw new Error('El estado ya existe');
        }

        const result = await db.query(
            `INSERT INTO estados (nombre) VALUES (@param1);
             SELECT SCOPE_IDENTITY() AS idEstado;`,
            [nombre]
        );
        return { id: result.recordset[0].idEstado, nombre }; // Devuelve el nuevo estado
    } catch (error) {
        throw new Error('Error al crear el estado: ' + error.message);
    }
};

// Actualizar un estado por ID
const updateEstado = async (id, nombre) => {
    try {
        const result = await db.query(
            `UPDATE estados SET nombre = @param1 WHERE idestados = @param2`,
            [nombre, id]
        );
        if (result.rowsAffected[0] === 0) {
            throw new Error('Estado no encontrado');
        }
        return { id, nombre }; // Retorna el estado actualizado
    } catch (error) {
        throw new Error('Error al actualizar el estado: ' + error.message);
    }
};

// Eliminar un estado por ID
const deleteEstado = async (id) => {
    try {
        const result = await db.query('DELETE FROM estados WHERE idestados = @param1', [id]);
        if (result.rowsAffected[0] === 0) {
            throw new Error('Estado no encontrado para eliminar');
        }
        return { message: 'Estado eliminado', id };
    } catch (error) {
        throw new Error('Error al eliminar el estado: ' + error.message);
    }
};

module.exports = {
    getEstados,
    createEstado,
    updateEstado,
    deleteEstado,
};
