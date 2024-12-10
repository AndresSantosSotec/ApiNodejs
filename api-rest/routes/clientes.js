const express = require('express');
const router = express.Router();
const clientesModel = require('../models/clientesModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Obtener todos los clientes (Protegido)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await clientesModel.getClientes();
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear cliente (Protegido)
router.post('/', authMiddleware, async (req, res) => {
    const { razon_social, nombre_comercial, direccion_entrega, telefono, email } = req.body;
    if (!razon_social || !email) {
        return res.status(400).json({ message: 'Campos requeridos: razon_social y email' });
    }
    try {
        await clientesModel.createCliente({ razon_social, nombre_comercial, direccion_entrega, telefono, email });
        res.status(201).json({ message: 'Cliente creado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
