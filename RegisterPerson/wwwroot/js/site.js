$(document).ready(function () {
    addMask();
})

function addMask () {
    addCpfMask($('#socialSecurity'));
    addPhoneMask($("#phoneNumber"));
}
