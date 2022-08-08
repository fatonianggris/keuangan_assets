/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    var __webpack_exports__ = {};

// Class Definition
    var KTLogin = function () {
        var _login;

        var _handleSignInForm = function () {
            var validation;
            var form = KTUtil.getById('kt_add_mailer_form');
            // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
            validation = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            nama_pengirim: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nama Pengirim diperlukan'
                                    },
                                    regexp: {
                                        regexp: /^[a-zs\s.()-]+$/i,
                                        message: 'Inputan harus berupa huruf'
                                    }
                                }
                            },
                            host: {
                                validators: {
                                    notEmpty: {
                                        message: 'Host diperlukan'
                                    }
                                }
                            },
                            email_induk: {
                                validators: {
                                    notEmpty: {
                                        message: 'Email diperlukan'
                                    },
                                    emailAddress: {
                                        message: 'Inputan harus berformat email'
                                    }
                                }
                            },
                            password: {
                                validators: {
                                    notEmpty: {
                                        message: 'Password diperlukan'
                                    }
                                }
                            },
                            port: {
                                validators: {
                                    notEmpty: {
                                        message: 'Port diperlukan'
                                    },
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: '',
                                        decimalSeparator: '.'
                                    },
                                }
                            },
                            smtp_auth: {
                                validators: {
                                    notEmpty: {
                                        message: 'SMTP Auth diperlukan'
                                    }
                                }
                            },
                            smtp_secure: {
                                validators: {
                                    notEmpty: {
                                        message: 'SMTP Secure diperlukan'
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