$(document).ready(function () {

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

    var changePasswordModule = (function () {

        var DOMString = {
            links: ".custom-link",
            btnCancel: "#btnCancelModalchangeUserPassword",
            btnCloseModal: "#btnCloseModalchangeUserPassword",
            btnConfirm: "#btnConfirmModalchangeUserPassword",
            model: "#ChangePasswordModel",
            inputCurrentPwd: "#CurrentPwd",
            inputNewPwd: "#NewPwd",
            inputPwdConfirm: "#NewPwdConfirm",
            modal: "#modalchangeUserPassword"
        };

        var _customNotify = function (response) {
            var msg = '<i class="fa fa-check-circle" aria-hidden="true"></i>  ' + response.Message + '.';

            $.notify(msg, {
                type: "success",
                placement: {
                    from: "top",
                    align: "center"
                },
                z_index: 99999999,
                spacing: 10,
                delay: 2500,
                timer: 1000,
                onClose: function () {
                    loadingOngrid('body', false);
                    logout();
                }
            });
        };

        function saveChangedPassword() {
            var _url = '/User/ChangePassword';
            var _data = {
                CurrentPwd: $(DOMString.inputCurrentPwd).val(),
                NewPwd: $(DOMString.inputNewPwd).val(),
                NewPwdConfirm: $(DOMString.inputPwdConfirm).val(),
                __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
                WalletId: getCurrentWallet(),
                PrimaryBusinessUnitId: getCurrentPrimaryBusinessUnit()
            };

            return $.ajax({
                type: "POST",
                url: _url,
                data: _data,
                headers: GetHeaders()
            });
        }

        function saveChangedPasswordPromise() {

            loadingOngrid(DOMString.modal, true);

            var promise = saveChangedPassword();

            promise.done(function (response) {

                if (response.Status === "OK") {
                    loadingOngrid('body', true);
                    _customNotify(response);

                } else {
                    processAjaxResponse(response, DOMString.model);
                }
            });

            promise.fail(function (response) {
                bootstrapNotify('<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + response.Message, "danger", "top");
            });

            promise.always(function () {
                loadingOngrid(DOMString.modal, false);
            });
        }

        $(DOMString.links).click(function () {
            $(DOMString.modal).modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
        });
        $(DOMString.btnCancel).click(resetUserChangePassword);
        $(DOMString.btnCloseModal).click(resetUserChangePassword);
        $(DOMString.btnConfirm).click(saveChangedPasswordPromise);

        function resetUserChangePassword() {
            $(DOMString.model).find("input[type=password]").each(function (index, el) {
                $(el).val("");
            });
        }

    })();

    //Function to hide wallets and primary businessunits
    function toggleWallets() {
        var toggle = localStorage.getItem("navbarToggle");
        if (toggle === "true") {
            $("#WalletContainer").show();
            $("#walletToggleTitle").text(" Carteira");
            //console.log($("#SelectedWalletNumber").text() + "\n" + _.truncate($("#SelectedWalletName").text(), { "length": 7, "separator": "..." }));
        } else {
            $("#WalletContainer").hide();
            $("#walletToggleTitle").text(_.truncate($("#SelectedWalletName").text(), { "length": 24, "separator": "..." }));
            if ($("#WalletMenu").find(".walletLink").length > 1) {
                $("#Wallet .pull-right-container").show();
                $("#Wallet .pull-right").show();
                $("Wallet #WalletMenu").show();
            } else {
                $("#Wallet .pull-right-container").hide();
                $("#Wallet .pull-right").hide();
                $("#Wallet #WalletMenu").hide();
            }
            //console.log($("#SelectedWalletNumber").text() + "\n" + _.truncate($("#SelectedWalletName").text(), { "length": 7, "separator": "..." }));
        }
    }

    function togglePrimaryBusinessUnits() {
        var togglePbu = localStorage.getItem("navbarToggle");
        if (togglePbu === "true") {
            $("#PrimaryBusinessUnitContainer").show();
            $("#walletToggleTitle").text(" Titularidades");
            //console.log($("#SelectedPrimaryBusinessUnitNumber").text() + "\n" + _.truncate($("#SelectedPrimaryBusinessUnitName").text(), { "length": 7, "separator": "..." }));
        } else {
            $("#PrimaryBusinessUnitContainer").hide();
            $("#primaryBusinessUnitToggleTitle").text(_.truncate($("#SelectedPrimaryBusinessUnitName").text(), { "length": 24, "separator": "..." }));
            if ($("#PrimaryBusinessUnitMenu").find(".primaryBusinessUnitLink").length > 1) {
                $("#PrimaryBusinessUnit .pull-right-container").show();
                $("#PrimaryBusinessUnit .pull-right").show();
                $("#PrimaryBusinessUnit #PrimaryBusinessUnitMenu").show();
            } else {
                $("#PrimaryBusinessUnit .pull-right-container").hide();
                $("#PrimaryBusinessUnit .pull-right").hide();
                $("#PrimaryBusinessUnit #PrimaryBusinessUnitMenu").hide();
            }
            //console.log($("#SelectedPrimaryBusinessUnitNumber").text() + "\n" + _.truncate($("#SelectedPrimaryBusinessUnitName").text(), { "length": 7, "separator": "..." }));
        }
    }

    // hides cards menu option if current wallet is different from FITBANK
    if (localStorage.getItem("CurrentWalletId") != 1)
        $("#Cards").hide();


    $("#btnSiderBarToggle").on("click", function () {
        toggleWallets();
        togglePrimaryBusinessUnits();
    });
    // navbar navigation to Whitelabel
    $("#Whitelabel").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/Whitelabel/Index');
    });

    // navbar navigation to Home page
    $("#HomePage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/Home');
    });

    // navbar navigation to SettlementReport page
    $("#SettlementReportPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/SettlementReport/Index');
    });

    // navbar navigation to ManualEntry page
    $("#ManualEntryPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/ManualEntry/Index');
    });

    // navbar navigation to MultiBankPage page
    $("#MultiBankPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/MultiBank/Index');
    });

    // navbar navigation to MultiBankPage page
    $("#MultiBankTranferPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/MultiBankTransfer/Index');
    });

    // navbar navigation to MoneyTransferIn page
    $("#MoneyTransferInPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/MoneyTransferIn/Index');
    });

    // navbar navigation to Boleto page
    $("#BoletoPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/Boleto/Index');
    });

    // navbar navigation to FileTransfer Consignment
    $("#Remittance").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/Remittance/Index');
    });

    // navbar navigation to FileTransfer Return
    $("#BankReturn").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/BankReturn/Index');
    });

    // navbar navigation to FileTransfer Return
    $("#BankReturnSendFiles").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/BankReturn/SendFiles');
    });

    // navbar navigation to BusinessUnit page
    $("#BusinessUnitPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/BusinessUnit/Index');
    });

    // **TEMP** Navbar navigation to BusinessUnitList
    $("#TempBusinessUnitPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/BusinessUnit/List');
    });

    // navbar navigation to PersonGroup
    $("#PersonGroupPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/PersonGroup/Index');
    });

    // navbar navigation to PersonCondition
    $("#PersonConditionPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/PersonCondition/Index');
    });

    // navbar navigation to PersonGroup
    $("#ApprovePersonGroupPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/PersonGroup/ApproveList');
    });

    // navbar navigation to User
    $("#UserPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/User/List');
    });

    // navbar navigation to access profile page
    $("#AccessProfilePage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/AccessProfile/Index');
    });

    // navbar navigation to External Wallet page
    $("#wallet").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/Wallet/Index');
    });

    // navbar navigation to External PrimaryBusinessUnit page
    $("#primaryBusinessUnit").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/PrimaryBusinessUnit/Index');
    });

    // navbar navigation to Payment
    $("#Payment").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/Payment/Index');
    });

    // navbar navigation to ManagerTopUp
    $("#ManagerTopUp").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/TopUpManager/Index');
    });

    // navbar navigation to Boleto windows
    $("#Boleto").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/Boleto/Index');
    });

    // navbar navigation to Card
    $("#Card").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/Card/Index');
    });

    // navbar navigation to CardLink
    $("#CardLink").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/CardLink/Index');
    });

    // navbar navigation to CardTransaction
    $("#CardTransaction").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/CardTransaction/Index');
    });

    // navbar navigation to CardProduct
    $("#CardProduct").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/CardProduct/Index');
    });

    // navbar navigation to CardProduct
    $("#CardBatchPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/CardBatch/Index');
    });

    // navbar navigation to RequestCardManagement
    $("#RequestCardManagement").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/RequestCardManagement/Index');
    });

    // navbar navigation to Send Rules
    $("#SendRules").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/MessageRuleConfigPerson/Index');
    });

    // navbar navigation to Send Rules
    $("#ResendMessages").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/ResendMessages/Index');
    });

    // navbar navigation to CNAB Queue
    $("#CnabQueue").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/CnabQueue/Index');
    });

    // navbar navigation to CNAB Cutoff Time
    $("#CnabSchedule").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/CnabSchedule/Index');
    });


    // logout
    $("#MenuItemLogOut").click(logout);

    // navbar navigation to CNAB Queue
    $("#DownloadPDF").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/DownloadPDF/Index');
    });

    // navbar navigation to CNAB Queue
    $("#BankStatement").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/BankStatement/Index');
    });

    // navbar navigation to Agreement page
    $("#AgreementPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/Agreement/Index');
    });

    // navbar navigation to External Authentication page
    $("#ExternalAuthenticationPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/ExternalAuthentication/Index');
    });

    // navbar navigation to Continuous Execution  page
    $("#ContinuousExecutionPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/ContinuousExecution/Index');
    });

    // navbar navigation to Webhook page
    $("#WebhookPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/Webhook/Index');
    });

    //navbar navigation to Webhook page //não comitar
    $("#DigitalWithdrawalPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/DigitalWithdrawal/Index');
    });

	// navbar navigation to Cutting Schedule Payment page
	$("#CuttingSchedulePaymentPage").click(function (e) {
		e.preventDefault();
		GoToUrlWithToken('/CuttingSchedule/Payment');
    });

    // navbar navigation to Cutting Schedule Transfer page
    $("#TransferCuttingSchedulePage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/TransferCuttingSchedule/Index');
    });

    // navbar navigation to access admin profile page
    $("#AdminAccessProfilePage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/AdminAccessProfile/Index');
    });

    // navbar navigation to Concessionarie Routing page
    $("#ConcessionaireRouting").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/ConcessionaireRouting/Index');
    });

    //navbar navigation to Webhook page
    $("#AdminUserPage").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/AdminUser/Index');
    });

    // navbar navigation to Api Credentials page
    $("#ApiCredential").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/ApiCredential/Index');
    });

    // navbar navigation to Concessionaire page
    $("#Concessionaire").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/Concessionaire/Index');
    });

    // navbar navigation to Concessionaire Block page
    $('#ConcessionaireBlock').click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/ConcessionaireBlock/Index');
    });

    // navbar navigation to FuturePosting
    $("#FuturePosting").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/FuturePosting/Index');
    });

    // navbar navigation to PixKey
    $("#PixKey").click(function (e) {
        e.preventDefault();
        GoToUrlWithToken('/PixKey/Index');
    });
});