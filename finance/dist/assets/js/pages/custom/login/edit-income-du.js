/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    var __webpack_exports__ = {};

// Class Definition
    var KTLogin = function () {
        var _login;

        var _handleSignInForm = function () {
            var validation;
            var form = KTUtil.getById('kt_edit_income_du_form');
            // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
            validation = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            nomor_invoice: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nomor Invoice Tagihan diperlukan'
                                    },
                                    remote: {
                                        message: 'Nomor Invoice telah digunakan',
                                        method: 'POST',
                                        url: HOST_URL + 'finance/income/income/check_invoice_number_du',
                                        data: function () {
                                            return {
                                                nomor_invoice: form.querySelector('[name="nomor_invoice"]').value,
                                                id_tagihan: form.querySelector('[name="id_tagihan"]').value,
                                            };
                                        },
                                    },
                                }
                            },
                            nomor_pembayaran: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nomor Pembayaran diperlukan'
                                    },
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: '',
                                        decimalSeparator: ''
                                    },
                                    remote: {
                                        message: 'Nomor Pembayaran telah digunakan',
                                        method: 'POST',
                                        url: HOST_URL + 'finance/income/income/check_payment_number_du',
                                        data: function () {
                                            return {
                                                nomor_pembayaran: form.querySelector('[name="nomor_pembayaran"]').value,
                                                id_tagihan: form.querySelector('[name="id_tagihan"]').value,
                                            };
                                        },
                                    },
                                }
                            },
                            nominal_tagihan: {
                                validators: {
                                    notEmpty: {
                                        message: 'Total Nominal diperlukan'
                                    },
                                    integer: {
                                        message: 'Inputan harus Angka',
                                        // The default separators
                                        thousandsSeparator: '',
                                        decimalSeparator: ''
                                    },
                                }
                            },
                            nama_siswa: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nama Siswa diperlukan'
                                    },
									regexp: {
										regexp: /^[a-zs\s.()-]+$/i,
										message: 'Inputan harus berupa huruf'
									}
                                },
                            },
                            tanggal_invoice: {
                                validators: {
                                    notEmpty: {
                                        message: 'Tanggal Invoice diperlukan'
                                    }
                                }
                            },
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            submitButton: new FormValidation.plugins.SubmitButton(),
                            bootstrap: new FormValidation.plugins.Bootstrap()
                        }
                    }
            );

            _login.on('submit', function (wizard) {
                if (validation) {
                    validation.validate().then(function (status) {
                        if (status == 'Valid') {
                            Swal.fire({
                                title: "Peringatan!",
                                html: "Apakah anda yakin ingin <b>MENYETUJUI</b> Update Data Tagihan DU ini?",
                                icon: "warning",
                                input: 'password',
                                inputLabel: 'Password Anda',
                                inputPlaceholder: 'Masukkan password Anda',
                                inputAttributes: {
                                    'aria-label': 'Masukkan password Anda'
                                },
                                inputValidator: (value) => {
                                    if (!value) {
                                        return 'Password Anda diperlukan!'
                                    }
                                },
                                showCancelButton: true,
                                confirmButtonColor: "#1BC5BD",
                                confirmButtonText: "Ya, Setuju!",
                                cancelButtonText: "Tidak, Nanti saja!",
                                showLoaderOnConfirm: true,
                                closeOnConfirm: false,
                                closeOnCancel: true,
                                preConfirm: (text) => {
                                    return $.ajax({
                                        type: "post",
										url: `${HOST_URL}/finance/income/income/confirm_update_income`,
                                        data: {password: text},
                                        dataType: 'html',
                                        success: function (result) {
                                            if (result == 1) {
                                                Swal.fire("Berhasil!", "Persetujuan Update Data Tagihan DU telah dilakukan.", "success");
                                                setTimeout(function () {
                                                    KTApp.blockPage({
                                                        overlayColor: '#FFA800',
                                                        state: 'warning',
                                                        size: 'lg',
                                                        opacity: 0.1,
                                                        message: 'Silahkan Tunggu...'
                                                    });
                                                    form.submit(); // Submit form
                                                }, 1000);
                                            } else {
                                                Swal.fire("Opsss!", "Password Anda Salah. Ulangi kembali", "error");
                                            }
                                        },
                                        error: function (result) {
                                            console.log(result);
                                            Swal.fire("Opsss!", "Koneksi Internet Bermasalah.", "error");
                                        }
                                    });
                                },
                                allowOutsideClick: () => !Swal.isLoading()
                            }).then(function (result) {
                                if (!result.isConfirm) {
                                    Swal.fire("Dibatalkan!", "Persetujuan Update Data Tagihan DU telah dibatalkan.", "error");
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

