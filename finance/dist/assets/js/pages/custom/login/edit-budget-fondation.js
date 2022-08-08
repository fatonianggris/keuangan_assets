/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    var __webpack_exports__ = {};

// Class Definition
    var KTLogin = function () {
        var _login;

        var _handleSignInForm = function () {
            var validation;
            var form = KTUtil.getById('kt_edit_budget_form')
            // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
            validation = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            nama_anggaran: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nama Proposal Anggaran diperlukan'
                                    },
                                }
                            },
                            nominal_dana_awal: {
                                validators: {
                                    notEmpty: {
                                        message: 'Total Dana Anggaran diperlukan'
                                    },
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: '',
                                        decimalSeparator: '.'
                                    },
                                }
                            },
                            waktu: {
                                validators: {
                                    notEmpty: {
                                        message: 'Waktu Penggunaan diperlukan'
                                    },
                                }
                            },
                            id_tahun_ajaran: {
                                validators: {
                                    notEmpty: {
                                        message: 'Tahun Ajaran diperlukan'
                                    }
                                }
                            },
                            file_laporan_proposal: {
                                validators: {
                                    file: {
                                        extension: 'pdf',
                                        type: 'application/pdf',
                                        maxSize: 25097152,
                                        message: 'File harus berekstensi pdf dan < 5Mb'
                                    }
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