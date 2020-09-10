//different elements and name did not allow for forms.js usage properly
window.onload = function () {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("photo").value = null;
    document.getElementById("checkbox").checked = false;
}

let submit = document.getElementById('submit');
submit.addEventListener('click', checkForm, false);

function checkForm(event) {
    var title = document.getElementById('title').value;
    var description = document.getElementById('description').value;
    let photo = document.getElementById('photo').value;
    var terms = document.getElementById('checkbox').checked;
    if (title.length == 0) {
        alert("Title cannot be blank")
        event.preventDefault();
    } else if (description.length == 0) {
        alert("Description cannot be blank");
        event.preventDefault();
    } else if (photo == "") {
        alert("Please chose an image to upload")
        event.preventDefault();
    } else if (!terms) {
        alert("You must accept the terms to post");
        event.preventDefault();
    }

    return true;
}

let flashElement = document.getElementById('flash-message');
let form = document.getElementById('post-image')
form.addEventListener('input', hideAlert, false);

function hideAlert() {
    flashElement.style.display = "none";
}