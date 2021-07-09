var tipoValidacao = { REQUIRED: 1, ONLY_NUMBERS: 2, CPF_VALID: 3, CNPJ_VALID: 4, EMAIL_VALID: 5, MIN_VALUE: 6 };
var notificationType = { POP_UP: 0, FIELD: 1 };
var applicationURL = "/";
// JQUERY STARTS
$(document).ready(function () {

    // save the username ("mail for now") into local storage
    getIsAdmin();

    $('#userNameDisplay').html(getLocalStorage("UserName"));

    // fade in when load the page
    fadeInHtmlElement("body");

    // check if there a value in localstorage
    var sideBarMenuHidden = localStorage.getItem("navbarToggle");
    if (sideBarMenuHidden === null || sideBarMenuHidden === undefined) {
        setLocalStorage("navbarToggle", false);
    }

    // sidebar toggle button handler
    $("#btnSiderBarToggle").on("click", function () {
        var isOpen = $("body").hasClass("sidebar-collapse");
        if (isOpen === true) {
            $("body").removeClass("sidebar-collapse");
            sideBarMenuHidden = true;
            setLocalStorage("navbarToggle", sideBarMenuHidden);
        } else {
            $("body").addClass("sidebar-collapse");
            sideBarMenuHidden = false;
            setLocalStorage("navbarToggle", sideBarMenuHidden);
        }
    });

    // get full year
    function getFullYear() {
        var data = new Date().getFullYear();
        return data;
    }

    // set the full year to footer date
    function setFullYearOnFooter() {
        $("#footer-current-year").text(getFullYear());
    }

    setFullYearOnFooter();
});

