const express = require('express');
const router = express.Router();
const db = require('../DB/database');

function validarEncargo(datos) {
    const errores = [];
    if (!datos.operativo_id || parseInt(datos.operativo_id) <= 0) errores.push('Selecciona quién hizo la llamada');
    if (!datos.objetivo_id || parseInt(datos.objetivo_id) <= 0) errores.push('Selecciona el objetivo del trabajo');
    if (!datos.arma_usada || datos.arma_usada.trim() === '') errores.push('¿Con qué hiciste el trabajo?');
    if (!datos.puntuacion || parseInt(datos.puntuacion) <= 0) errores.push('La puntuación debe ser mayor a 0');
    return errores;
}

router.get('/', async (req, res) => {
    try {
        const [encargos] = await db.execute(`
            SELECT 
                e.id, 
                o.pseudonimo AS operativo_nombre, 
                ob.nombre AS objetivo_nombre, 
                e.arma_usada, 
                e.puntuacion, 
                e.fecha
            FROM encargos e
            INNER JOIN operativos o ON e.operativo_id = o.id
            INNER JOIN objetivos ob ON e.objetivo_id = ob.id
            ORDER BY e.fecha DESC
        `);
        res.json({ status: 'success', data: encargos, count: encargos.length });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'No se puede acceder a las cintas de seguridad.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const errores = validarEncargo(req.body);
        if (errores.length > 0) return res.status(400).json({ status: 'error', message: errores.join('; ') });

        const { operativo_id, objetivo_id, arma_usada, puntuacion } = req.body;

        const [resultado] = await db.execute(
            'INSERT INTO encargos (operativo_id, objetivo_id, arma_usada, puntuacion) VALUES (?, ?, ?, ?)',
            [parseInt(operativo_id), parseInt(objetivo_id), arma_usada.trim(), parseInt(puntuacion)]
        );

        res.status(201).json({ 
            status: 'success', 
            data: { id: resultado.insertId, mensaje: 'Encargo completado. Vuelve a casa.' }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al grabar la cinta.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [existente] = await db.execute('SELECT id FROM encargos WHERE id = ?', [id]);
        if (existente.length === 0) return res.status(404).json({ status: 'error', message: 'Registro no encontrado' });

        await db.execute('DELETE FROM encargos WHERE id = ?', [id]);
        res.json({ status: 'success', data: { mensaje: `Evidencia del encargo destruida` } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;