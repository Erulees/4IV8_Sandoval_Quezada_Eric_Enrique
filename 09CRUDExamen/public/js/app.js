// =========================================================
// CEREBRO DE LA OPERACIÓN - 50 BLESSINGS (app.js) - PRO MODE
// =========================================================

const notificacionDiv = document.getElementById('notificacion');

// 1. SISTEMA DE ALERTAS
function mostrarNotificacion(mensaje, tipo = 'exito') {
    notificacionDiv.textContent = mensaje;
    notificacionDiv.className = `notificacion ${tipo}`;
    notificacionDiv.style.display = 'block';
    setTimeout(() => { notificacionDiv.style.display = 'none'; }, 4000);
}

// 2. FETCH CENTRALIZADO 
async function fetchAPI(url, opciones = {}) {
    const met = opciones.method || 'GET';
    if(document.getElementById('api-metodo')) document.getElementById('api-metodo').textContent = met;
    if(document.getElementById('api-url')) document.getElementById('api-url').textContent = url;
    const uiCodigo = document.getElementById('api-codigo');

    try {
        const respuesta = await fetch(url, opciones); 
        const data = await respuesta.json();
        
        if (uiCodigo) {
            uiCodigo.textContent = respuesta.status;
            uiCodigo.className = `badge ${respuesta.ok ? 'badge-success' : 'badge-error'}`;
        }
        return { ok: respuesta.ok, status: respuesta.status, data };
    } catch (error) {
        if (uiCodigo) uiCodigo.textContent = 'DEAD';
        mostrarNotificacion('La línea está muerta. No hay conexión.', 'error');
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

// 4. NAVEGACIÓN SPA
function cambiarSeccion(seccion) {
    document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    
    const seccionDestino = document.getElementById(`seccion-${seccion}`);
    if (seccionDestino) seccionDestino.style.display = 'block';

    const btnActivo = document.querySelector(`button[onclick="cambiarSeccion('${seccion}')"]`);
    if (btnActivo) btnActivo.classList.add('active');
    
    if (seccion === 'operativos') cargarOperativos();
    if (seccion === 'mascaras') cargarMascaras();
    if (seccion === 'armas') cargarArmas();
    if (seccion === 'llamadas') {
        cargarLlamadas();
        cargarOpcionesLlamada(); // ¡NUEVO! Llama a los datos para los selectores
    }
}

// =========================================================
// FUNCIONES DE BORRADO
// =========================================================
async function eliminarOperativo(id) {
    if (!confirm('¿Desconectar permanentemente a este operativo?')) return;
    const res = await fetchAPI(`/api/operativos/${id}`, { method: 'DELETE' });
    if (res.ok) cargarOperativos();
}

async function eliminarMascara(id) {
    if (!confirm('¿Destruir esta máscara del inventario?')) return;
    const res = await fetchAPI(`/api/arsenal/${id}`, { method: 'DELETE' });
    if (res.ok) cargarMascaras();
}

async function eliminarArma(id) {
    if (!confirm('¿Arrojar esta arma a la basura?')) return;
    const res = await fetchAPI(`/api/arsenal/${id}`, { method: 'DELETE' });
    if (res.ok) cargarArmas();
}

async function eliminarLlamada(id) {
    if (!confirm('¿Borrar esta cinta de evidencia?')) return;
    const res = await fetchAPI(`/api/encargos/${id}`, { method: 'DELETE' });
    if (res.ok) cargarLlamadas();
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
    if(document.getElementById('carga-operativos')) document.getElementById('carga-operativos').style.display = 'none';
}

const formOperativo = document.getElementById('form-operativo');
if (formOperativo) {
    formOperativo.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        procesandoFormulario('btn-guardar-operativo', true);

        let nivelPeligroNum = parseInt(document.getElementById('operativo-estado') ? document.getElementById('operativo-estado').value : 1);
        if (isNaN(nivelPeligroNum)) nivelPeligroNum = 1; 

        const payload = {
            pseudonimo: document.getElementById('operativo-nombre').value,
            mascara: document.getElementById('operativo-alias').value, 
            nivel_peligro: nivelPeligroNum 
        };

        const res = await fetchAPI('/api/operativos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        procesandoFormulario('btn-guardar-operativo', false);

        if (!res.ok) mostrarNotificacion(res.data.message || 'Error al guardar', 'error');
        else { mostrarNotificacion('Operativo suscrito a los mensajes.'); cargarOperativos(); e.target.reset(); }
    });
}

// --- MÁSCARAS (Apunta a Arsenal) ---
async function cargarMascaras() {
    const res = await fetchAPI('/api/arsenal');
    if (!res.ok) return;
    const tbody = document.getElementById('tbody-mascaras');
    if(!tbody) return;

    const mascaras = res.data.data.filter(m => m.tipo.toLowerCase() === 'máscara' || m.tipo.toLowerCase() === 'mascara');
    
    tbody.innerHTML = mascaras.map(m => `
        <tr>
            <td>${m.id}</td><td>-</td><td>${m.nombre}</td><td>${m.habilidad}</td>
            <td><button class="btn-eliminar" onclick="eliminarMascara(${m.id})">Romper Máscara</button></td>
        </tr>
    `).join('');
    document.getElementById('tabla-mascaras').style.display = 'table';
    if(document.getElementById('carga-mascaras')) document.getElementById('carga-mascaras').style.display = 'none';
}

const formMascara = document.getElementById('form-mascara');
if (formMascara) {
    formMascara.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        procesandoFormulario('btn-guardar-mascara', true);

        const animalInput = document.getElementById('mascara-animal') ? document.getElementById('mascara-animal').value : '';
        const nombreInput = document.getElementById('mascara-nombre').value;
        const nombreFinal = animalInput ? `${animalInput} - ${nombreInput}` : nombreInput;

        const payload = {
            nombre: nombreFinal,
            tipo: 'Máscara', 
            habilidad: document.getElementById('mascara-habilidad').value
        };

        const res = await fetchAPI('/api/arsenal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        procesandoFormulario('btn-guardar-mascara', false);

        if (!res.ok) mostrarNotificacion(res.data.message || 'Error al guardar', 'error');
        else { mostrarNotificacion('Máscara añadida al inventario.'); cargarMascaras(); e.target.reset(); }
    });
}

