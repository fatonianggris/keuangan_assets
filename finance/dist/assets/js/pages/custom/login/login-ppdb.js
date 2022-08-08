/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    var __webpack_exports__ = {};

// Class Definition
    var KTLogin = function () {
        var _login;

        var _showForm = function (form) {
            var cls = 'login-' + form + '-on';
            var form = 'kt_login_' + form + '_form';

            _login.removeClass('login-forgot-on');
            _login.removeClass('login-signin-on');

            _login.addClass(cls);

            KTUtil.animateClass(KTUtil.getById(form), 'animate__animated animate__backInUp');
        }

        var _handleSignInForm = function () {
            var validation;
            var form = KTUtil.getById('kt_login_signin_form_ppdb');
            // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
            validation = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            email: {
                                validators: {
                                    notEmpty: {
                                        message: 'Inputkan Email Anda'
                                    },
                                    emailAddress: {
                                        message: 'Email Anda Tidak Valid'
                                    }
                                }
                            },
                            password: {
                                validators: {
                                    notEmpty: {
                                        message: 'Inputkan Kata Sandi Anda'
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

            // Handle forgot button
            $('#kt_login_forgot').on('click', function (e) {
                e.preventDefault();
                _showForm('forgot');
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

        }


        var _handleForgotForm = function (e) {

            // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
            FormValidation.formValidation(
                    KTUtil.getById('kt_login_forgot_form'),
                    {
                        fields: {
                            email: {
                                validators: {
                                    notEmpty: {
                                        message: 'Inputkan Email Anda'
                                    },
                                    emailAddress: {
                                        message: 'Email Anda Tidak Valid'
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap(),

                        }
                    }
            );

            // Handle cancel button
            $('#kt_login_forgot_cancel').on('click', function (e) {
                e.preventDefault();
                _showForm('signin');
            });
        }
        // Public Functions
        return {
            // public functions
            init: function () {
                _login = $('#kt_login');

                _handleSignInForm();
                _handleForgotForm();
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