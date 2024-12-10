const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_HOST, // Nombre del servidor
    database: process.env.DB_NAME, // Nombre de la base de datos
    options: {
        encrypt: false, // Desactiva el cifrado
        trustServerCertificate: true, // Permite certificados autofirmados
    },
    authentication: {
        type: 'ntlm', // Especifica la autenticación de Windows
        options: {
            domain: process.env.DB_DOMAIN, // Dominio del usuario de Windows
            userName: process.env.DB_USER, // Nombre de usuario
            password: process.env.DB_PASSWORD, // Contraseña del usuario
        },
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conexión exitosa a SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar con SQL Server:', err);
    });

module.exports = {
    query: async (query, params = []) => {
        const pool = await poolPromise;
        const request = pool.request();
        params.forEach((param, index) => {
            request.input(`param${index + 1}`, param);
        });
        return request.query(query);
    },
};
