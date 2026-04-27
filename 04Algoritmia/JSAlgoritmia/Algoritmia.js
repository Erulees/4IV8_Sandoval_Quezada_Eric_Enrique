function problema1() {
    // Obtener texto ingresado
    var texto = document.querySelector("#p1-input").value.trim();

    if (texto === "") {
        document.querySelector("#p1-output").textContent = "Ingresa palabras.";
        return;
    }

    // Separar palabras por espacio
    var palabras = texto.split(" ");

    // Invertir orden
    palabras = palabras.reverse();

    // Mostrar resultado
    document.querySelector("#p1-output").textContent =
        "Resultado: " + palabras.join(" ");
}

function problema2() {
    // primero necesito obtener todos los valores de la tabla
    var p2_x1 = document.querySelector("#p2-x1").value;
    var p2_x2 = document.querySelector("#p2-x2").value;
    var p2_x3 = document.querySelector("#p2-x3").value;
    var p2_x4 = document.querySelector("#p2-x4").value;
    var p2_x5 = document.querySelector("#p2-x5").value;

    // vector 2
    var p2_y1 = document.querySelector("#p2-y1").value;
    var p2_y2 = document.querySelector("#p2-y2").value;
    var p2_y3 = document.querySelector("#p2-y3").value;
    var p2_y4 = document.querySelector("#p2-y4").value;
    var p2_y5 = document.querySelector("#p2-y5").value;

    // crear vectores numéricos
    var v1 = [
        Number(p2_x1),
        Number(p2_x2),
        Number(p2_x3),
        Number(p2_x4),
        Number(p2_x5)
    ];

    var v2 = [
        Number(p2_y1),
        Number(p2_y2),
        Number(p2_y3),
        Number(p2_y4),
        Number(p2_y5)
    ];

    // ordenar
    v1 = v1.sort(function(a, b) { return b - a; });
    v2 = v2.sort(function(a, b) { return a - b; });

    var p2_producto = 0;

    for (var i = 0; i < v1.length; i++) {
        p2_producto += v1[i] * v2[i];
    }

    document.querySelector("#p2-output").textContent =
        "El producto escalar mínimo es de: " + p2_producto;
}

function problema3() {
    var texto = document.querySelector("#p3-input").value.trim();

    if (texto === "") {
        document.querySelector("#p3-output").textContent =
            "Ingresa palabras.";
        return;
    }

    var palabras = texto.split(",");
    var mayor = "";
    var maximo = 0;

    for (var i = 0; i < palabras.length; i++) {
        var palabra = palabras[i].toUpperCase();
        var letrasUnicas = "";

        for (var j = 0; j < palabra.length; j++) {
            var letra = palabra[j];

            if (letrasUnicas.indexOf(letra) === -1 && letra >= "A" && letra <= "Z") {
                letrasUnicas += letra;
            }
        }

        if (letrasUnicas.length > maximo) {
            maximo = letrasUnicas.length;
            mayor = palabra;
        }
    }

    document.querySelector("#p3-output").textContent =
        "La palabra con más caracteres únicos es: " +
        mayor +
        " (" +
        maximo +
        ")";
}