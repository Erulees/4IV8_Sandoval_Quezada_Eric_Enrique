function validar(formulario){
    var nombre = formulario.nombre.value.trim();
    var edad = formulario.edad.value.trim();
    var email = formulario.email.value.trim();
    if (nombre.length === 0) {
        alert("Por favor escriba su nombre.");
        formulario.nombre.focus();
        return false;
    }
    if (nombre.length < 3) {
        alert("Por favor ingrese un nombre valido (mas letras)");
        formulario.nombre.focus();
        return false;
    }
    var nombreOK = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!nombreOK.test(nombre)) {
        alert("Por favor escriba únicamente letras en el campo nombre.");
        formulario.nombre.focus();
        return false;
    }
    if (edad.length === 0) {
        alert("Por favor escriba su edad.");
        formulario.edad.focus();
        return false;
    }
    var edadNumero = Number(edad);
    if (isNaN(edadNumero)) {
        alert("Por favor escriba únicamente números en el campo edad.");
        formulario.edad.focus();
        return false;
    }
    if (edadNumero < 1 || edadNumero > 100) {
        alert("Edad invalida. La edad debe ser mayor a 0 y menor o igual a 100 años");
        formulario.edad.focus();
        return false;
    }
    if (email.length === 0) {
        alert("Por favor escriba su correo electrónico.");
        formulario.email.focus();
        return false;
    }
    var correoOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoOK.test(email)) {
        alert("Por favor escriba un correo válido.");
        formulario.email.focus();
        return false;
    }
    alert("Formulario enviado correctamente.");
    return true;
}