/******/ (() => { // webpackBootstrap
    var __webpack_exports__ = {};
    /*!***********************************************************************!*\
     !*** ../demo1/src/js/pages/crud/forms/widgets/bootstrap-maxlength.js ***!
     \***********************************************************************/
// Class definition

    var KTBootstrapMaxlength = function () {

        // Private functions
        var demos = function () {
            $('#kt_maxlength_nisn').maxlength({
                warningClass: "label label-warning label-rounded label-inline",
                limitReachedClass: "label label-success label-rounded label-inline"
            });
            $('#kt_maxlength_nik').maxlength({
                warningClass: "label label-warning label-rounded label-inline",
                limitReachedClass: "label label-success label-rounded label-inline"
            });

            $('#kt_maxlength_nik_ayah').maxlength({
                warningClass: "label label-warning label-rounded label-inline",
                limitReachedClass: "label label-success label-rounded label-inline"
            });

            $('#kt_maxlength_nik_ibu').maxlength({
                warningClass: "label label-warning label-rounded label-inline",
                limitReachedClass: "label label-success label-rounded label-inline"
            });

            $('#kt_maxlength_nik_wali').maxlength({
                warningClass: "label label-warning label-rounded label-inline",
                limitReachedClass: "label label-success label-rounded label-inline"
            });
            // minimum setup
            $('#kt_maxlength_pegawai').maxlength({
                warningClass: "label label-warning label-rounded label-inline",
                limitReachedClass: "label label-success label-rounded label-inline"
            });

            $('#kt_maxlength_rt').maxlength({
                warningClass: "label label-warning label-rounded label-inline",
                limitReachedClass: "label label-success label-rounded label-inline"
            });

            $('#kt_maxlength_rw').maxlength({
                warningClass: "label label-warning label-rounded label-inline",
                limitReachedClass: "label label-success label-rounded label-inline"
            });

            $('#kt_maxlength_kodepos').maxlength({
                warningClass: "label label-warning label-rounded label-inline",
                limitReachedClass: "label label-success label-rounded label-inline"
            });

            $('#kt_maxlength_rt_dom').maxlength({
                warningClass: "label label-warning label-rounded label-inline",
                limitReachedClass: "label label-success label-rounded label-inline"
            });

            $('#kt_maxlength_rw_dom').maxlength({
                warningClass: "label label-warning label-rounded label-inline",
                limitReachedClass: "label label-success label-rounded label-inline"
            });

            $('#kt_maxlength_kodepos_dom').maxlength({
                warningClass: "label label-warning label-rounded label-inline",
                limitReachedClass: "label label-success label-rounded label-inline"
            });

            $('#kt_maxlength_nohp').maxlength({
                warningClass: "label label-warning label-rounded label-inline",
                limitReachedClass: "label label-success label-rounded label-inline"
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
        KTBootstrapMaxlength.init();
    });

    /******/ })()
        ;
//# sourceMappingURL=bootstrap-maxlength.js.map