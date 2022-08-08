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

            var datatable = $('#kt_datatable_admission').KTDatatable({
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
                        field: 'No Formulir',
                        title: 'No Formulir',
                        width: 80,
                        type: 'number',
                        autoHide: false
                    },
                    {
                        field: 'Nama Calon',
                        title: 'Nama Calon',
                        width: 200,
                        autoHide: false
                    },
                    {
                        field: 'JK',
                        title: 'JK',
                        width: 40,
                        template: function (row) {
                            var status = {
                                1: {
                                    'title': 'L',
                                    'class': 'label-light-warning'
                                },
                                2: {
                                    'title': 'P',
                                    'class': 'label-light-success'
                                }
                            };
                            return '<span class="label font-weight-bold label-lg ' + status[row.JK].class + ' label-inline">' + status[row.JK].title + '</span>';
                        },
                    },
                    {
                        field: 'Jenjang',
                        title: 'Jenjang',
                        width: 70,
                        template: function (row) {
                            var status = {
                                1: {
                                    'title': 'KB',
                                    'class': 'label-light-info'
                                },
                                2: {
                                    'title': 'TK',
                                    'class': 'label-light-primary'
                                },
                                3: {
                                    'title': 'SD',
                                    'class': 'label-light-success'
                                },
                                4: {
                                    'title': 'SMP',
                                    'class': 'label-light-warning'
                                },
                                5: {
                                    'title': 'SMA',
                                    'class': 'label-light-danger'
                                },
                                6: {
                                    'title': 'UMUM',
                                    'class': 'label-light-default'
                                }
                            };
                            return '<span class="label font-weight-bold label-lg ' + status[row.Jenjang].class + ' label-inline">' + status[row.Jenjang].title + '</span>';
                        },
                    },
                    {
                        field: 'Program',
                        title: 'Program',
                        width: 90,
                        template: function (row) {
                            var status = {
                                1: {
                                    'title': 'REGULER',
                                    'class': 'label-light-info'
                                },
                                2: {
                                    'title': 'ICP',
                                    'class': 'label-light-success'
                                }
                            };
                            return '<span class="label font-weight-bold label-lg ' + status[row.Program].class + ' label-inline">' + status[row.Program].title + '</span>';
                        },
                    },
                    {
                        field: 'Penerimaan',
                        title: 'Penerimaan',
                        width: 130,
                        template: function (row) {
                            var status = {
                                0: {
                                    'title': 'PROSES OBSERVASI',
                                    'class': 'label-light-warning'
                                },
                                1: {
                                    'title': 'DITERIMA',
                                    'class': 'label-light-success'
                                },
                                2: {
                                    'title': 'DITOLAK',
                                    'class': 'label-light-danger'
                                }

                            };
                            return '<span class="label font-weight-bold label-lg ' + status[row.Penerimaan].class + ' label-inline">' + status[row.Penerimaan].title + '</span>';
                        },
                    },
                    {
                        field: 'No Whatsapp',
                        title: 'No Whatsapp',
                        width: 120,
                        type: 'number',
                    },
                    {
                        field: 'Tanggal',
                        title: 'Tanggal',
                        width: 100,
                        template: function (row) {
                            return '<span class="label font-weight-bold label-lg label-light-default label-inline">' + row.Tanggal + '</span>';
                        }
                    },
                    {
                        field: 'TA',
                        title: 'TA',
                        width: 90,
                    },
                ]
            });
            var th = $('#kt_datatable_search_schoolyear').find("option:selected");
            datatable.search(th.val().toLowerCase(), 'TA');

            $('#kt_datatable_search_grade').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'Jenjang');
            });

            $('#kt_datatable_search_program').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'Program');
            });

            $('#kt_datatable_search_gender').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'JK');
            });

            $('#kt_datatable_search_sold').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'Pembayaran');
            });

            $('#kt_datatable_search_schoolyear').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'TA');
            });

            $('#kt_datatable_search_grade', '#kt_datatable_search_program', '#kt_datatable_search_gender', '#kt_datatable_search_sold', '#kt_datatable_search_schoolyear').selectpicker();
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