function downloadFile(fileInfo) {
    var base64File = byteArrayToBase64(fileInfo.Content);

    const linkSource = `data:${fileInfo.ContentType};base64,${base64File}`;
    const downloadLink = document.createElement("a");
    const fileName = fileInfo.Filename;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

function byteArrayToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

var timerModalRoutingPayments = null;

function convertCSharpDateToJsDate(date) {
    var re = /-?\d+/;
    var m = re.exec(date);
    var dateConverted = new Date(parseInt(m[0]));

    return dateConverted;
}

// GET LOCAL STORAGE DATA
function getLocalStorage(propertyName) {
    var data = localStorage.getItem(propertyName);
    return data;
}

// SET LOCAL STORAGE DATA
function setLocalStorage(propertyName, value) {
    localStorage.setItem(propertyName, value);
}

// SET LOCAL STORAGE DATA
function removeLocalStorage(propertyName) {
    localStorage.removeItem(propertyName);
}

function setInicialDateInputsFilter() {
    var inicialDate = $(".InicialDate").val();
    var finalDate = $(".FinalDate").val();
    var resInicialDate = inicialDate.substring(0, 10);
    var resFinalDate = finalDate.substring(0, 10);

    $(".InicialDate").datepicker("update", resInicialDate);
    $(".FinalDate").datepicker("update", resFinalDate);
}

// CONVERT A STRING TO BOOLEAN
function convertToBoolean(val) {
    if (val != null && val != undefined) {
        var newValue = val.toLowerCase();
        newValue = JSON.parse(newValue);
        return newValue;
    } else {
        throw new Error("Error Function convertToBoolean(): Não é possível converter um valor nulo ou indefinido.");
    }
}

// GET TOKEN
function GetHeaders() {
    var token = localStorage.getItem("Token");
    var headers =
    {
        'AccessToken': token,
        'WalletId': getCurrentWallet(),
        'PrimaryBusinessUnitId': getCurrentPrimaryBusinessUnit(),
        '__RequestVerificationToken': GetRequestVerificationToken()
    };
    return headers;
}

// GET REQUEST VERIFICATION TOKEN
function GetRequestVerificationToken() {
    return $('input[name=__RequestVerificationToken]').val();
}

// TOKEN PASSED IN BACKGROUND
$.extend(
    {
        redirectPost: function (location, args) {
            var form = '';
            $.each(args, function (key, value) {
                form += '<input type="hidden" name="' + key + '" value="' + value + '">';
            });
            $('<form action="' + location + '" method="POST">' + form + '</form>').appendTo('body').submit();
        }
    });

$.extend({
    redirectPost2: function (url, data) {
        loadingOngrid("body", true);

        $.ajax({
            type: "POST",
            url: url,
            headers: GetHeaders(),
            data: data,
            error: function (xhr, ajaxOptions, thrownError) {
                bootstrapNotify("Não foi possível carregar a lista de contas, tente novamente mais tarde", "danger", "top");
            },
            success: function (response) {
                if (response.Status == "NOK") {
                    processAjaxResponse(response);
                }
                else if (response.Status == "EXPIRED") {
                    processAjaxResponse(response);
                }
                else {
                    $.redirectPost(url, data);
                }
            }
        });
    }
});

// GET TOKEN URL
function GoToUrlWithToken(url) {
    var token = localStorage.getItem("Token");

    var data = {
        __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
        WalletId: getCurrentWallet(),
        PrimaryBusinessUnitId: getCurrentPrimaryBusinessUnit()
    };

    $.ajax({
        url,
        data,
        type: "POST",
        headers: GetHeaders(),
        complete: function () {
            loadingOngrid("body", false);
        },
        error: function (response) {
            bootstrapNotify("Não foi possível carregar a lista de contas, tente novamente mais tarde", "danger", "top");
        },
        success: function (response) {
            if (response.Status == "EXPIRED") {
                processAjaxResponse(response);
            }
            else {
                $.redirectPost(url, {
                    AccessToken: token,
                    __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
                    WalletId: getCurrentWallet(),
                    PrimaryBusinessUnitId: getCurrentPrimaryBusinessUnit()
                });
            }
        }
    });
}

// SHOW MODAL

function showModalWithUrlToken(content, modal, url, call, data) {

    var _data = {
        __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
        WalletId: getCurrentWallet(),
        PrimaryBusinessUnitId: getCurrentPrimaryBusinessUnit()
    };

    if (data)
        _data = Object.assign(data, _data);

    $.ajax({
        url,
        data: _data,
        type: "POST",
        headers: GetHeaders(),
        complete: function () {
            loadingOngrid("body", false);
        },
        error: function (response) {
            bootstrapNotify("Não foi possível carregar a lista de contas, tente novamente mais tarde", "danger", "top");
        },
        success: function (response) {
            if (response.Status == "EXPIRED") {
                processAjaxResponse(response);
            }
            else {

                $(content).html(response);
                $(modal).modal({ show: true });
                if (call && typeof call === 'function')
                    call();
            }
        }
    });
}

//function showModalWithUrlToken(content, modal, url) {
//    var token = localStorage.getItem("Token");
//
//    $.post(url, {
//        headers: GetHeaders(),
//        //AccessToken: token,
//        __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val()
//        //WalletId: getCurrentWallet(),
//        //PrimaryBusinessUnitId: getCurrentPrimaryBusinessUnit()
//    }, function (data) {
//
//            $(content).html(data);
//            $(modal).modal({ show: true });
//    });
//}

function showGridModal(modal, form, event) {

    // show modal
    $(modal).modal('show');

    $(".modal-close").one("click", function (e) {
        // hide the modal
        $(modal).modal('hide');

        if (form != null) {
            // reset the inputs after hide
            $(form).delay(350).get(0).reset();
        }
    });

}

// SHOW ERROR MESSAGE (LOGIN ONLY)
function showErrorMsg(msgTime, timeOut, response) {

    // local variables
    var internalTime;
    var internalTimeOut;

    // -- check if msgTime was passed --
    if (msgTime != undefined) {
        // argument passed and not undefined
        internalTime = msgTime;
    } else {
        // argument not passed or undefined
        internalTime = 200;
    }

    // -- check if timeOut was passed --
    if (timeOut != undefined) {
        // argument passed and not undefined
        internalTimeOut = timeOut;
    } else {
        // argument not passed or undefined
        internalTimeOut = 2500;
    }
    // remove class hidden and execute the fade in...
    $('#lblMessage').removeClass('hidden');
    $('#lblMessage').text(response.Message).fadeIn(internalTime);

    setTimeout(function () {
        $('#lblMessage').text(response.Message).fadeOut(internalTime);
    }, internalTimeOut);
}

// INPUT MASK CPF CNPJ
function cpfCnpjInputMask(o, f) {
    v_obj = o;
    v_fun = f;
    setTimeout('initCpfCnpjInputMask()', 100);
}

function initCpfCnpjInputMask() {
    v_obj.value = v_fun(v_obj.value);
}

function cpfCnpj(value) {

    //Remove tudo o que não é dígito
    value = value.replace(/\D/g, "");

    if (value.length <= 11) {
        //CPF

        //Coloca um ponto entre o terceiro e o quarto dígitos
        value = value.replace(/(\d{3})(\d)/, "$1.$2");

        //Coloca um ponto entre o terceiro e o quarto dígitos
        //de novo (para o segundo bloco de números)
        value = value.replace(/(\d{3})(\d)/, "$1.$2");

        //Coloca um hífen entre o terceiro e o quarto dígitos
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    } else {

        //CNPJ

        //Coloca ponto entre o segundo e o terceiro dígitos
        value = value.replace(/^(\d{2})(\d)/, "$1.$2");

        //Coloca ponto entre o quinto e o sexto dígitos
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");

        //Coloca uma barra entre o oitavo e o nono dígitos
        value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");

        //Coloca um hífen depois do bloco de quatro dígitos
        value = value.replace(/(\d{4})(\d)/, "$1-$2");
    }
    return value;
}

function removeAllSpecialCharacters(string) {
    return string.replace(/[^\w\s]/gi, '');
}

// VALIDATE (CPF/CNPJ)
function validateTaxNumber(taxnumber) {
    taxnumber = taxnumber.replace(/\D+/g, '');
    if (taxnumber.length <= 11) {
        var Soma;
        var Resto;
        Soma = 0;
        if (taxnumber == "00000000000") return false;

        if (taxnumber == "00000000000" ||
            taxnumber == "11111111111" ||
            taxnumber == "22222222222" ||
            taxnumber == "33333333333" ||
            taxnumber == "44444444444" ||
            taxnumber == "55555555555" ||
            taxnumber == "66666666666" ||
            taxnumber == "77777777777" ||
            taxnumber == "88888888888" ||
            taxnumber == "99999999999")
            return false;

        for (i = 1; i <= 9; i++) Soma = Soma + parseInt(taxnumber.substring(i - 1, i)) * (11 - i);
        Resto = Soma * 10 % 11;

        if (Resto == 10 || Resto == 11) Resto = 0;
        if (Resto != parseInt(taxnumber.substring(9, 10))) return false;

        Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(taxnumber.substring(i - 1, i)) * (12 - i);
        Resto = Soma * 10 % 11;

        if (Resto == 10 || Resto == 11) Resto = 0;
        if (Resto != parseInt(taxnumber.substring(10, 11))) return false;
        return true;
    } else {
        if (taxnumber == '') return false;

        if (taxnumber.length != 14)
            return false;

        // Elimina CNPJs invalidos conhecidos
        if (taxnumber == "00000000000000" ||
            taxnumber == "11111111111111" ||
            taxnumber == "22222222222222" ||
            taxnumber == "33333333333333" ||
            taxnumber == "44444444444444" ||
            taxnumber == "55555555555555" ||
            taxnumber == "66666666666666" ||
            taxnumber == "77777777777777" ||
            taxnumber == "88888888888888" ||
            taxnumber == "99999999999999")
            return false;

        // Valida DVs
        tamanho = taxnumber.length - 2;
        numeros = taxnumber.substring(0, tamanho);
        digitos = taxnumber.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;

        tamanho = tamanho + 1;
        numeros = taxnumber.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return false;

        return true;
    }
}

// EMAIL validator
function validateEmail(email) {
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}


// ADD SORT ELEMENT TO GRID HEADER
function addSortingIconOnGrid() {

    // click handler event
    $("table > thead > tr> th.has-ordering").on('click', function (e) {
        var self = this;
        $(this).find("span#gridIcon").addClass("animated bounceIn");

        // delay to remove animation class
        setTimeout(function () {
            $(self).find("span#gridIcon").removeClass("animated bounceIn");
        }, 250);
    });
}

// ADD LOADNG ON ANY ELEMENT
function loadingOngrid(element, visibility) {
    if (visibility) {
        $(element).ploading({ action: 'show' });
    } else {
        $(element).ploading({ action: 'hide' });
    }
}

// FADE IN A HTML ELEMENT
function fadeInHtmlElement(element) {
    setTimeout(function () {
        $(element).removeClass("hidden");
    }, 100);
    $(element).fadeIn(350);
}

// SHOW NOTIFY
function bootstrapNotify(msg, type, from, timer) {

    if (timer === undefined) {
        timer = 3800;
    }

    $.notify(msg, {
        type: type,
        placement: {
            from: from,
            align: "center"
        },
        z_index: 99999999,
        spacing: 10,
        delay: 2000,
        timer: timer
    });
}

// SHOW NOTIFY
function bootstrapNotifyAndChangePage(msg, type, from, timer, url) {

    if (timer === undefined) {
        timer = 3800;
    }

    $.notify(msg, {
        type: type,
        placement: {
            from: from,
            align: "center"
        },
        z_index: 99999999,
        spacing: 10,
        delay: 2000,
        timer: timer
    });

    setTimeout(function () {
        GoToUrlWithToken(url);
    }, 5000);
}

// PREVENT KEY ENTER ON SUBMIT
function preventKeyEnter() {
    $('html').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            return false;
        }
    });
}

