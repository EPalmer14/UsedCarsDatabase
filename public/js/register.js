const urlParams = new URLSearchParams(window.location.search);
const user = JSON.parse(urlParams.get('input'));
const errorMessage = urlParams.get("error");

if (errorMessage) {
    //console.log(car);
    fillUser(user);
    $('#error_msg').text(errorMessage);
}

$('form').on('submit', function () {

});

function fillUser(user) {
    $('#email').val(user.username);
    $('#password').val(user.password);
    $('#confirm').val(user.confirm);
    $('#fullname').val(user.fullname);
    $('#profile').val(user.profile);
    $('#brand').val(user.brand);
}