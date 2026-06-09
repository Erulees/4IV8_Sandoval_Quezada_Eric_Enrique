const express = require('express');
const router = express.Router();
const db = require('../DB/database');

function validarArsenal(datos) {
    const errores = [];
    if (!datos.nombre || datos.nombre.trim().length < 2) errores.push('El nombre del objeto es obligatorio');
    if (!datos.tipo || datos.tipo.trim().length < 2) errores.push('Define si es Máscara o Arma');
    if (!datos.habilidad || datos.habilidad.trim().length < 5) errores.push('Describe qué hace esta pieza');
    return errores;
}

router.get('/', async (req, res) => {
    try {
        const [arsenal] = await db.execute('SELECT * FROM arsenal ORDER BY id ASC');
        res.json({ status: 'success', data: arsenal, count: arsenal.length });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'El maletero del auto no abre.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const errores = validarArsenal(req.body);
        if (errores.length > 0) return res.status(400).json({ status: 'error', message: errores.join('; ') });

        const { nombre, tipo, habilidad, imagen_url } = req.body;
        const [resultado] = await db.execute(
            'INSERT INTO arsenal (nombre, tipo, habilidad, imagen_url) VALUES (?, ?, ?, ?)',
            [nombre.trim(), tipo.trim(), habilidad.trim(), imagen_url ? imagen_url.trim() : null]
        );

        const [nueva] = await db.execute('SELECT * FROM arsenal WHERE id = ?', [resultado.insertId]);
        res.status(201).json({ status: 'success', data: nueva[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al añadir al inventario.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [item] = await db.execute('SELECT id, nombre FROM arsenal WHERE id = ?', [req.params.id]);
        if (item.length === 0) return res.status(404).json({ status: 'error', message: 'Objeto no encontrado' });

        await db.execute('DELETE FROM arsenal WHERE id = ?', [req.params.id]);
        res.json({ status: 'success', data: { mensaje: `Objeto "${item[0].nombre}" arrojado a la basura` } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;