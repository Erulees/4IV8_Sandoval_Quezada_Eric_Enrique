// =========================================================
// CENTRAL TELEFÓNICA - 50 BLESSINGS (server.js) - PRO MODE
// =========================================================

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de la aplicación
app.use(cors());
app.use(express.json());

// Logger de consola estilo Contestadora Hotline Miami
app.use((req, res, next) => {
    console.log(`[50-BLESSINGS-BEEP][${new Date().toLocaleTimeString()}] ${req.method} -> ${req.url}`);
    next();
});

// CORRECCIÓN 1: Servir archivos estáticos apuntando correctamente a la raíz (saliendo de src)
app.use(express.static(path.join(__dirname, '../public')));

// Importación de Routers desde la carpeta src/Routers/
const operativosRouter = require('./Routers/operativos');
const objetivosRouter  = require('./Routers/objetivos');
const encargosRouter   = require('./Routers/encargos');
const arsenalRouter    = require('./Routers/arsenal'); 

// CORRECCIÓN 2: Registro de Endpoints usando las variables correctas y alineadas con app.js
app.use('/api/operativos', operativosRouter);
app.use('/api/objetivos', objetivosRouter);  // Corregido: antes llamadasRouter
app.use('/api/encargos', encargosRouter);    // Corregido: antes armasRouter
app.use('/api/mascaras', arsenalRouter);     // Corregido: antes mascarasRouter

// CORRECCIÓN 3: Ruta de diagnóstico del sistema actualizada
app.get('/api', (req, res) => {
    res.json({
        status: 'success',
        message: 'LÍNEA SEGURA 50 BLESSINGS. ESTAMOS ESCUCHANDO.',
        red_activa: {
            operativos: '/api/operativos',
            objetivos: '/api/objetivos',
            encargos: '/api/encargos',
            mascaras: '/api/mascaras'
        }
    });
});

// Captura de rutas no autorizadas en la API
app.use('/api/*path', (req, res) => {
    res.status(404).json({ 
        status: 'error', 
        message: 'LÍNEA EQUIVOCADA. Cuelgue el teléfono inmediatamente.' 
    });
});

// Manejador global de excepciones críticas
app.use((err, req, res, next) => {
    console.error('CINTA ATASCADA:', err.message);
    res.status(500).json({ 
        status: 'error', 
        message: 'Error en la contestadora. Llame más tarde.' 
    });
});

app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`   RED DE 50 BLESSINGS EN LÍNEA - CONTESTADORA LISTA   `);
    console.log(`   Escuchando el teléfono en el puerto: ${PORT}        `);
    console.log(`=======================================================`);
});