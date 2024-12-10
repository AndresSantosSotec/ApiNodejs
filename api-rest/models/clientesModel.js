const db = require('../db');

const getClientes = async () => {
    try {
        const result = await db.query('SELECT * FROM Clientes');
        return result.recordset; // Lista de clientes para el frontend
    } catch (error) {
        throw new Error('Error al obtener los clientes: ' + error.message);
    }
};

const getClienteById = async (id) => {
    try {
        const result = await db.query('SELECT * FROM Clientes WHERE idClientes = @param1', [id]);
        if (!result.recordset.length) {
            throw new Error('Cliente no encontrado');
        }
        return result.recordset[0]; // Devuelve un solo cliente
    } catch (error) {
        throw new Error('Error al obtener el cliente: ' + error.message);
    }
};

const createCliente = async (cliente) => {
    const { razon_social, nombre_comercial, direccion_entrega, telefono, email } = cliente;
    try {
        const result = await db.query(
            `INSERT INTO Clientes (razon_social, nombre_comercial, direccion_entrega, telefono, email)
             VALUES (@param1, @param2, @param3, @param4, @param5);
             SELECT SCOPE_IDENTITY() AS idCliente;`,
            [razon_social, nombre_comercial, direccion_entrega, telefono, email]
        );
        return { id: result.recordset[0].idCliente, razon_social, email }; // Retorna datos útiles al frontend
    } catch (error) {
        throw new Error('Error al crear el cliente: ' + error.message);
    }
};

const updateCliente = async (id, cliente) => {
    const { razon_social, nombre_comercial, direccion_entrega, telefono, email } = cliente;
    try {
        const result = await db.query(
            `UPDATE Clientes SET razon_social = @param1, nombre_comercial = @param2, direccion_entrega = @param3, 
             telefono = @param4, email = @param5 WHERE idClientes = @param6`,
            [razon_social, nombre_comercial, direccion_entrega, telefono, email, id]
        );

        if (result.rowsAffected[0] === 0) {
            throw new Error('Cliente no encontrado para actualizar');
        }

        return { id, razon_social, email }; // Confirma la actualización
    } catch (error) {
        throw new Error('Error al actualizar el cliente: ' + error.message);
    }
};

const deleteCliente = async (id) => {
    try {
        const result = await db.query('DELETE FROM Clientes WHERE idClientes = @param1', [id]);
        if (result.rowsAffected[0] === 0) {
            throw new Error('Cliente no encontrado para eliminar');
        }
        return { message: 'Cliente eliminado', id };
    } catch (error) {
        throw new Error('Error al eliminar el cliente: ' + error.message);
    }
};

module.exports = {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
};
