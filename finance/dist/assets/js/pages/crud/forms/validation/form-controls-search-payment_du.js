/******/ (() => { // webpackBootstrap
    var __webpack_exports__ = {};
    /*!********************************************************************!*\
     !*** ../demo1/src/js/pages/crud/forms/validation/form-controls.js ***!
     \********************************************************************/
// Class definition
    var KTFormControls = function () {
        var _form;
        // Private functions
        var _initKelas = function () {
            FormValidation.formValidation(
                    document.getElementById('kt_search_payment'),
                    {
                        fields: {
                            nomor_pembayaran_du: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nomor Pembayaran DU Siswa diperlukan'
                                    },
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: '',
                                        decimalSeparator: ''
                                    },
                                }
                            },

                        },

                        plugins: {//Learn more: https://formvalidation.io/guide/plugins
                            trigger: new FormValidation.plugins.Trigger(),
                            // Bootstrap Framework Integration
                            bootstrap: new FormValidation.plugins.Bootstrap(),
                            // Validate fields when clicking the Submit button
                            submitButton: new FormValidation.plugins.SubmitButton(),
                            // Submit the form when all fields are valid
                            defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
                        }
                    }
            );
        };

        var _initModal = function () {
            const form = document.getElementById('kt_upload_payment_du');
            const fv = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            file_tagihan_dpb: {
                                validators: {
                                    notEmpty: {
                                        message: 'Upload File Excel diperlukan'
                                    },
                                    file: {
                                        maxSize: 10097152,
                                        message: 'Foto harus berekstensi xls, xlsx dan < 10Mb'
                                    }
                                }
                            },
                            pass_verification: {
                                validators: {
                                    notEmpty: {
                                        message: 'Inputkan Kata Sandi Anda'
                                    }
                                }
                            }

                        },

                        plugins: {//Learn more: https://formvalidation.io/guide/plugins
                            trigger: new FormValidation.plugins.Trigger(),
                            // Bootstrap Framework Integration
                            bootstrap: new FormValidation.plugins.Bootstrap(),
                            // Validate fields when clicking the Submit button
                            submitButton: new FormValidation.plugins.SubmitButton()

                        }
                    }
            );
            _form.on('submit', function (wizard) {
                if (fv) {
                    fv.validate().then(function (status) {
                        if (status == 'Valid') {
                            grecaptcha.ready(function () {
                                if (grecaptcha.getResponse() === "") {
                                    Swal.fire({
                                        text: "Google reCAPTCHA wajib dicentang.",
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "Oke!",
                                        customClass: {
                                            confirmButton: "btn font-weight-bold btn-primary"
                                        }
                                    }).then(function () {
                                        KTUtil.scrollTop();
                                    });
                                } else {
                                    KTApp.blockPage({
                                        overlayColor: '#FFA800',
                                        state: 'warning',
                                        size: 'lg',
                                        opacity: 0.1,
                                        message: 'Silahkan Tunggu...'
                                    });
                                    form.submit(); // Submit form
                                }
                            });
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

        return {
            // public functions
            init: function () {
                _form = $('#kt_modal');
                _initKelas();
                _initModal();
            }
        };
    }();

    jQuery(document).ready(function () {
        KTFormControls.init();
    });

    /******/
})();
//# sourceMappingURL=form-controls.js.map