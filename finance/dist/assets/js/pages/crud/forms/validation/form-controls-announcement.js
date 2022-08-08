/******/ (() => { // webpackBootstrap
    var __webpack_exports__ = {};
    /*!********************************************************************!*\
     !*** ../demo1/src/js/pages/crud/forms/validation/form-controls.js ***!
     \********************************************************************/
// Class definition
    var KTFormControls = function () {
        // Private functions
        var _initPengumuman = function () {
            FormValidation.formValidation(
                    document.getElementById('kt_form_pengumuman'),
                    {
                        fields: {
                            judul_pengumuman: {
                                validators: {
                                    notEmpty: {
                                        message: 'Judul Pengumuman diperlukan'
                                    }
                                }
                            },
                            kategori_pengumuman: {
                                validators: {
                                    notEmpty: {
                                        message: 'Kategori Pengumuman diperlukan'
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
                            keterangan: {
                                validators: {
                                    notEmpty: {
                                        message: 'Deskripsi/Keterangan diperlukan'
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
                _initPengumuman();
            }
        };
    }();

    jQuery(document).ready(function () {
        KTFormControls.init();
    });

    /******/
})();
//# sourceMappingURL=form-controls.js.map