// --- ARMAS (Apunta a Arsenal) ---
async function cargarArmas() {
    const res = await fetchAPI('/api/arsenal');
    if (!res.ok) return;
    const tbody = document.getElementById('tbody-armas');
    if(!tbody) return;

    const armas = res.data.data.filter(a => a.tipo.toLowerCase() === 'arma');

    tbody.innerHTML = armas.map(a => `
        <tr>
            <td>${a.id}</td><td>${a.nombre}</td><td>${a.tipo}</td><td>${a.habilidad}</td>
            <td><button class="btn-eliminar" onclick="eliminarArma(${a.id})">Descartar</button></td>
        </tr>
    `).join('');
    document.getElementById('tabla-armas').style.display = 'table';
    if(document.getElementById('carga-armas')) document.getElementById('carga-armas').style.display = 'none';
}

const formArma = document.getElementById('form-arma');
if (formArma) {
    formArma.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        procesandoFormulario('btn-guardar-arma', true);

        const payload = {
            nombre: document.getElementById('arma-nombre').value,
            tipo: 'Arma', 
            habilidad: document.getElementById('arma-lethal') ? document.getElementById('arma-lethal').value : 'Letal'
        };

        const res = await fetchAPI('/api/arsenal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        procesandoFormulario('btn-guardar-arma', false);

        if (!res.ok) mostrarNotificacion(res.data.message || 'Error al guardar arma', 'error');
        else { mostrarNotificacion('Arma guardada en el maletero.'); cargarArmas(); e.target.reset(); }
    });
}

// --- LLAMADAS (Apunta a Encargos) ---

// ¡NUEVO! Función para llenar los combos desplegables
async function cargarOpcionesLlamada() {
    const selectOperativo = document.getElementById('llamada-operativo');
    const selectMascara = document.getElementById('llamada-mascara');

    // Cargar Operativos en el select
    const resOp = await fetchAPI('/api/operativos');
    if (resOp.ok && selectOperativo) {
        selectOperativo.innerHTML = '<option value="">-- Seleccionar Operativo --</option>' + 
            resOp.data.data.map(o => `<option value="${o.id}">${o.pseudonimo} (Alias: ${o.mascara})</option>`).join('');
    }

    // Cargar Máscaras en el select (filtradas desde arsenal)
    const resMasc = await fetchAPI('/api/arsenal');
    if (resMasc.ok && selectMascara) {
        const mascaras = resMasc.data.data.filter(m => m.tipo.toLowerCase() === 'máscara' || m.tipo.toLowerCase() === 'mascara');
        // Se manda el nombre de la máscara como valor para guardarlo en arma_usada
        selectMascara.innerHTML = '<option value="">-- Seleccionar Máscara --</option>' + 
            mascaras.map(m => `<option value="${m.nombre}">${m.nombre}</option>`).join('');
    }
}

async function cargarLlamadas() {
    const res = await fetchAPI('/api/encargos');
    if (!res.ok) return;
    const tbody = document.getElementById('tbody-llamadas');
    if(!tbody) return;

    tbody.innerHTML = res.data.data.map(l => `
        <tr>
            <td>${l.id}</td><td>${l.operativo_nombre || 'Desconocido'}</td><td>${l.arma_usada}</td><td>${l.objetivo_nombre}</td><td>Pts: ${l.puntuacion}</td>
            <td><button class="btn-eliminar" onclick="eliminarLlamada(${l.id})">Borrar Cinta</button></td>
        </tr>
    `).join('');
    document.getElementById('tabla-llamadas').style.display = 'table';
    if(document.getElementById('carga-llamadas')) document.getElementById('carga-llamadas').style.display = 'none';
}

const formLlamada = document.getElementById('form-llamada');
if (formLlamada) {
    formLlamada.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        procesandoFormulario('btn-registrar-llamada', true);

        let pts = parseInt(document.getElementById('llamada-mensaje') ? document.getElementById('llamada-mensaje').value : '1000');
        if(isNaN(pts)) pts = 1000;

        const payload = {
            operativo_id: document.getElementById('llamada-operativo').value,
            objetivo_id: document.getElementById('llamada-objetivo').value,
            arma_usada: document.getElementById('llamada-mascara').value || 'Mano limpia',
            puntuacion: pts
        };

        const res = await fetchAPI('/api/encargos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        procesandoFormulario('btn-registrar-llamada', false);

        if (!res.ok) mostrarNotificacion(res.data.message || 'Error en la central', 'error');
        else { mostrarNotificacion('Mensaje dejado en la contestadora.'); cargarLlamadas(); e.target.reset(); }
    });
}

// 5. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    cambiarSeccion('operativos');
});