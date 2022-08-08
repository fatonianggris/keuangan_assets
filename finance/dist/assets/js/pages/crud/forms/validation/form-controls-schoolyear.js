/******/ (() => { // webpackBootstrap
    var __webpack_exports__ = {};
    /*!********************************************************************!*\
     !*** ../demo1/src/js/pages/crud/forms/validation/form-controls.js ***!
     \********************************************************************/
// Class definition
    var KTFormControls = function () {
        // Private functions
        var _initTahunAjaran = function () {
            FormValidation.formValidation(
                    document.getElementById('kt_form_tahunajaran'),
                    {
                        fields: {
                            tahun_awal: {
                                validators: {
                                    notEmpty: {
                                        message: 'Tahun Awal diperlukan'
                                    }
                                }
                            },
                            tahun_akhir: {
                                validators: {
                                    notEmpty: {
                                        message: 'Tahun Akhir diperlukan'
                                    }
                                }
                            },
                            semester: {
                                validators: {
                                    notEmpty: {
                                        message: 'Semester diperlukan'
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
                _initTahunAjaran();
            }
        };
    }();

    jQuery(document).ready(function () {
        KTFormControls.init();
    });

    /******/
})();
//# sourceMappingURL=form-controls.js.map