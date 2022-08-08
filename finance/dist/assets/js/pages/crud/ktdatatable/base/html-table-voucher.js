/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    var __webpack_exports__ = {};
    /*!*****************************************************************!*\
     !*** ../demo1/src/js/pages/crud/ktdatatable/base/html-table.js ***!
     \*****************************************************************/

// Class definition

    var KTDatatableHtmlTableDemo = function () {
        // Private functions

        // demo initializer
        var demo = function () {

            var datatable = $('#kt_datatable_voucher').KTDatatable({
                data: {
                    saveState: {cookie: false},
                    pageSize: 5
                },
                search: {
                    input: $('#kt_datatable_search_query'),
                    key: 'generalSearch',
                },
                layout: {
                    class: 'datatable-bordered datatable-head-custom',
                },
                columns: [{
                        field: 'Kode Voucher',
                        title: 'Kode Voucher',
                        width: 120,
                        textAlign: 'center',
                    },
                    {
                        field: 'Jenis',
                        title: 'Jenis',
                        width: 150,
                        template: function (row) {
                            var status = {
                                1: {
                                    'title': 'PENDAFTARAN (FORMULIR)',
                                    'class': 'label-light-warning'
                                },
                                2: {
                                    'title': 'UANG MASUK (PPDB)',
                                    'class': 'label-light-primary'
                                }
                            };
                            return '<span class="label font-weight-bold label-lg ' + status[row.Jenis].class + ' label-inline">' + status[row.Jenis].title + '</span>';
                        },
                    },
                    {
                        field: 'Nama Voucher',
                        title: 'Nama Voucher',
                        width: 230,
                        autoHide: false
                    },
                    {
                        field: 'Potongan',
                        title: 'Potongan',
                        width: 100,
                        template: function (row) {
                            return '<span class="label font-weight-bold label-lg label-light-default label-inline"><b class="text-danger">' + row.Potongan + '%</b></span>';
                        }
                    },
                    {
                        field: 'Jumlah Voucher',
                        title: 'Jumlah Voucher',
                        width: 100,
                    },
                    {
                        field: 'Voucher Terpakai',
                        title: 'Voucher Terpakai',
                        width: 100,
                        textAlign: 'center'
                    },
                    {
                        field: 'Masa Berlaku',
                        title: 'Masa Berlaku',
                        width: 150,
                        textAlign: 'center'
                    },
                ]
            });

            $('#kt_datatable_search_voucher').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'Jenis');
            });

            $('#kt_datatable_search_voucher').selectpicker();
        };

        return {
            // Public functions
            init: function () {
                // init dmeo
                demo();
            },
        };
    }();

    jQuery(document).ready(function () {
        KTDatatableHtmlTableDemo.init();
    });

    /******/ })()
        ;
//# sourceMappingURL=html-table.js.map