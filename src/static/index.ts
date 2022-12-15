// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
// https://stackoverflow.com/a/59116316

function validateEmail(text: string) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

// Password valida: lunghezza >= 8 caratteri, una maiuscola, una minuscola, un carattere speciale (%&#!@*^)
function validatePassword(text: string) {
    var re = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[%&#!@\*\^]).{8,})$/;
    return re.test(text);
}

function registration() {
    let email:string = (<HTMLInputElement>document.getElementById('emailRegistrazione')).value;
    let password:string = (<HTMLInputElement>document.getElementById('passwordRegistrazione')).value;
    let confermaPassword:string = (<HTMLInputElement>document.getElementById('confermaPassword')).value;

    if (!validateEmail(email)) {
        alert('Indirizzo email non valido');
        return false;
    }

    if (!validatePassword(password)) {
        alert('Password non valida');
        return false;
    }

    if (password != confermaPassword) {
        alert('Le password non combaciano');
        return false;
    }

    return true;
}

function login() {
    let email:string = (<HTMLInputElement>document.getElementById('emailLogin')).value;
    let password:string = (<HTMLInputElement>document.getElementById('passwordLogin')).value;

    if (email == "" || password == "") {
        alert('Inserire le credenziali');
        return false;
    }

    return true;
}