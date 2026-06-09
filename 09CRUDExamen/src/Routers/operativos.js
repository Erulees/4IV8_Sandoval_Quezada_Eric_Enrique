const express = require('express');
const router = express.Router();
const db = require('../DB/database');

function validarOperativo(datos) {
    const errores = [];
    if (!datos.pseudonimo || datos.pseudonimo.trim().length < 2) errores.push('¿Quién eres? El pseudónimo es obligatorio');
    if (!datos.mascara || datos.mascara.trim().length < 2) errores.push('Un operativo sin máscara es hombre muerto');
    if (!datos.nivel_peligro || isNaN(datos.nivel_peligro)) errores.push('Define tu nivel de amenaza con un número');
    return errores;
}

router.get('/', async (req, res) => {
    try {
        const [operativos] = await db.execute('SELECT * FROM operativos ORDER BY id ASC');
        res.json({ status: 'success', data: operativos, count: operativos.length });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Interferencia en la línea.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const errores = validarOperativo(req.body);
        if (errores.length > 0) return res.status(400).json({ status: 'error', message: errores.join('; ') });

        const { pseudonimo, mascara, nivel_peligro } = req.body;
        const [resultado] = await db.execute(
            'INSERT INTO operativos (pseudonimo, mascara, nivel_peligro) VALUES (?, ?, ?)',
            [pseudonimo.trim(), mascara.trim(), parseInt(nivel_peligro)]
        );

        const [nuevo] = await db.execute('SELECT * FROM operativos WHERE id = ?', [resultado.insertId]);
        res.status(201).json({ status: 'success', data: nuevo[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al registrar en la base de datos.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [operativo] = await db.execute('SELECT id, pseudonimo FROM operativos WHERE id = ?', [req.params.id]);
        if (operativo.length === 0) return res.status(404).json({ status: 'error', message: 'Nadie responde a ese número' });

        await db.execute('DELETE FROM operativos WHERE id = ?', [req.params.id]);
        res.json({ status: 'success', data: { mensaje: `Operativo "${operativo[0].pseudonimo}" desconectado permanentemente` } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;