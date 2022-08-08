/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    var __webpack_exports__ = {};

// Class Definition
    var KTLogin = function () {
        var _login;

        var _handleSignInForm = function () {
            var validation;
            var form = KTUtil.getById('kt_add_cost_form');
            // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
            validation = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            jenis_biaya: {
                                validators: {
                                    notEmpty: {
                                        message: 'Jenis Biaya diperlukan'
                                    }
                                }
                            },
                            id_tingkat: {
                                validators: {
                                    notEmpty: {
                                        message: 'Jenjang Biaya diperlukan'
                                    }
                                }
                            },
                            id_jenis_kelamin: {
                                validators: {
                                    notEmpty: {
                                        message: 'Jenis Kelamin diperlukan'
                                    }
                                }
                            },
                            id_jalur: {
                                validators: {
                                    notEmpty: {
                                        message: 'Program Biaya diperlukan'
                                    }
                                }
                            },
                            id_nama_biaya: {
                                validators: {
                                    notEmpty: {
                                        message: 'Opsi Nama Biaya diperlukan'
                                    }
                                }
                            },
                            nominal: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nominal Biaya diperlukan'
                                    },
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: ''

                                    },
                                }
                            },
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