const express = require('express');
const router = express.Router();
const productosModel = require('../models/productosModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Obtener todos los productos (Protegido)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await productosModel.getProductos();
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un producto por ID (Protegido)
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await productosModel.getProductoById(id);
        if (!result.recordset.length) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un producto (Protegido)
router.post('/', authMiddleware, async (req, res) => {
    const { nombre, marca, codigo, stock, precio, categoriaId, usuarioId, estadoId } = req.body;
    if (!nombre || !codigo || !precio || !categoriaId) {
        return res.status(400).json({ message: 'Campos requeridos: nombre, codigo, precio, categoriaId' });
    }
    try {
        await productosModel.createProducto({ nombre, marca, codigo, stock, precio, categoriaId, usuarioId, estadoId });
        res.status(201).json({ message: 'Producto creado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar un producto (Protegido)
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { nombre, marca, codigo, stock, precio, categoriaId, usuarioId, estadoId } = req.body;
    try {
        await productosModel.updateProducto(id, { nombre, marca, codigo, stock, precio, categoriaId, usuarioId, estadoId });
        res.json({ message: 'Producto actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar un producto (Protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await productosModel.deleteProducto(id);
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
