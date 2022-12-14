/******/ (() => { // webpackBootstrap
    var __webpack_exports__ = {};
    /*!********************************************************************!*\
     !*** ../demo1/src/js/pages/crud/forms/validation/form-controls.js ***!
     \********************************************************************/
// Class definition
    var KTFormControls = function () {
        // Private functions

        const _initKelas = function () {
            FormValidation.formValidation(
                    document.getElementById('kt_form_kelas'),
                    {
                        fields: {
                            nama_kelas: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nama Kelas diperlukan'
                                    }
                                }
                            },
                            level_kelas: {
                                validators: {
                                    notEmpty: {
                                        message: 'Level Kelas diperlukan'
                                    }
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

        const _initJabatan = function () {
            FormValidation.formValidation(
                    document.getElementById('kt_form_jabatan'),
                    {
                        fields: {
                            nama_jabatan: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nama Jabatan diperlukan'
                                    }
                                }
                            },
                            level_jabatan: {
                                validators: {
                                    notEmpty: {
                                        message: 'Level Jabatan diperlukan'
                                    }
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

        const _initTingkat = function () {
            FormValidation.formValidation(
                    document.getElementById('kt_form_tingkat'),
                    {
                        fields: {
                            nama_tingkat: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nama Tingkat diperlukan'
                                    }
                                }
                            },
                            level_tingkat: {
                                validators: {
                                    notEmpty: {
                                        message: 'Level Tingkat diperlukan'
                                    }
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

        return {
            // public functions
            init: function () {
                _initKelas();
                _initJabatan();
                _initTingkat();

                //_initDemo2();
            }
        };
    }();

    jQuery(document).ready(function () {
        KTFormControls.init();
    });

    /******/ })();
//# sourceMappingURL=form-controls.js.map