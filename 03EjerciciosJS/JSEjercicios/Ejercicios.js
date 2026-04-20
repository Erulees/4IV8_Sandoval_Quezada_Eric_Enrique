// Ayudante para mostrar resultados
const mostrar = (id, msg) => document.getElementById(id).innerText = msg;

// 1. Inversión (2% mensual) [cite: 4]
function p1_inversion() {
    const capital = parseFloat(document.getElementById('p1_capital').value);
    if (isNaN(capital)) return alert("Ingresa un capital válido");
    const ganancia = capital * 0.02;
    mostrar('res1', `Ganarás $${ganancia.toFixed(2)} después de un mes.`);
}

// 2. Vendedor (Sueldo + 10% ventas) [cite: 5]
function p2_comisiones() {
    const sb = parseFloat(document.getElementById('p2_sueldo').value);
    const v1 = parseFloat(document.getElementById('p2_v1').value);
    const v2 = parseFloat(document.getElementById('p2_v2').value);
    const v3 = parseFloat(document.getElementById('p2_v3').value);
    
    if ([sb, v1, v2, v3].some(isNaN)) return alert("Completa todos los campos");
    
    const comision = (v1 + v2 + v3) * 0.10;
    const total = sb + comision;
    mostrar('res2', `Comisiones: $${comision.toFixed(2)} | Total Mensual: $${total.toFixed(2)}`);
}

// 3. Tienda (15% descuento) [cite: 6]
function p3_descuento() {
    const total = parseFloat(document.getElementById('p3_compra').value);
    if (isNaN(total)) return alert("Ingresa el monto de la compra");
    const final = total * 0.85;
    mostrar('res3', `Total con 15% de descuento: $${final.toFixed(2)}`);
}

// 4. Calificación Final [cite: 8, 9, 10, 11]
function p4_promedio() {
    const c1 = parseFloat(document.getElementById('p4_c1').value);
    const c2 = parseFloat(document.getElementById('p4_c2').value);
    const c3 = parseFloat(document.getElementById('p4_c3').value);
    const ef = parseFloat(document.getElementById('p4_ef').value);
    const tf = parseFloat(document.getElementById('p4_tf').value);

    if ([c1, c2, c3, ef, tf].some(isNaN)) return alert("Ingresa todas las notas");

    const promedioParciales = (c1 + c2 + c3) / 3;
    const notaFinal = (promedioParciales * 0.55) + (ef * 0.30) + (tf * 0.15);
    mostrar('res4', `Calificación Final: ${notaFinal.toFixed(2)}`);
}

// 5. Género [cite: 12]
function p5_porcentaje() {
    const h = parseInt(document.getElementById('p5_h').value);
    const m = parseInt(document.getElementById('p5_m').value);
    const total = h + m;

    if (isNaN(total) || total === 0) return alert("Ingresa cantidades válidas");

    const ph = (h / total) * 100;
    const pm = (m / total) * 100;
    mostrar('res5', `Hombres: ${ph.toFixed(1)}% | Mujeres: ${pm.toFixed(1)}%`);
}

// 6. Edad [cite: 13]
function p6_edad() {
    const anioNac = parseInt(document.getElementById('p6_anio').value);
    const anioActual = new Date().getFullYear();
    if (isNaN(anioNac) || anioNac > anioActual) return alert("Año no válido");
    
    mostrar('res6', `La edad es: ${anioActual - anioNac} años.`);
}