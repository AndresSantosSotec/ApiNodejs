const db = require('../db');

const getOrdenes = async () => {
    try {
        const result = await db.query('SELECT * FROM Orden');
        return result.recordset; // Lista de órdenes
    } catch (error) {
        throw new Error('Error al obtener las órdenes: ' + error.message);
    }
};

const createOrden = async (orden) => {
    const { usuarios_idusuarios, estados_idestados, fecha_entrega, total_orden } = orden;
    try {
        const result = await db.query(
            `INSERT INTO Orden (usuarios_idusuarios, estados_idestados, fecha_entrega, total_orden)
             VALUES (@param1, @param2, @param3, @param4);
             SELECT SCOPE_IDENTITY() AS idOrden;`,
            [usuarios_idusuarios, estados_idestados, fecha_entrega, total_orden]
        );
        return { id: result.recordset[0].idOrden, total_orden }; // Retorna el ID de la orden creada
    } catch (error) {
        throw new Error('Error al crear la orden: ' + error.message);
    }
};

module.exports = {
    getOrdenes,
    createOrden,
};