function fieldsValidate(ModelState, form) {
    var validationMsg = [];
    $.each(ModelState, function (index, field) {
        var input = $("#" + field.Key);
        if (input.length == 0) {
            input = $('[name="' + field.Key + '"]');
        }
        $.each(field.Value, function (index, error) {
            input.addClass('has-error');
            input.parent().addClass('has-error');
            var span = input.parent().find('.help-block');
            // adapt for select2 selects
            if (input.hasClass('has-select2'))
                input.prev('.select2-container').addClass('has-error');
            span.html(error);
        });
    });
}

function fieldsValidateNotify(ModelState) {
    var errors = "";

    $.each(ModelState, function (index, field) {
        $.each(field.Value, function (index, error) {
            errors += `${error} <br/>`;
        });
    });

    bootstrapNotify(`<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ${errors}`, "danger", "top");
}

function clearErrors(formSelector) {
    var $form = formSelector instanceof jQuery ? formSelector : $(formSelector);
    // remove .has-error class
    $form.find('.has-error').removeClass('has-error');
    // hide error-msg
    $form.find('.help-block').html('');
}

function processAjaxResponse(response, form) {
    clearErrors($(form));
    if (response.Status === "EXPIRED") {
        bootstrapNotify('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>' + response.Message, "danger", "top");
        setTimeout(function () {
            window.location = '/';
        }, 3000);
    }
    else if (response.Status === "FIELDS") {
        fieldsValidate(response.FieldsDetail, $(form));
    }
    else if (response.Status === "NOK") {
        bootstrapNotify('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>' + response.Message, "danger", "top");
    }
    else if (response.Status === "POK") { //Partially Okay
        bootstrapNotify('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>' + response.Message, "warning", "top");
    }
    else if (response.Status === "OK" && response.Message !== undefined) { //Okay
        bootstrapNotify('<i class="fa fa-check-circle" aria-hidden="true"></i>' + response.Message, "success", "top");
    }
}

function addMaskMoney(input) {
    // money mask
    $(input + "Mask").maskMoney({ prefix: 'R$ ', allowNegative: false, thousands: '.', decimal: ',', affixesStay: true });
    $(input + 'Mask').on('change', function (e) {
        $(input).val($(input + 'Mask').val().replace('R$ ', ''));
    });
}

function addMoneyMask2(elem) {
    $(elem).maskMoney({ prefix: 'R$ ', allowNegative: false, thousands: '.', decimal: ',', affixesStay: true });
    $(elem).on('change', function (e) {
        if ($(elem).val() == "")
            $(elem).val("0");
        $(elem).val($(elem).val().replace('R$ ', ''));
    });
}

