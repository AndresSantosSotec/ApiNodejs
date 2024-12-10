const express = require('express');
const router = express.Router();
const estadosModel = require('../models/estadosModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Obtener todos los estados (Protegido)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await estadosModel.getEstados();
        res.json(result); // Devuelve la lista de estados
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un nuevo estado (Protegido)
router.post('/', authMiddleware, async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El campo nombre es requerido' });
    }
    try {
        const estado = await estadosModel.createEstado(nombre);
        res.status(201).json({ message: 'Estado creado', estado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar un estado por ID (Protegido)
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El campo nombre es requerido' });
    }
    try {
        const estado = await estadosModel.updateEstado(id, nombre);
        res.json({ message: 'Estado actualizado', estado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar un estado por ID (Protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await estadosModel.deleteEstado(id);
        res.json(result); // Retorna confirmación de eliminación
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
