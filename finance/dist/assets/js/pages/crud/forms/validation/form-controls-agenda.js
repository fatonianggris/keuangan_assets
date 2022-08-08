/******/ (() => { // webpackBootstrap
    var __webpack_exports__ = {};
    /*!********************************************************************!*\
     !*** ../demo1/src/js/pages/crud/forms/validation/form-controls.js ***!
     \********************************************************************/
// Class definition
    var KTFormControls = function () {
        // Private functions
        var _initAgenda = function () {
            FormValidation.formValidation(
                    document.getElementById('kt_form_agenda'),
                    {
                        fields: {
                            judul_acara: {
                                validators: {
                                    notEmpty: {
                                        message: 'Judul Acara diperlukan'
                                    }
                                }
                            },
                            mulai: {
                                validators: {
                                    notEmpty: {
                                        message: 'Tanggal Acara diperlukan'
                                    }
                                }
                            },
                            tujuan: {
                                validators: {
                                    notEmpty: {
                                        message: 'Tujuan diperlukan'
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
                _initAgenda();
            }
        };
    }();

    jQuery(document).ready(function () {
        KTFormControls.init();
    });

    /******/
})();
//# sourceMappingURL=form-controls.js.map