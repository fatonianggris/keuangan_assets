/******/ (() => { // webpackBootstrap
    var __webpack_exports__ = {};
    /*!*****************************************************************************!*\
     !*** ../demo1/src/js/pages/crud/forms/widgets/bootstrap-daterangepicker.js ***!
     \*****************************************************************************/
// Class definition

    var KTBootstrapDaterangepicker = function () {

        // Private functions
        var demos = function () {
            // minimum setup

            // date picker
            $('#kt_daterangepicker_5').daterangepicker({
                buttonClasses: ' btn',
                applyClass: 'btn-primary',
                cancelClass: 'btn-secondary',

                singleDatePicker: true,
                showDropdowns: true,
                locale: {
                    format: 'DD/MM/YYYY'
                }
            }, function (start, label) {
                $('#kt_daterangepicker_5 .form-control').val(start.format('DD/MM/YYYY'));
            });

            $('#kt_daterangepicker_ibu').daterangepicker({
                buttonClasses: ' btn',
                applyClass: 'btn-primary',
                cancelClass: 'btn-secondary',

                singleDatePicker: true,
                showDropdowns: true,
                locale: {
                    format: 'DD/MM/YYYY'
                }
            }, function (start, label) {
                $('#kt_daterangepicker_ibu .form-control').val(start.format('DD/MM/YYYY'));
            });

            $('#kt_daterangepicker_ayah').daterangepicker({
                buttonClasses: ' btn',
                applyClass: 'btn-primary',
                cancelClass: 'btn-secondary',

                singleDatePicker: true,
                showDropdowns: true,
                locale: {
                    format: 'DD/MM/YYYY'
                }
            }, function (start, label) {
                $('#kt_daterangepicker_ayah .form-control').val(start.format('DD/MM/YYYY'));
            });

            $('#kt_daterangepicker_wali').daterangepicker({
                buttonClasses: ' btn',
                applyClass: 'btn-primary',
                cancelClass: 'btn-secondary',

                singleDatePicker: true,
                showDropdowns: true,
                locale: {
                    format: 'DD/MM/YYYY'
                }
            }, function (start, label) {
                $('#kt_daterangepicker_wali .form-control').val(start.format('DD/MM/YYYY'));
            });


        };

        return {
            // public functions
            init: function () {
                demos();

            }
        };
    }();

    jQuery(document).ready(function () {
        KTBootstrapDaterangepicker.init();
    });

    /******/ })();
//# sourceMappingURL=bootstrap-daterangepicker.js.map