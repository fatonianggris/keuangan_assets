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

            var datatable = $('#kt_datatable_cost').KTDatatable({
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
                        field: 'Biaya',
                        title: 'Biaya',
                        width: 150,
                        textAlign: 'center',
                        template: function (row) {
                            var status = {
                                1: {
                                    'title': 'PENDAFTARAN',
                                    'class': 'label-light-primary'
                                },
                                2: {
                                    'title': 'UANG MASUK',
                                    'class': 'label-light-success'
                                }
                            };
                            return '<span class="label font-weight-bold label-lg ' + status[row.Biaya].class + ' label-inline">' + status[row.Biaya].title + '</span>';
                        },
                    },
                    {
                        field: 'JK',
                        title: 'JK',
                        width: 90,

                        template: function (row) {
                            var status = {
                                1: {
                                    'title': 'Laki-Laki',
                                    'class': 'label-light-warning'
                                },
                                2: {
                                    'title': 'Perempuan',
                                    'class': 'label-light-success'
                                }
                            };
                            return '<span class="label font-weight-bold label-lg ' + status[row.JK].class + ' label-inline">' + status[row.JK].title + '</span>';
                        },
                    },
                    {
                        field: 'Jenjang',
                        title: 'Jenjang',
                        width: 240,
                        template: function (row) {
                            var status = {
                                1: {
                                    'title': 'Kelompok Bermain (KB)',
                                    'class': 'label-light-info'
                                },
                                2: {
                                    'title': 'Taman Kanak-kanak (TK)',
                                    'class': 'label-light-primary'
                                },
                                3: {
                                    'title': 'Sekolah Dasar (SD)',
                                    'class': 'label-light-success'
                                },
                                4: {
                                    'title': 'Sekolah Menengah Pertama (SMP)',
                                    'class': 'label-light-warning'
                                },
                                5: {
                                    'title': 'Sekolah Menengah Atas (SMA)',
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
                        width: 80,
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
                        field: 'Nama Biaya',
                        title: 'Nama Biaya',
                        width: 250,
                        autoHide: false
                    },
                    {
                        field: 'Nominal Keseluruhan',
                        title: 'Nominal Keseluruhan',
                        width: 180,
                    },
                ]
            });
            var cs = $('#kt_datatable_search_cost').find("option:selected");
            datatable.search(cs.val().toLowerCase(), 'Biaya');

            var gr = $('#kt_datatable_search_grade').find("option:selected");
            datatable.search(gr.val().toLowerCase(), 'Jenjang');


            $('#kt_datatable_search_cost').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'Biaya');
            });

            $('#kt_datatable_search_grade').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'Jenjang');
            });

            $('#kt_datatable_search_program').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'Program');
            });

            $('#kt_datatable_search_gender').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'JK');
            });

            $('#kt_datatable_search_cost', '#kt_datatable_search_grade', '#kt_datatable_search_program', '#kt_datatable_search_gender').selectpicker();
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