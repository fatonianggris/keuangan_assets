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

            var datatable = $('#kt_datatable_bank_account').KTDatatable({
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
                        field: 'Tipe',
                        title: 'Tipe',
                        width: 110,
                        textAlign: 'center',
                        template: function (row) {
                            var status = {
                                1: {
                                    'title': 'BANK',
                                    'class': 'label-light-success'
                                },
                                2: {
                                    'title': 'E-WALLET',
                                    'class': 'label-light-info'
                                }
                            };
                            return '<span class="label font-weight-bold label-lg ' + status[row.Tipe].class + ' label-inline">' + status[row.Tipe].title + '</span>';
                        },
                    },
                    {
                        field: 'Nama Alat Bayar',
                        title: 'Nama Alat Bayar',
                        width: 300,
                        autoHide: false

                    },
                    {
                        field: 'Atas Nama',
                        title: 'Atas Nama',
                        width: 250,
                    },
                    {
                        field: 'Nomor Alat Bayar',
                        title: 'Nomor Alat Bayar',
                        width: 250,
                    },
                    {
                        field: 'Status',
                        title: 'Status',
                        width: 100,
                        textAlign: 'center'
                    },
                ]
            });

            $('#kt_datatable_search_tipe').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'Tipe');
            });

            $('#kt_datatable_search_tipe').selectpicker();
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