function addPhoneMask(elem) {
    var options = {
        onKeyPress: function (val, ev, el, op) {
            var masks = ['(00) 0000-00000', '(00) 00000-0000'],
                mask = $(elem).val().length > 14 ? masks[1] : masks[0];
            el.mask(mask, op);
        }
    };
    if ($(elem).val() != null) {
        if ($(elem).val().length > 14)
            $(elem).mask('(00) 00000-0000', options);
        else
            $(elem).mask('(00) 0000-00000', options);
    }
}

function getPaginateData(page, parent) {
    return "&CurrentPage=" + page +
        "&PageSize=" + $(parent + " #PageSize").val() +
        "&OrderColumnName=" + $("#OrderColumnName").val() +
        "&OrderType=" + $("#OrderType").val();
}

// BOOTSTRAP DATEPICKER
function addDatePicker() {
    $(".datepicker").datepicker({
        autoclose: true,
        todayBtn: "linked",
        disableTouchKeyboard: true,
        todayHighlight: true,
        language: "pt-BR"
    });
}

// FORGERY TOKEN
function addAntiForgeryToken() {
    return "&__RequestVerificationToken=" + $('input[name=__RequestVerificationToken]').val();
}

//WALLET ID
function getCurrentWallet() {
    return localStorage.getItem('CurrentWalletId');
}

// WALLET ID SERIALIZE
function currentWalletSerialize() {
    return "&WalletId=" + getCurrentWallet();
}

//PRIMARY BUSINESS UNIT ID
function getCurrentPrimaryBusinessUnit() {
    return localStorage.getItem('CurrentPrimaryBusinessUnitId');
}

//DIGITALWITHDRAWAL ID
function getDigitalWithdrawal(e) {
    return e.target.attributes.DataId.value;
}

// PRIMARY BUSINESS UNIT ID SERIALIZE
function CurrentPrimaryBusinessUnitSerialize() {
    return "&PrimaryBusinessUnitId=" + getCurrentPrimaryBusinessUnit();
}

function serializeDigitalWithdrawal(e) {
    return "&Id=" + getDigitalWithdrawal(e);
}
(function ($) {
    $.fn.getAttributes = function () {
        var attributes = {};

        if (this.length) {
            $.each(this[0].attributes, function (index, attr) {
                attributes[attr.name] = attr.value;
            });
        }

        return attributes;
    };
})(jQuery);

// TAB INDEX NAVIGATION
function isVisibleOnScreen(elem) {
    var top_of_element = $(elem).offset().top;
    var bottom_of_element = $(elem).offset().top + $(elem).outerHeight();
    var bottom_of_screen = $(window).scrollTop() + $(window).height();
    var top_of_screen = $(window).scrollTop() + $(".nav-sections").height();

    return bottom_of_screen > top_of_element && top_of_screen < bottom_of_element;
}

function navSectionEvents() {
    $(".nav-sections a").click(function (e) {
        $('html,body').animate({ scrollTop: $("#" + e.target.target + "-section").offset().top - $(".nav-sections").height() }, 'slow');
    });

    $(window).scroll(function () {
        if (!isVisibleOnScreen($("#checkNavDisplay"))) {
            $(".nav-sections").addClass("fixed");
        }
        else {
            $(".nav-sections").removeClass("fixed");
            $(".nav-sections a").removeClass("active");
        }

        $(".nav-sections a").each(function (index, elem) {
            if (isVisibleOnScreen($("#" + elem.target + "-section .section-title-container"))) {
                if (!$(elem).hasClass("active")) {
                    $(".nav-sections a").removeClass("active");
                    $(elem).addClass("active");
                }
                return false;
            }
        });
    });
}

function logout(e) {
    if (e !== undefined) {
        e.preventDefault();
    }
    localStorage.removeItem("Token");
    localStorage.removeItem("UserName");

    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    window.location = "../";
}

// ADD CPF MASK
function addCpfMask(val) {
    $(val).mask('000.000.000-00');
}

// ADD CPF AND CPNJ MASK
function addCpfCnpjMask(element) {
    var options = {
        onKeyPress: function (cpf, ev, el, op) {
            var masks = ['000.000.000-000', '00.000.000/0000-00'];
            $(element).mask((cpf.length > 14) ? masks[1] : masks[0], op);
        }
    }

    $(element).length > 11 ? $(element).mask('00.000.000/0000-00', options) : $(element).mask('000.000.000-00#', options);
}

// ADD CNPJ MASK
function addCnpjMask(val) {
    $(val).mask('00.000.000/0000-00');
}

// ADD CELLPHONE MASK
function addCellPhoneMask(val) {
    $(val).mask('(00) 00000-0000');
}

// ADD PHONE MASK
function addPhone(val) {
    $(val).mask('(00) 0000-0000');
}

// ADD KEY CODE MASK
function addKeyCodeMask(val) {
    $(val).mask('000000');
}

function monthBefore(date) {

    //EMPTY DATE RETURNS TODAY
    if (date === undefined) {
        var newDate = new Date();
    } else {
        let day = date.split("/")[0];
        let month = date.split("/")[1] - 1;
        let year = date.split("/")[2];

        var newDate = new Date(year, month, day);
    }
    let dateBr = newDate.toLocaleDateString("pt-br");
    let initialDay = dateBr.split("/")[0];
    let initialMonth = dateBr.split("/")[1] - 1;
    let initialYear = dateBr.split("/")[2];

    //IF MONTH BEFORE IS 0 IT'S DECEMBER
    if (initialMonth === 0) {
        initialMonth = 12;
    }

    //IF MONTH IS DECEMBER, TAKES YEAR BEFORE
    if (initialMonth === 12) {
        initialYear = initialYear - 1;
    }

    let initialDate = `${initialDay}/${initialMonth}/${initialYear}`;

    return initialDate;
}

