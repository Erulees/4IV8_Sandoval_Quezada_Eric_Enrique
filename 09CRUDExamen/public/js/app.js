// =========================================================
// CEREBRO DE LA OPERACIÓN - 50 BLESSINGS (app.js) - PRO MODE
// =========================================================

const notificacionDiv = document.getElementById('notificacion');

// 1. SISTEMA DE ALERTAS (Mensajes del Contestador)
function mostrarNotificacion(mensaje, tipo = 'exito') {
    notificacionDiv.textContent = mensaje;
    notificacionDiv.className = `notificacion ${tipo}`;
    notificacionDiv.style.display = 'block';
    // Colgar la llamada después de 4 segundos
    setTimeout(() => { notificacionDiv.style.display = 'none'; }, 4000);
}

// 2. FETCH CENTRALIZADO (CORREGIDO: Ahora usa la URL dinámica)
async function fetchAPI(url, opciones = {}) {
    const met = opciones.method || 'GET';
    
    // Actualizar monitores visuales si existen
    if(document.getElementById('api-metodo')) document.getElementById('api-metodo').textContent = met;
    if(document.getElementById('api-url')) document.getElementById('api-url').textContent = url;
    
    const uiCodigo = document.getElementById('api-codigo');

    try {
        // CORRECCIÓN PRO: Usamos la 'url' que recibe la función, no una fija
        const respuesta = await fetch(url, opciones); 
        const data = await respuesta.json();
        
        if (uiCodigo) {
            uiCodigo.textContent = respuesta.status;
            uiCodigo.className = `badge ${respuesta.ok ? 'badge-success' : 'badge-error'}`;
        }
        
        return { ok: respuesta.ok, status: respuesta.status, data };
    } catch (error) {
        if (uiCodigo) {
            uiCodigo.textContent = 'DEAD';
            uiCodigo.className = 'badge badge-error';
        }
        mostrarNotificacion('La línea está muerta. No hay conexión con el servidor.', 'error');
        console.error('50 Blessings Error:', error);
        return { ok: false, data: { status: 'error', message: 'Servidor no responde' } };
    }
}

// 3. UTILIDAD PARA BLOQUEAR BOTONES
function procesandoFormulario(botonId, cargando) {
    const btn = document.getElementById(botonId);
    if (!btn) return;
    if (cargando) {
        btn.disabled = true;
        btn.dataset.textoOriginal = btn.textContent;
        btn.textContent = 'Marcando...';
        btn.style.opacity = '0.5';
    } else {
        btn.disabled = false;
        btn.textContent = btn.dataset.textoOriginal || 'Guardar';
        btn.style.opacity = '1';
    }
}

// 4. NAVEGACIÓN SPA (CORREGIDO: Evita saltos inesperados)
function cambiarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
    // Quitar clase activa de los botones
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    
    // Mostrar sección actual
    const seccionDestino = document.getElementById(`seccion-${seccion}`);
    if (seccionDestino) {
        seccionDestino.style.display = 'block';
    }

    // Activar botón correspondiente
    const btnActivo = document.querySelector(`button[onclick="cambiarSeccion('${seccion}')"]`);
    if (btnActivo) btnActivo.classList.add('active');
    
    // Cargar datos según la sección
    if (seccion === 'encargos') cargarEncargos();
    if (seccion === 'objetivos') cargarObjetivos();
    if (seccion === 'operativos') cargarOperativos();
}

// =========================================================
// MÓDULOS CRUD
// =========================================================

// --- OPERATIVOS ---
async function cargarOperativos() {
    const res = await fetchAPI('/api/operativos');
    if (!res.ok) return;
    
    const tbody = document.getElementById('tbody-operativos');
    if(!tbody) return;

    tbody.innerHTML = res.data.data.map(o => `
        <tr>
            <td>${o.id}</td><td>${o.pseudonimo}</td><td>${o.mascara}</td><td>${o.nivel_peligro}</td>
            <td><button class="btn-eliminar" onclick="eliminarOperativo(${o.id})">Borrar Registro</button></td>
        </tr>
    `).join('');
    
    document.getElementById('tabla-operativos').style.display = 'table';
    document.getElementById('contador-operativos').textContent = res.data.count;
    document.getElementById('carga-operativos').style.display = 'none';
}

document.getElementById('form-operativo').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    procesandoFormulario('btn-guardar-operativo', true);

    const payload = {
        pseudonimo: document.getElementById('operativo-nombre').value,
        mascara: document.getElementById('operativo-mascara').value,
        nivel_peligro: document.getElementById('operativo-peligro').value
    };

    const res = await fetchAPI('/api/operativos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    procesandoFormulario('btn-guardar-operativo', false);

    if (!res.ok) {
        mostrarNotificacion(res.data.message || 'Error al guardar', 'error');
    } else {
        mostrarNotificacion('Operativo suscrito a los mensajes.');
        cargarOperativos();
        e.target.reset();
    }
});

