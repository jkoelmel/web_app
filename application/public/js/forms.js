//reset form fields on load
window.onload = function () {
    var checkboxes = document.querySelectorAll(".check");
    for(var i = 0; i < checkboxes.length; i++) {
       checkboxes[i].checked = false;
    }
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
}

var pwdCheckBox = document.getElementById('checkbox');
pwdCheckBox.addEventListener('click', showPwd, false);
//function to show password to user
function showPwd() {
    var pwd = document.getElementById("password");


    if(pwd.type === "password"){
        pwd.type = "text";
    }
    else {
        pwd.type = "password";
    }
}

var formCheck = document.getElementById('password');
formCheck.addEventListener('blur', checkLogin, false);

//basic front end check, server-side in users.js
function checkLogin() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if(username == '') {
        alert("Please enter a username");
        return false;
    }
    else if (password.length < 8) {
        alert("Please enter a valid password");
        return false;
    }
}

let flashElement = document.getElementById('flash-message');
let form = document.getElementById('login');
form.addEventListener('input', hideAlert, false);

function hideAlert() {
    flashElement.style.display = "none";
}