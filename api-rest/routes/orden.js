const express = require('express');
const router = express.Router();
const ordenModel = require('../models/ordenModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Obtener todas las órdenes (Protegido)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await ordenModel.getOrdenes();
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear una nueva orden (Protegido)
router.post('/', authMiddleware, async (req, res) => {
    const { usuarios_idusuarios, estados_idestados, fecha_entrega, total_orden } = req.body;
    try {
        await ordenModel.createOrden({ usuarios_idusuarios, estados_idestados, fecha_entrega, total_orden });
        res.status(201).json({ message: 'Orden creada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar una orden por ID (Protegido)
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { usuarios_idusuarios, estados_idestados, fecha_entrega, total_orden } = req.body;
    try {
        await ordenModel.updateOrden(id, { usuarios_idusuarios, estados_idestados, fecha_entrega, total_orden });
        res.json({ message: 'Orden actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar una orden por ID (Protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await ordenModel.deleteOrden(id);
        res.json({ message: 'Orden eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;