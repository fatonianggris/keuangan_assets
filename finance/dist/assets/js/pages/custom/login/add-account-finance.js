/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    var __webpack_exports__ = {};

// Class Definition
    var KTLogin = function () {
        var _login;

        var _handleSignInForm = function () {
            var validation;
            var form = KTUtil.getById('kt_add_account_form')
            // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
            validation = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            nama_akun: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nama Akun diperlukan'
                                    },
                                    regexp: {
                                        regexp: /^[a-zs\s.()-]+$/i,
                                        message: 'Inputan harus berupa huruf'
                                    }
                                }
                            },
                            role_akun: {
                                validators: {
                                    notEmpty: {
                                        message: 'Jabatan Akun diperlukan'
                                    }
                                }
                            },
                            email_akun: {
                                validators: {
                                    notEmpty: {
                                        message: 'Email Akun diperlukan'
                                    },
                                    emailAddress: {
                                        message: 'Inputan harus berformat email'
                                    },
                                    remote: {
                                        message: 'Email telah digunakan, Gunakan Email lain',
                                        method: 'POST',
                                        url: HOST_URL + 'finance/settings/account/check_email_akun',
                                    },
                                }
                            },
                            nomor_handphone_akun: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nomor Handphone diperlukan'
                                    },
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: '',
                                        decimalSeparator: '.'
                                    },
                                }
                            },
                            password: {
                                validators: {
                                    notEmpty: {
                                        message: 'Password diperlukan'
                                    },
                                    identical: {
                                        compare: function () {
                                            return form.querySelector('[name="cf_password"]').value;
                                        },
                                        message: 'Inputan Password tidak sama dengan inputan Konfirmasi Password'
                                    }
                                }
                            },
                            cf_password: {
                                validators: {
                                    notEmpty: {
                                        message: 'Konfirmasi Password diperlukan'
                                    },
                                    identical: {
                                        compare: function () {
                                            return form.querySelector('[name="password"]').value;
                                        },
                                        message: 'Inputan Konfirmasi Password tidak sama dengan inputan Password'
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            submitButton: new FormValidation.plugins.SubmitButton(),
                            defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
                            bootstrap: new FormValidation.plugins.Bootstrap()
                        }
                    }
            );

            _login.on('submit', function (wizard) {
                if (validation) {
                    validation.validate().then(function (status) {
                        if (status == 'Valid') {
                            KTApp.blockPage({
                                overlayColor: '#FFA800',
                                state: 'warning',
                                size: 'lg',
                                opacity: 0.1,
                                message: 'Silahkan Tunggu...'
                            });
                            form.submit(); // Submit form
                        } else {
                            Swal.fire({
                                text: "Mohon Maaf, kemungkinan terjadi kesalahan pada pengisian Anda, Mohon menginputkan dengan benar.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Oke!",
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-primary"
                                }
                            }).then(function () {
                                KTUtil.scrollTop();
                            });
                        }
                    });
                }
            });
        };

        // Public Functions
        return {
            // public functions
            init: function () {
                _login = $('#kt_form');

                _handleSignInForm();
            }
        };
    }();

// Class Initialization
    jQuery(document).ready(function () {
        KTLogin.init();
    });

    /******/ })()
        ;
//# sourceMappingURL=login-general.js.map