//INVOKE MAIN FUNCTION
function functionToInvoke(func) {
    return func(1);
}

//MONTH BEFORE
function monthBefore(date) {

    //EMPTY DATE RETURNS TODAY
    if (date === undefined) {
        var newDate = new Date();
    } else {
        let day = date.split("/")[0];
        let month = date.split("/")[1] - 1;
        let year = date.split("/")[2];

        var newDate = new Date(year, month, day);
    }
    let dateBr = newDate.toLocaleDateString("pt-br");
    let initialDay = dateBr.split("/")[0];
    let initialMonth = dateBr.split("/")[1] - 1;
    let initialYear = dateBr.split("/")[2];

    //IF MONTH BEFORE IS 0 IT'S DECEMBER
    if (initialMonth === 0) {
        initialMonth = 12;
    }

    //IF MONTH IS DECEMBER, TAKES YEAR BEFORE
    if (initialMonth === 12) {
        initialYear = initialYear - 1;
    }

    let initialDate = `${initialDay}/${initialMonth}/${initialYear}`;

    return initialDate;
}

function getIsAdmin() {

    var url = '/User/ValidateIsAdmin';
    loadingOngrid("body", true);
    var _data = {};
    _data.UserName = localStorage.getItem("UserName");
    _data.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();

    $.ajax({
        url: url,
        type: "POST",
        data: _data,
        headers: GetHeaders(),
        complete: function () {
            loadingOngrid("body", false);
        },
        success: function (data) {

            if (data.IsAdmin) {
                $("#ManageResourcesList").removeClass("hidden");
            }
        },
        error: function (erro) {
            bootstrapNotify('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>  ' + erro.Message, "danger", "top", 1500)
        }
    })
};

// SEARCH ERROR PAYMENT
function routingSearchError() {
    loadingOngrid("body", true);

    var url = '/Payment/LoadPaymentRoutingModal';
    var initalDate = $(".initialDate").val();
    var finalDate = $(".finalDate").val();
    var routingError = $("#searchRoutingError").val();


    $.ajax({
        type: "POST",
        url: url,
        headers: GetHeaders(),
        data: {
            __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
            InitialDate: initalDate,
            FinalDate: finalDate,
            WalletId: getCurrentWallet(),
            PrimaryBusinessUnitId: getCurrentPrimaryBusinessUnit(),
            Error: routingError,
            PageSize: 10,
            CurrentPage: 1
        }
    })
        .always(function () {
            loadingOngrid("body", false);
        })
        .done(function (response) {
            processAjaxResponse(response);

            if (response != null) {
                $("#routingModal").html(response);
            }
            if ($(".routingModal-header__text").text() === "Você não possui pagamentos que podem ser roteados") {
                $("#routingModal").find("tbody").html('<tr><td colspan="6" class="text-center">Não há erros desse tipo</td></tr>');
            }

            abbreviateError();
            modalRoutingDetails();
            routingModalClipboard();

            function abbreviateError() {
                var errors = $(".errors-js");

                errors.each(function () {
                    var textError = $(this).text();
                    var concessionaire = $(".concessionaire-js").text();

                    if (textError.match(/;/g).length > 1) {
                        var arr = textError.split(";");

                        var groupedInitials = [];
                        for (var i = 0; i < arr.length; i++) {
                            groupedInitials.push(arr[i].substring(0, 5));
                        }
                        groupedInitials.pop();
                        var groupedText = groupedInitials.join(",");
                        var errorTotal = arr.join(";");

                        $(this).html(groupedText + ' <button type="button" class="btn routingModal-table__button btn-details" data-errors="' + errorTotal + '" data-title="' + concessionaire + '"><i class="fa fa-list-ul" aria-hidden="true"></i></button>');
                    }
                    else {
                        $(this).html(textError.substring(0, 4) + ' <button type="button" class="btn routingModal-table__button btn-details" data-errors="' + textError + '" data-title="' + concessionaire + '"><i class="fa fa-list-ul" aria-hidden="true"></i></button>');
                    }
                });
            }

            function clearIntervalRoutingBtn(timer) {

                var presetStateJs = '<i class="fa fa-random" aria-hidden="true"></i>';
                var btnJs = $(".js-btn-routing");

                clearInterval(timer);
                btnJs.html(presetStateJs);
                btnJs.removeClass("disabled");
            }

            function toogleRoutingBtn() {

                var counter = 61;
                var btn = $(".js-btn-routing");
                var newState = '<i class="fa fa-refresh fa-spin disabled" aria-hidden="true"></i> Roteando, aguarde... ';

                btn.addClass("disabled");

                var timer = setInterval(function () {

                    if (counter <= 0) {
                        clearIntervalRoutingBtn(timer);
                    } else {
                        counter--;
                        btn.html(newState + "(" + counter + ")");
                        btn.addClass("disabled");
                    }

                }, 1000);

                return timer;
            }

            $("#searchRoutingBtn").on("click", function () {
                routingSearchError();
            });

            $(".js-btn-routing").click(function (e) {
                e.preventDefault();
                if ($.trim($(this).eq(0).parents().eq(0).siblings().eq(6).find(".js-input").val()) !== '') {
                    timerModalRoutingPayments = toogleRoutingBtn();
                    var concessionaireCode = $.trim($(this).eq(0).parents().eq(1).attr("concessionaire-code"));
                    var segmentCode = $.trim($(this).eq(0).parents().eq(1).attr("segment-code"));
                    var cnabConfigId = $(this).eq(0).parents().eq(0).siblings().eq(5).children().find(".js-select").val();
                    var initialDate = $.trim($(this).eq(0).parents().eq(1).attr("initial-date"));
                    var finaDate = $.trim($(this).eq(0).parents().eq(1).attr("final-date"));
                    var keyCode = $.trim($(this).eq(0).parents().eq(0).siblings().eq(6).find(".js-input").val());
                    var walletId = $.trim($(this).eq(0).parents().eq(1).attr("wallet-id"));
                    var primaryBusinessunitId = $.trim($(this).eq(0).parents().eq(1).attr("primary-businessunit-id"));


                    var concessionaireData = {
                        __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
                        ConcessionaireCode: concessionaireCode,
                        SegmentCode: segmentCode,
                        CnabConfigId: cnabConfigId,
                        InitialDate: initialDate,
                        FinalDate: finaDate,
                        KeyCode: keyCode,
                        WalletId: walletId,
                        PrimaryBusinessUnitId: primaryBusinessunitId
                    };

                    routingPayment(concessionaireData);

                } else {
                    bootstrapNotify('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>Por favor, Insira um Token!', "danger", "top");
                }
            });


        })
        .catch(function (response) {
            bootstrapNotify('<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Não foi possível fazer sua pesquisa!', "danger", "top");
        });
}

