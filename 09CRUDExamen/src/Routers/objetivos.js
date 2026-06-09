const express = require('express');
const router = express.Router();
const db = require('../DB/database');

function validarObjetivo(datos) {
    const errores = [];
    if (!datos.nombre || datos.nombre.trim().length < 2) errores.push('Se requiere el nombre del objetivo');
    if (!datos.faccion || datos.faccion.trim().length < 2) errores.push('Identifica a qué mafia pertenece');
    if (!datos.ubicacion || datos.ubicacion.trim().length < 3) errores.push('Necesitamos una dirección para la limpieza');
    return errores;
}

router.get('/', async (req, res) => {
    try {
        const [objetivos] = await db.execute('SELECT * FROM objetivos ORDER BY id ASC');
        res.json({ status: 'success', data: objetivos, count: objetivos.length });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Fallo en el radar.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const errores = validarObjetivo(req.body);
        if (errores.length > 0) return res.status(400).json({ status: 'error', message: errores.join('; ') });

        const { nombre, faccion, ubicacion } = req.body;
        const [resultado] = await db.execute(
            'INSERT INTO objetivos (nombre, faccion, ubicacion) VALUES (?, ?, ?)',
            [nombre.trim(), faccion.trim(), ubicacion.trim()]
        );

        const [nuevo] = await db.execute('SELECT * FROM objetivos WHERE id = ?', [resultado.insertId]);
        res.status(201).json({ status: 'success', data: nuevo[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [objetivo] = await db.execute('SELECT id, nombre FROM objetivos WHERE id = ?', [req.params.id]);
        if (objetivo.length === 0) return res.status(404).json({ status: 'error', message: 'Objetivo no encontrado' });

        await db.execute('DELETE FROM objetivos WHERE id = ?', [req.params.id]);
        res.json({ status: 'success', data: { mensaje: `Edificio limpiado. "${objetivo[0].nombre}" erradicado` } });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
            return res.status(409).json({ status: 'error', message: 'Aún hay trabajos inconclusos vinculados a esta mafia.' });
        }
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;