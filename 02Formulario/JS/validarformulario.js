function validar(formulario){

    //Vamos a crear una función para validar un número mínimo de caracteres en el nombre
    if(formulario.nombre.value.length < 3){
        alert("Por favor ingrese un nombre mayor de 3 caracteres");
        formulario.nombre.focus();
        return false;
    }

    var abcOK = "QWERTYUIOPASDFGHJKLÑZXCVBNM"+"qwertyuiopasdfghjklñzxcvbnm";

    var checkString = formulario.nombre.value;

    var allValid = true;

    //tenemos que ir comparando y recorriendo la cadena caracter por caracter
    for(var i = 0; i < checkString.length; i++){
        //necesito la cadena pasarla a caracter
        var caracteres = checkString.charAt(i);
        for(var j = 0; j < abcOK.length; j++){
            if(caracteres == abcOK.charAt(j)){
                break;
            }
        }
        if(j == abcOK.length){
            allValid = false;
            break;
        }
    }
    if(!allValid){
        alert("Por favor escriba unicamente letras en el campo nombre");
        formulario.nombre.focus();
        return false;
    }

    var abcOK = "1234567890";

    var checkString = formulario.edad.value;

    var allValid = true;

    //tenemos que ir comparando y recorriendo la cadena caracter por caracter
    for(var i = 0; i < checkString.length; i++){
        //necesito la cadena pasarla a caracter
        var caracteres = checkString.charAt(i);
        for(var j = 0; j < abcOK.length; j++){
            if(caracteres == abcOK.charAt(j)){
                break;
            }
        }
        if(j == abcOK.length){
            allValid = false;
            break;
        }
    }
    if(!allValid){
        alert("Por favor escriba unicamente números en el campo edad");
        formulario.edad.focus();
        return false;
    }
    //algo.algo@algo.algo SAQE080112

    var correoelectronico = /^[^@\s]+[^@\.\s]+(\.[^@\.\s]+)+$/;

    var txt = formulario.email.value;

    alert("Email " + (correoelectronico.test(txt)?" ":" no " )+"valido");
}