// ROUTING MODAL
function routingModal(page) {
    loadingOngrid("body", true);

    var url = '/Payment/LoadPaymentRoutingModal';
    var initalDate = $(".initialDate").val();
    var finalDate = $(".finalDate").val();
    var pageSize = 10;

    if ($('#routingModal #PageSize').val() != undefined)
        pageSize = $('#routingModal #PageSize').val();

    $.ajax({
        type: "POST",
        url: url,
        headers: GetHeaders(),
        data: {
            __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
            InitialDate: initalDate,
            FinalDate: finalDate,
            WalletId: getCurrentWallet(),
            PrimaryBusinessUnitId: getCurrentPrimaryBusinessUnit(),
            PageSize: pageSize,
            CurrentPage: page,
        }
    })
        .always(function () {
            loadingOngrid("body", false);
        })
        .done(function (response) {
            processAjaxResponse(response);
            if ($("span.table-pagesizeModal-results").text().length == 1)
                $("span.table-pagesizeModal-results").css("display", "none");
            else
                $("span.table-pagesizeModal-results").css("display", "");

            if (response != null) {
                $("#routingModal").html(response);
            }
            $("#routingModal").modal("show");

            function abbreviateError() {
                var errors = $(".errors-js");

                errors.each(function () {
                    var textError = $(this).text();
                    var concessionaire = $(".concessionaire-js").text();

                    if (textError.match(/;/g).length > 1) {
                        var arr = textError.split(";");

                        var groupedInitials = [];
                        for (var i = 0; i < arr.length; i++) {
                            groupedInitials.push(arr[i].substring(0, 5));
                        }
                        groupedInitials.pop();
                        var groupedText = groupedInitials.join(",");
                        var errorTotal = arr.join(";");

                        $(this).html(groupedText + ' <button type="button" class="btn routingModal-table__button btn-details" data-errors="' + errorTotal + '" data-title="' + concessionaire + '"><i class="fa fa-list-ul" aria-hidden="true"></i></button>');
                    }
                    else {
                        $(this).html(textError.substring(0, 4) + ' <button type="button" class="btn routingModal-table__button btn-details" data-errors="' + textError + '" data-title="' + concessionaire + '"><i class="fa fa-list-ul" aria-hidden="true"></i></button>');
                    }
                });
            }

            function clearIntervalRoutingBtn(timer) {

                var presetStateJs = '<i class="fa fa-random" aria-hidden="true"></i>';
                var btnJs = $(".js-btn-routing");

                clearInterval(timer);
                btnJs.html(presetStateJs);
                btnJs.removeClass("disabled");
            }

            function toogleRoutingBtn() {

                var counter = 61;
                var btn = $(".js-btn-routing");
                var newState = '<i class="fa fa-refresh fa-spin disabled" aria-hidden="true"></i> Roteando, aguarde... ';

                btn.addClass("disabled");

                var timer = setInterval(function () {

                    if (counter <= 0) {
                        clearIntervalRoutingBtn(timer);
                    } else {
                        counter--;
                        btn.html(newState + "(" + counter + ")");
                        btn.addClass("disabled");
                    }

                }, 1000);

                return timer;
            }

            abbreviateError();
            modalRoutingDetails();
            routingModalClipboard();



            $("#searchRoutingBtn").on("click", function () {
                routingSearchError();
            });

            $('#routingModal #PageSize').on('change', function (e) {
                routingModal(1);
            });

            $(".js-btn-routing").click(function (e) {
                e.preventDefault();
                if ($.trim($(this).eq(0).parents().eq(0).siblings().eq(6).find(".js-input").val()) !== '') {
                    timerModalRoutingPayments = toogleRoutingBtn();
                    var concessionaireCode = $.trim($(this).eq(0).parents().eq(1).attr("concessionaire-code"));
                    var segmentCode = $.trim($(this).eq(0).parents().eq(1).attr("segment-code"));
                    var cnabConfigId = $(this).eq(0).parents().eq(0).siblings().eq(5).children().find(".js-select").val();
                    var initialDate = $.trim($(this).eq(0).parents().eq(1).attr("initial-date"));
                    var finaDate = $.trim($(this).eq(0).parents().eq(1).attr("final-date"));
                    var keyCode = $.trim($(this).eq(0).parents().eq(0).siblings().eq(6).find(".js-input").val());
                    var walletId = $.trim($(this).eq(0).parents().eq(1).attr("wallet-id"));
                    var primaryBusinessunitId = $.trim($(this).eq(0).parents().eq(1).attr("primary-businessunit-id"));


                    var concessionaireData = {
                        __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
                        ConcessionaireCode: concessionaireCode,
                        SegmentCode: segmentCode,
                        CnabConfigId: cnabConfigId,
                        InitialDate: initialDate,
                        FinalDate: finaDate,
                        KeyCode: keyCode,
                        WalletId: walletId,
                        PrimaryBusinessUnitId: primaryBusinessunitId
                    }

                    routingPayment(concessionaireData);
                } else {
                    bootstrapNotify('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>Por favor, Insira um Token!', "danger", "top");
                }
            });

            $(".js-btn-token").click(function () {
                GenerateToken($(this), true);
            });

        })
        .catch(function (response) {
            bootstrapNotify('<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Não foi possível carregar o modal de roteamento!', "danger", "top");
        });
}

