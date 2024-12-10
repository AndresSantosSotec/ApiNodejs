const db = require('../db');

const getEstados = async () => {
    try {
        const result = await db.query('SELECT * FROM estados');
        return result.recordset; // Lista de estados
    } catch (error) {
        throw new Error('Error al obtener los estados: ' + error.message);
    }
};

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
        return { id: result.recordset[0].idEstado, nombre }; // Devolver el nuevo estado
    } catch (error) {
        throw new Error('Error al crear el estado: ' + error.message);
    }
};

module.exports = {
    getEstados,
    createEstado,
};
