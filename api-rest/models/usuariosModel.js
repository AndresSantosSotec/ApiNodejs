const db = require('../db');
const bcrypt = require('bcrypt');

const getUsuarios = async () => {
    try {
        const result = await db.query('SELECT * FROM usuarios');
        return result.recordset; // Lista de usuarios
    } catch (error) {
        throw new Error('Error al obtener los usuarios: ' + error.message);
    }
};

const getUsuarioById = async (id) => {
    try {
        const result = await db.query('SELECT * FROM usuarios WHERE idusuarios = @param1', [id]);
        if (!result.recordset.length) {
            throw new Error('Usuario no encontrado');
        }
        return result.recordset[0]; // Usuario específico
    } catch (error) {
        throw new Error('Error al obtener el usuario: ' + error.message);
    }
};

const createUsuario = async (usuario) => {
    const { rol_idrol, estados_idestados, correo_electronico, nombre_completo, password, telefono, fecha_nacimiento, Clientes_idClientes } = usuario;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            `INSERT INTO usuarios (rol_idrol, estados_idestados, correo_electronico, nombre_completo, password, telefono, fecha_nacimiento, Clientes_idClientes)
             VALUES (@param1, @param2, @param3, @param4, @param5, @param6, @param7, @param8);
             SELECT SCOPE_IDENTITY() AS idUsuario;`,
            [rol_idrol, estados_idestados, correo_electronico, nombre_completo, hashedPassword, telefono, fecha_nacimiento, Clientes_idClientes]
        );
        return { id: result.recordset[0].idUsuario, correo_electronico }; // Retorna el nuevo usuario
    } catch (error) {
        throw new Error('Error al crear el usuario: ' + error.message);
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
};
