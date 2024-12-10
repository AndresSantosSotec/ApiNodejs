const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const usuariosModel = require('../models/usuariosModel');
const db = require('../db');

// Login: Generar token JWT
router.post('/login', async (req, res) => {
    const { correo_electronico, password } = req.body;
    if (!correo_electronico || !password) {
        return res.status(400).json({ message: 'Campos requeridos: correo_electronico y password' });
    }
    try {
        const result = await db.query('SELECT * FROM usuarios WHERE correo_electronico = @param1', [correo_electronico]);
        if (!result.recordset.length) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = result.recordset[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user.idusuarios, role: user.rol_idrol }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Registro de usuario (Protegido)
router.post('/register', authMiddleware, async (req, res) => {
    const { rol_idrol, estados_idestados, correo_electronico, nombre_completo, password } = req.body;
    if (!correo_electronico || !password) {
        return res.status(400).json({ message: 'Campos requeridos: correo_electronico y password' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await usuariosModel.createUsuario({ rol_idrol, estados_idestados, correo_electronico, nombre_completo, password: hashedPassword });
        res.status(201).json({ message: 'Usuario registrado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