async function eliminarOperativo(id) {
    if(!confirm('¿Desconectar a este operativo?')) return;
    const res = await fetchAPI(`/api/operativos/${id}`, { method: 'DELETE' });
    if (res.ok) {
        mostrarNotificacion('Registro eliminado');
        cargarOperativos();
    }
}

// --- OBJETIVOS (Aquí estaba el error que te regresaba a operativos) ---
async function cargarObjetivos() {
    const res = await fetchAPI('/api/objetivos');
    if (!res.ok) return;

    const tbody = document.getElementById('tbody-objetivos');
    if(!tbody) return;

    tbody.innerHTML = res.data.data.map(obj => `
        <tr>
            <td>${obj.id}</td><td>${obj.nombre}</td><td>${obj.faccion}</td><td>${obj.ubicacion}</td>
            <td><button class="btn-eliminar" onclick="eliminarObjetivo(${obj.id})">Limpiar Zona</button></td>
        </tr>
    `).join('');
    document.getElementById('tabla-objetivos').style.display = 'table';
    document.getElementById('contador-objetivos').textContent = res.data.count;
    document.getElementById('carga-objetivos').style.display = 'none';
}

document.getElementById('form-objetivo').addEventListener('submit', async (e) => {
    e.preventDefault(); // CRÍTICO: Evita el salto a Operativos
    procesandoFormulario('btn-guardar-objetivo', true);

    const payload = {
        nombre: document.getElementById('objetivo-nombre').value,
        faccion: document.getElementById('objetivo-faccion').value,
        ubicacion: document.getElementById('objetivo-ubicacion').value
    };

    // CORREGIDO: Ahora va a /api/objetivos
    const res = await fetchAPI('/api/objetivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    procesandoFormulario('btn-guardar-objetivo', false);

    if (!res.ok) {
        mostrarNotificacion(res.data.message, 'error');
    } else {
        mostrarNotificacion('Nuevo encargo agendado.');
        cargarObjetivos();
        e.target.reset();
    }
});

async function eliminarObjetivo(id) {
    if(!confirm('¿Zona limpia?')) return;
    const res = await fetchAPI(`/api/objetivos/${id}`, { method: 'DELETE' });
    if (res.ok) {
        mostrarNotificacion('Evidencia borrada');
        cargarObjetivos();
    }
}

// --- ENCARGOS ---
async function cargarEncargos() {
    const res = await fetchAPI('/api/encargos');
    if (!res.ok) return;

    const tbody = document.getElementById('tbody-encargos');
    
    // Actualizar Selects
    const opRes = await fetchAPI('/api/operativos');
    const obRes = await fetchAPI('/api/objetivos');
    
    if (opRes.ok && document.getElementById('encargo-operativo')) {
        document.getElementById('encargo-operativo').innerHTML = `<option value="">-- Seleccionar Operativo --</option>` + 
            opRes.data.data.map(o => `<option value="${o.id}">${o.pseudonimo} (${o.mascara})</option>`).join('');
    }
    if (obRes.ok && document.getElementById('encargo-objetivo')) {
        document.getElementById('encargo-objetivo').innerHTML = `<option value="">-- Seleccionar Objetivo --</option>` + 
            obRes.data.data.map(obj => `<option value="${obj.id}">${obj.nombre} - ${obj.ubicacion}</option>`).join('');
    }

    if(tbody) {
        tbody.innerHTML = res.data.data.map(e => `
            <tr>
                <td>${e.id}</td><td>${e.operativo_nombre}</td><td>${e.objetivo_nombre}</td>
                <td>${e.arma_usada}</td><td>${e.puntuacion} pts</td><td>${new Date(e.fecha).toLocaleString()}</td>
                <td><button class="btn-eliminar" onclick="eliminarEncargo(${e.id})">Borrar Evidencia</button></td>
            </tr>
        `).join('');
    }
    document.getElementById('tabla-encargos').style.display = 'table';
    document.getElementById('contador-encargos').textContent = res.data.count;
    document.getElementById('carga-encargos').style.display = 'none';
}

document.getElementById('form-encargo').addEventListener('submit', async (e) => {
    e.preventDefault();
    procesandoFormulario('btn-registrar-encargo', true);

    const payload = {
        operativo_id: document.getElementById('encargo-operativo').value,
        objetivo_id: document.getElementById('encargo-objetivo').value,
        arma_usada: document.getElementById('encargo-arma').value,
        puntuacion: document.getElementById('encargo-puntuacion').value
    };

    const res = await fetchAPI('/api/encargos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    procesandoFormulario('btn-registrar-encargo', false);

    if (!res.ok) mostrarNotificacion(res.data.message, 'error');
    else {
        mostrarNotificacion('El trabajo está hecho.');
        cargarEncargos();
        e.target.reset();
    }
});

// 5. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    // Cargar la sección inicial
    cambiarSeccion('operativos');
});