//ROUTING CLIPBOARD FUNCTION
function routingModalClipboard() {
    //WITHOUT THIS CONTAINER OBJECT, THE TOOL DOESN'T WORK WITH MODALS
    new ClipboardJS('.js-clipboard', {
        container: document.getElementById('routingModal')
    });
}

//ROUTING DETAILS MODAL
function modalRoutingDetails() {
    $(".btn-details").click(function () {
        $("#modalDetails .modal-list").html("");
        var dataTitle = $(this).attr("data-title");
        var dataErrors = $(this).attr("data-errors");
        var errors = dataErrors.split(";");
        errors.pop();
        $("#modalDetails .modal-text").text(dataTitle);

        for (var error = 0; error < errors.length; error++) {
            $("#modalDetails .modal-list").append("<li class='modal-item'>" + errors[error] + "</li>");
        }

        $("#modalDetails").modal("show");
    });



    $("#modalDetails .close").click(function () {
        $("#modalDetails").modal("hide");
    });

    $("#modalDetails .btn-close").click(function () {
        $("#modalDetails").modal("hide");
    });

}


// ROUTING PAYMENT
function routingPayment(concessionaireData) {
    loadingOngrid("body", true);

    var url = '/Payment/RouteConcessionairePayment';


    var ConcessionaireData = concessionaireData;

    $.ajax({
        type: "POST",
        url: url,
        headers: GetHeaders(),
        data: ConcessionaireData
    })
        .always(function () {
            loadingOngrid("body", false);
        })
        .done(function (response) {
            processAjaxResponse(response);


            if (response.Status != "NOK") {
                bootstrapNotify('<i class="fa fa-check-circle" aria-hidden="true"></i> O roteamento foi efetuado com sucesso!', 'success', 'top', 1000);
                routingModal(1);
            }
            else {
                clearInterval(timerModalRoutingPayments);
                var btnJs = $(".js-btn-routing");
                var presetStateJs = '<i class="fa fa-random" aria-hidden="true"></i>';
                btnJs.html(presetStateJs);
                btnJs.removeClass("disabled");
            }

        })
        .catch(function (response) {
            bootstrapNotify('<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Não foi possível realizar o roteamento!', "danger", "top");
        });
}


// TIMER FOR THE BUTTONS
var timer = "";

function clearIntervalBtn(timer, btn, presetState) {
    var btn = btn;
    var presetState = presetState;
    clearInterval(timer);

    btn.html(presetState);
    btn.removeClass("disabled");
}

function timerBtn(counter, btn, newState) {
    var btn = btn;
    var newState = newState;
    btn.addClass("disabled");

    timer = setInterval(function () {
        if (counter <= 0) {
            clearIntervalBtn(timerBtn, btn, newState);
        } else {
            counter--;
            btn.html(newState + "(" + counter + ")");
            btn.addClass("disabled");
        }
    }, 1000);

    return timer;
}

function checkRateValue(element) {
    if (Number(element.value.replace(/\,|\./g, '').replace('R$', '')) > 0) {
        document.querySelector(`#${element.dataset.rateTargetName}`).setAttribute('disabled', true);
    } else {
        document.querySelector(`#${element.dataset.rateTargetName}`).removeAttribute('disabled');
    }
}

function checkPercentValue(element) {
    if (Number(element.value.replace(/\,|\./g, '').replace('R$', '')) > 0) {
        document.querySelector(`#${element.dataset.rateTargetName}`).setAttribute('disabled', true);
    } else {
        document.querySelector(`#${element.dataset.rateTargetName}`).removeAttribute('disabled');
    }
}

function disableElementsWithoutRateValues() {
    $.each($(".ratesValue"), function (key, value) {
        var forName = value.id;
        if (forName.includes(".RateValueCustomer")) {
            checkRateValue(document.querySelector("#" + forName));
        }
        else {
            checkRateValue(document.querySelector("#" + forName));
        }
    });

    $.each($(".ratesPercent"), function (key, value) {
        var forName = value.id;
        if (forName.includes(".RatePercentageCustomer")) {
            checkPercentValue(document.querySelector("#" + forName));
        }
        else {
            checkPercentValue(document.querySelector("#" + forName));
        }
    });

    $(document.querySelectorAll('.ratesValue')).change(function (event) {
        event.preventDefault();
        checkRateValue(event.target);
    });
    $(document.querySelectorAll('.ratesPercent')).change(function (event) {
        event.preventDefault();
        checkPercentValue(event.target);
    });
}

