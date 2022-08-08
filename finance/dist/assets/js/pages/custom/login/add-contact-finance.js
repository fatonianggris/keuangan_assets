/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    var __webpack_exports__ = {};

// Class Definition
    var KTLogin = function () {
        var _login;

        var _handleSignInForm = function () {
            var validation;
            var form = KTUtil.getById('kt_add_contact_form');
            // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
            validation = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            nomor_telephone: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nomor Telepon Kantor diperlukan'
                                    },
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: '',
                                        decimalSeparator: '.'
                                    },

                                }
                            },
                            no_handphone: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nomor Handphone Kantor diperlukan'
                                    },
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: '',
                                        decimalSeparator: '.'
                                    },
                                }
                            },
                            no_handphone_tk: {
                                validators: {
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: '',
                                        decimalSeparator: '.'
                                    },
                                }
                            },
                            no_handphone_sd: {
                                validators: {
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: '',
                                        decimalSeparator: '.'
                                    },
                                }
                            },
                            no_handphone_smp: {
                                validators: {
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: '',
                                        decimalSeparator: '.'
                                    },
                                }
                            },
                            no_handphone_sma: {
                                validators: {
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: '',
                                        decimalSeparator: '.'
                                    },
                                }
                            },
                            email: {
                                validators: {
                                    notEmpty: {
                                        message: 'Email Kantor diperlukan'
                                    },
                                    emailAddress: {
                                        message: 'Inputan harus berformat Email'
                                    }
                                }
                            },
                            url_website: {
                                validators: {
                                    notEmpty: {
                                        message: 'URL Website Kantor diperlukan'
                                    }, uri: {
                                        message: 'Alamat URL tidak valid'
                                    }

                                }
                            },
                            alamat: {
                                validators: {
                                    notEmpty: {
                                        message: 'Alamat Kantor diperlukan'
                                    }

                                }
                            },
                            jam_kerja: {
                                validators: {
                                    notEmpty: {
                                        message: 'Jam Kerja Kantor diperlukan'
                                    }

                                }
                            },
                            akun_instagram: {
                                validators: {
                                    uri: {
                                        message: 'Alamat URL tidak valid'
                                    }
                                }
                            },
                            akun_facebook: {
                                validators: {
                                    uri: {
                                        message: 'Alamat URL tidak valid'
                                    }
                                }
                            },
                            akun_twitter: {
                                validators: {
                                    uri: {
                                        message: 'Alamat URL tidak valid'
                                    }
                                }
                            },
                            akun_youtube: {
                                validators: {
                                    uri: {
                                        message: 'Alamat URL tidak valid'
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