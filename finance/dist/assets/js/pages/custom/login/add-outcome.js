/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    var __webpack_exports__ = {};

// Class Definition
    var KTLogin = function () {
        var _login;

        var _handleSignInForm = function () {
            var validation;
            var form = KTUtil.getById('kt_add_outcome_form')
            // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
            validation = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            nama_pengeluaran: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nama Pengeluaran diperlukan'
                                    },
                                }
                            },
                            jenis_pengeluaran: {
                                validators: {
                                    notEmpty: {
                                        message: 'Kategori Bidang diperlukan'
                                    }
                                }
                            },
                            nominal_pengeluaran: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nominal Pengeluaran diperlukan'
                                    },
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: '',
                                        decimalSeparator: ''
                                    },
                                }
                            },
                            status_pembayaran: {
                                validators: {
                                    notEmpty: {
                                        message: 'Jenis Pembayaran diperlukan'
                                    },
                                }
                            },
                            jenjang_pengeluaran: {
                                validators: {
                                    notEmpty: {
                                        message: 'Jenjang Pengeluaran diperlukan'
                                    },
                                }
                            },
                            id_tahun_ajaran: {
                                validators: {
                                    notEmpty: {
                                        message: 'Tahun Ajaran diperlukan'
                                    },
                                }
                            },
                            file_nota: {
                                validators: {
                                    notEmpty: {
                                        message: 'Upload Nota Pengeluaran diperlukan'
                                    },
                                    file: {
                                        extension: 'jpeg,jpg,png',
                                        type: 'image/jpeg,image/png',
                                        maxSize: 5097152,
                                        message: 'Foto harus berekstensi jpeg,jpg,png dan < 5Mb'
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

            $('.dropify-outcome').dropify({
                messages: {
                    'default': 'Klik atau Geser file Anda disini',
                    'replace': 'Klik atau Geser file Anda untuk mengganti',
                    'remove': 'Hapus',
                    'error': 'Ooops, terjadi kesalahan.'
                }
            });

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