window.onload = function () {
    document.getElementById('password1').length = 0;
    document.getElementById('password2').length = 0;
}

var pwdCheck = document.getElementById('password2');
pwdCheck.addEventListener('blur', checkFields, false);

//Password regex checking
var input = document.getElementById("password1");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");

//user clicks on password entry, show requirements
input.onfocus = function () {
    document.getElementById("message").style.display = "block";
}

input.onblur = function () {
    document.getElementById("message").style.display = "none";
}

//check requirements upon typing
input.onkeyup = function () {

    if (input.value.length > 7) {
        length.classList.remove("invalid");
        length.classList.add("valid");
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
    }

    var lowerLetters = /[a-z]/g;

    if (input.value.match(lowerLetters)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
    }

    var upperLetters = /[A-Z]/g;

    if (input.value.match(upperLetters)) {
        capital.classList.remove("invalid");
        capital.classList.add("valid");
    } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
    }

    var numbers = /[0-9]/g;

    if (input.value.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }
}

//Verify password matching in form
function checkFields() {
    let user = username.value;
    let email = email.value;
    let pwd1 = password1.value;
    let pwd2 = password2.value;

    //Check null values
    if (user.length == 0) {
        alert("Please enter a username");
        return false;
    } else if (email.length == 0) {
        alert("Please enter an email address");
        return false;
    } else if (pwd1 == '') {
        alert("Please enter a password");
        return false;
    } else if (pwd2 == '') {
        alert("Please confirm your password");
        return false;
    }
    //match passwords
    else if (pwd1 != pwd2) {
        alert("Passwords do not match");
        return false;
    } else {
    }
    return true;
}

var pwdBox = document.getElementById('checkbox');
pwdBox.addEventListener('click', showPwdReg, false);

//function to show password to user
function showPwdReg() {
    var pwd = document.getElementById("password1");
    var pwd2 = document.getElementById("password2");

    if (pwd.type === "password" && pwd2.type === "password") {
        pwd.type = "text";
        pwd2.type = "text";
    } else {
        pwd.type = "password";
        pwd2.type = "password";
    }
}

let flashElement = document.getElementById('flash-message');
let register = document.getElementById('register')
register.addEventListener('input', hideAlert, false);

function hideAlert() {
    flashElement.style.display = "none";
}