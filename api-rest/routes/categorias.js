const express = require('express');
const router = express.Router();
const categoriasModel = require('../models/categoriasModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Obtener todas las categorías (Protegido)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await categoriasModel.getCategorias();
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear una categoría (Protegido)
router.post('/', authMiddleware, async (req, res) => {
    const { nombre, usuarios_idusuarios, estados_idestados } = req.body;
    try {
        await categoriasModel.createCategoria({ nombre, usuarios_idusuarios, estados_idestados });
        res.status(201).json({ message: 'Categoría creada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar una categoría por ID (Protegido)
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { nombre, usuarios_idusuarios, estados_idestados } = req.body;
    try {
        await categoriasModel.updateCategoria(id, { nombre, usuarios_idusuarios, estados_idestados });
        res.json({ message: 'Categoría actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar una categoría por ID (Protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await categoriasModel.deleteCategoria(id);
        res.json({ message: 'Categoría eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
