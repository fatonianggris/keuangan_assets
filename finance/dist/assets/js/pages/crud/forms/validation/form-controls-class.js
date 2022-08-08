/******/ (() => { // webpackBootstrap
    var __webpack_exports__ = {};
    /*!********************************************************************!*\
     !*** ../demo1/src/js/pages/crud/forms/validation/form-controls.js ***!
     \********************************************************************/
// Class definition
    var KTFormControls = function () {
        // Private functions
        var _initKelas = function () {
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
                            inisial_kelas: {
                                validators: {
                                    notEmpty: {
                                        message: 'Inisial Kelas diperlukan'
                                    }
                                }
                            },
                            id_tingkat: {
                                validators: {
                                    notEmpty: {
                                        message: 'Nama Tingkat diperlukan'
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
            }
        };
    }();

    jQuery(document).ready(function () {
        KTFormControls.init();
    });

    /******/
})();
//# sourceMappingURL=form-controls.js.map