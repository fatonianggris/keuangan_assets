/******/ (() => { // webpackBootstrap
    var __webpack_exports__ = {};
    /*!***********************************************************!*\
     !*** ../demo1/src/js/pages/crud/forms/widgets/select2.js ***!
     \***********************************************************/
// Class definition
    var KTSelect2 = function () {
        // Private functions
        var demos = function () {

            // basic
            $('#provinsi').select2({
                placeholder: "Pilih Provinsi",
                allowClear: true
            });

            $('#kabupaten_kota').select2({
                placeholder: "Pilih Kabupaten/Kota",
                allowClear: true
            });

            $('#kecamatan').select2({
                placeholder: "Pilih Kecamatan",
                allowClear: true
            });

            $('#kelurahan_desa').select2({
                placeholder: "Pilih Kelurahan/Desa",
                allowClear: true
            });


            // dom
            $('#provinsi_dom').select2({
                placeholder: "Pilih Provinsi",
                allowClear: true
            });

            $('#kabupaten_kota_dom').select2({
                placeholder: "Pilih Kabupaten/Kota",
                allowClear: true
            });

            $('#kecamatan_dom').select2({
                placeholder: "Pilih Kecamatan",
                allowClear: true
            });

            $('#kelurahan_desa_dom').select2({
                placeholder: "Pilih Kelurahan/Desa",
                allowClear: true
            });
            
            // kk
            $('#provinsi_kk').select2({
                placeholder: "Pilih Provinsi",
                allowClear: true
            });

            $('#kabupaten_kota_kk').select2({
                placeholder: "Pilih Kabupaten/Kota",
                allowClear: true
            });

            $('#kecamatan_kk').select2({
                placeholder: "Pilih Kecamatan",
                allowClear: true
            });

            $('#kelurahan_desa_kk').select2({
                placeholder: "Pilih Kelurahan/Desa",
                allowClear: true
            });

        };

        // Public functions
        return {
            init: function () {
                demos();
            }
        };
    }();

// Initialization
    jQuery(document).ready(function () {
        KTSelect2.init();
    });

    /******/ })()
        ;
//# sourceMappingURL=select2.js.map