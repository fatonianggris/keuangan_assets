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

            var datatable = $('#kt_datatable_schedule').KTDatatable({
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
                columns: [
                    {
                        field: 'Nama Jadwal',
                        title: 'Nama Jadwal',
                        textAlign: 'center',
                        width: 250,
                        autoHide: false

                    },
                    {
                        field: 'Tanggal',
                        title: 'Tanggal',
                        width: 120,
                        template: function (row) {
                            return '<span class="label font-weight-bold label-lg label-light-default label-inline">' + row.Tanggal + '</span>';
                        }
                    },
                    {
                        field: 'Jam',
                        title: 'Jam',
                        width: 70,
                    },
                    {
                        field: 'Deadline',
                        title: 'Deadline',
                        width: 120,
                        template: function (row) {
                            var status = {
                                1: {
                                    'title': 'ONGOING',
                                    'class': 'label-light-success'
                                },
                                2: {
                                    'title': 'EXPIRED',
                                    'class': 'label-light-danger'
                                }
                            };
                            return '<span class="label font-weight-bold label-lg ' + status[row.Deadline].class + ' label-inline">' + status[row.Deadline].title + '</span>';
                        },
                    },
                    {
                        field: 'Lokasi',
                        title: 'Lokasi',
                        width: 400,
                    },
                ]
            });

            $('#kt_datatable_search_masa').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'Deadline');
            });

            $('#kt_datatable_search_masa').selectpicker();
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