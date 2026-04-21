function leerNumero(id) {
    const valor = document.getElementById(id).value.trim();

    if (valor === "") return null;

    const numero = Number(valor);

    if (!Number.isFinite(numero)) return null;

    return numero;
}

function mostrar(id, mensaje, tipo) {
    const caja = document.getElementById(id);
    caja.textContent = mensaje;
    caja.className = "resultado " + tipo;
}

function calcularInteres() {
    const capital = leerNumero("capital");
    const meses = leerNumero("meses");

    if (capital === null || meses === null) {
        mostrar("res1", "Completa los campos.", "error");
        return;
    }

    if (capital <= 0 || meses <= 0) {
        mostrar("res1", "Valores mayores a 0.", "error");
        return;
    }

    if (capital > 1000000 || meses > 120) {
        mostrar("res1", "Valores demasiado grandes.", "error");
        return;
    }

    const interes = capital * 0.02 * meses;
    const total = capital + interes;

    mostrar("res1", `Interés: $${interes.toFixed(2)} | Total: $${total.toFixed(2)}`, "exito");
}

function calcularSueldo() {
    const sueldo = leerNumero("sueldo");
    const v1 = leerNumero("venta1");
    const v2 = leerNumero("venta2");
    const v3 = leerNumero("venta3");

    if (sueldo === null || v1 === null || v2 === null || v3 === null) {
        mostrar("res2", "Completa todos los campos.", "error");
        return;
    }

    if (sueldo < 0 || v1 < 0 || v2 < 0 || v3 < 0) {
        mostrar("res2", "No negativos.", "error");
        return;
    }

    if (sueldo > 1000000 || v1 > 1000000 || v2 > 1000000 || v3 > 1000000) {
        mostrar("res2", "Valores demasiado grandes.", "error");
        return;
    }

    const comision = (v1 + v2 + v3) * 0.10;
    const total = sueldo + comision;

    mostrar("res2", `Comisión: $${comision.toFixed(2)} | Total: $${total.toFixed(2)}`, "exito");
}

function calcularDescuento() {
    const compra = leerNumero("compra");

    if (compra === null) {
        mostrar("res3", "Ingresa un número válido.", "error");
        return;
    }

    if (compra <= 0) {
        mostrar("res3", "Debe ser mayor que 0.", "error");
        return;
    }

    if (compra > 1000000) {
        mostrar("res3", "Cantidad demasiado grande.", "error");
        return;
    }

    const descuento = compra * 0.15;
    const total = compra - descuento;

    mostrar("res3", `Descuento: $${descuento.toFixed(2)} | Total: $${total.toFixed(2)}`, "exito");
}

function validarCalificacion(n) {
    return n !== null && n >= 0 && n <= 10;
}

function calcularCalificacion() {
    const p1 = leerNumero("p1");
    const p2 = leerNumero("p2");
    const p3 = leerNumero("p3");
    const examen = leerNumero("examen");
    const trabajo = leerNumero("trabajo");

    if (!validarCalificacion(p1) || !validarCalificacion(p2) || !validarCalificacion(p3) || !validarCalificacion(examen) || !validarCalificacion(trabajo)) {
        mostrar("res4", "Valores entre 0 y 10.", "error");
        return;
    }

    const promedio = (p1 + p2 + p3) / 3;
    const final = (promedio * 0.55) + (examen * 0.30) + (trabajo * 0.15);

    mostrar("res4", `Final: ${final.toFixed(2)}`, "exito");
}

function calcularPorcentajes() {
    const hombres = leerNumero("hombres");
    const mujeres = leerNumero("mujeres");

    if (hombres === null || mujeres === null) {
        mostrar("res5", "Datos inválidos.", "error");
        return;
    }

    if (hombres < 0 || mujeres < 0) {
        mostrar("res5", "No negativos.", "error");
        return;
    }

    if (!Number.isInteger(hombres) || !Number.isInteger(mujeres)) {
        mostrar("res5", "Solo enteros.", "error");
        return;
    }

    if (hombres > 1000 || mujeres > 1000) {
        mostrar("res5", "Cantidad demasiado grande.", "error");
        return;
    }

    const total = hombres + mujeres;

    if (total === 0) {
        mostrar("res5", "Total no puede ser 0.", "error");
        return;
    }

    const ph = (hombres / total) * 100;
    const pm = (mujeres / total) * 100;

    mostrar("res5", `H: ${ph.toFixed(2)}% | M: ${pm.toFixed(2)}%`, "exito");
}

function calcularEdad() {
    const anio = leerNumero("anioNacimiento");
    const actual = new Date().getFullYear();

    if (anio === null) {
        mostrar("res6", "Ingresa un año válido.", "error");
        return;
    }

    if (!Number.isInteger(anio)) {
        mostrar("res6", "Debe ser entero.", "error");
        return;
    }

    if (anio > actual) {
        mostrar("res6", "No puede ser futuro.", "error");
        return;
    }

    if (anio < 1900) {
        mostrar("res6", "Año no válido.", "error");
        return;
    }

    const edad = actual - anio;

    mostrar("res6", `Edad: ${edad}`, "exito");
}