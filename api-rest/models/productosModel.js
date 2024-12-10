const db = require('../db');

const getProductos = async () => {
    try {
        const result = await db.query('SELECT * FROM Productos');
        return result.recordset; // Lista de productos
    } catch (error) {
        throw new Error('Error al obtener los productos: ' + error.message);
    }
};

const getProductoById = async (id) => {
    try {
        const result = await db.query('SELECT * FROM Productos WHERE idProductos = @param1', [id]);
        if (!result.recordset.length) {
            throw new Error('Producto no encontrado');
        }
        return result.recordset[0]; // Producto específico
    } catch (error) {
        throw new Error('Error al obtener el producto: ' + error.message);
    }
};

const createProducto = async (producto) => {
    const { nombre, marca, codigo, stock, precio, categoriaId, usuarioId, estadoId } = producto;
    try {
        const result = await db.query(
            `INSERT INTO Productos (nombre, marca, codigo, stock, precio, CategoriaProductos_idCategoriaProductos, usuarios_idusuarios, estados_idestados) 
             VALUES (@param1, @param2, @param3, @param4, @param5, @param6, @param7, @param8);
             SELECT SCOPE_IDENTITY() AS idProducto;`,
            [nombre, marca, codigo, stock, precio, categoriaId, usuarioId, estadoId]
        );
        return { id: result.recordset[0].idProducto, nombre }; // Retorna el nuevo producto
    } catch (error) {
        throw new Error('Error al crear el producto: ' + error.message);
    }
};

const updateProducto = async (id, producto) => {
    const { nombre, marca, codigo, stock, precio, categoriaId, usuarioId, estadoId } = producto;
    try {
        const result = await db.query(
            `UPDATE Productos SET nombre = @param1, marca = @param2, codigo = @param3, stock = @param4, precio = @param5, 
             CategoriaProductos_idCategoriaProductos = @param6, usuarios_idusuarios = @param7, estados_idestados = @param8 
             WHERE idProductos = @param9`,
            [nombre, marca, codigo, stock, precio, categoriaId, usuarioId, estadoId, id]
        );
        if (result.rowsAffected[0] === 0) {
            throw new Error('Producto no encontrado para actualizar');
        }
        return { id, nombre }; // Confirma la actualización
    } catch (error) {
        throw new Error('Error al actualizar el producto: ' + error.message);
    }
};

const deleteProducto = async (id) => {
    try {
        const result = await db.query('DELETE FROM Productos WHERE idProductos = @param1', [id]);
        if (result.rowsAffected[0] === 0) {
            throw new Error('Producto no encontrado para eliminar');
        }
        return { message: 'Producto eliminado', id };
    } catch (error) {
        throw new Error('Error al eliminar el producto: ' + error.message);
    }
};

module.exports = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
};