var utility = {
    gerenateOptionTagsOptional: (list, value = 'Id', listNames = ['Name'], separator = '-') => {
        let _result = "<option selected>Selecione</option>";
        let name = '';
        for (let i = 0; i < list.length; i++) {
            name = list[i][listNames[0]];
            if (listNames.length > 1) {
                for (let j = 1; j < listNames.length; j++) {
                    name += ` ${separator} ${list[i][listNames[j]]}`;
                }
            }
            _result += "<option value='" + list[i][value] + "'>" + name + "</option>";
        }
        return _result;
    },
    gerenateOptionTags: (list, value = 'Id', listNames = ['Name'], separator = '-') => {
        let _result = "<option disabled selected>Selecione</option>";
        let name = '';
        for (let i = 0; i < list.length; i++) {
            name = list[i][listNames[0]];
            if (listNames.length > 1) {
                for (let j = 1; j < listNames.length; j++) {
                    name += ` ${separator} ${list[i][listNames[j]]}`;
                }
            }
            _result += "<option value='" + list[i][value] + "'>" + name + "</option>";
        }
        return _result;
    },
    gerenateOptionTagsWithoutId: (list, value = 'Id', listNames = ['Name'], separator = '-') => {
        let _result = "<option disabled selected>Selecione</option>";
        let name = '';
        for (let i = 0; i < list.length; i++) {
            if (listNames.length > 1) {
                for (let j = 1; j < listNames.length; j++) {
                    name += `${list[i][listNames[j]]}`;
                }
            }
            _result += "<option value='" + list[i][value] + "'>" + name + "</option>";
            name = '';
        }
        return _result;
    },
    validate: (tpValidation, value, compareTo = 0) => {
        let isValid = true;
        switch (tpValidation) {
            case tipoValidacao.REQUIRED: {
                if (value === undefined || value == null || value.trim() == '') {
                    isValid = false;
                }
                break;
            }
            case tipoValidacao.ONLY_NUMBERS: {
                const regExNumber = /^[0-9]|\.\,+$/
                isValid = regExNumber.test(value);
                break;
            }
            case tipoValidacao.CPF_VALID: {
                isValid = validateTaxNumber(value);
                break;
            }
            case tipoValidacao.EMAIL_VALID: {
                if (value !== undefined && value != null && value.trim() != '') {
                    isValid = validateEmail(value);
                }
                break;
            }
            case tipoValidacao.MIN_VALUE: {
                if (value < compareTo) {
                    isValid = false;
                }
            }
        }
        return isValid;
    },
    showPopUp: (fields = [], className = 'danger') => {
        let textError = "";
        fields.forEach(function (field) {
            textError += `<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ${field.message} <br/>`;
        });

        $('.collapse').collapse('show');
        bootstrapNotify(textError, className, 'top');
    },
    hideInputErros: () => {
        allInputs = document.querySelectorAll('.form-control');

        allInputs.forEach(function (input) {
            input.parentElement.classList.remove("has-error");

            var msgError = input.parentElement.querySelector('.invalid-feedback');
            if (msgError)
                input.parentElement.removeChild(msgError);
        });
    },
    showInputError: (fields) => {

        utility.hideInputErros();

        fields.forEach(function (field) {
            field.input.parentElement.classList.add("has-error");

            var msgError = document.createElement("label");
            msgError.classList.add("invalid-feedback", "has-error");
            msgError.textContent = field.message;

            field.input.parentElement.appendChild(msgError);

        });
    },
    showErrorMessage: (fields = [], type = notificationType.POP_UP) => {
        if (type === notificationType.POP_UP)
            utility.showPopUp(fields);
        if (type === notificationType.FIELD)
            utility.showInputError(fields);
    },
    debounce: (func, wait, immediate) => {
        var timeout;

		return function executedFunction() {
			var context = this;
			var args = arguments;

			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};

			var callNow = immediate && !timeout;

			clearTimeout(timeout);

			timeout = setTimeout(later, wait);

			if (callNow) func.apply(context, args);
		}
    },
    setSwitch: (target = 'hasAcessTo') => {

        var input = document.querySelector(`[name=${target}][type=checkbox]`);
        var inputHidden = document.querySelector(`[name=${target}][type=hidden]`);
        if (inputHidden != null && inputHidden != undefined) {
            inputHidden.setAttribute('type', 'checkbox');
            inputHidden.id = target;

            (input.getAttribute('disabled') === 'True') ? inputHidden.setAttribute('disabled', '') : ''

            document.querySelector(`[name=${target}]`).id = '';

            inputHidden.checked = document.querySelector(`[name=${target}]`).checked;

            $(inputHidden).on("change", function (event) {
                var value = event.target.checked;
                document.querySelector(`#${target}`).value = value;
            });
        }
    },
    inputFormat: {
        date: (inputDate = "") => {
            inputDate.value = inputDate.value.replace(/[^0-9]/g, '');

            if (inputDate.value.length > 2)
                inputDate.value = inputDate.value.substring(0, 2) + '/' + inputDate.value.substring(2);
            if (inputDate.value.length > 4)
                inputDate.value = inputDate.value.substring(0, 5) + '/' + inputDate.value.substring(5);
        }
    }
}

function getMIMETypeFromFilename(filename) {
    let fileExtension = filename.split('.').pop();

    switch (fileExtension) {
        case "pdf":
            return "application/pdf";
        case "jpg":
            return "image/jpg";
        case "jpeg":
            return "image/jpeg";
        case "txt":
            return "text/plain";
        case "png":
            return "image/png";
        default:
            throw new Error("File extension not implemented!")
    }
}

function base64toBlob(base64, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}