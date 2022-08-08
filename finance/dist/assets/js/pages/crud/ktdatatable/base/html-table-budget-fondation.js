/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    var __webpack_exports__ = {};
    /*!*****************************************************************!*\
     !*** ../demo1/src/js/pages/crud/ktdatatable/base/html-table.js ***!
     \*****************************************************************/

// Class definition

    var KTDatatableHtmlTableDemo = function () {
        // Private functions

        var options = {
            data: {
                pageSize: 500,
            },

            search: {
                input: $('#kt_datatable_search_query'),
                key: 'generalSearch',
            },
            toolbar: {
                items: {
                    pagination: {pageSizeSelect: [500, 1000]}
                }
            },
            layout: {
                class: 'datatable-bordered datatable-head-custom',
                scroll: true,
                height: 600,
                footer: false
            },

            columns: [{
                    field: 'ID',
                    title: 'ID',
                    sortable: false,
                    width: 20,
                    selector: true,
                    textAlign: 'center',
                }, {
                    field: 'Nama Anggaran',
                    title: 'Nama Anggaran',
                    width: 200,
                    type: 'number',
                    autoHide: false
                },
                {
                    field: 'Pemohon',
                    title: 'Pemohon',
                    width: 100,
                    template: function (row) {
                        return '<span class="label font-weight-bold label-lg label-light-default label-inline">' + row.Tanggal + '</span>';
                    }
                },
                {
                    field: 'Dana Awal',
                    title: 'Dana Awal',
                    width: 100,
                },
                {
                    field: 'Proposal',
                    title: 'Proposal',
                    width: 70,
                    template: function (row) {
                        var status = {
                            1: {
                                'title': 'DIPROSES',
                                'class': 'label-light-warning'
                            },
                            2: {
                                'title': 'DISETUJUI',
                                'class': 'label-light-success'
                            },
                            3: {
                                'title': 'DITOLAK',
                                'class': 'label-light-danger'
                            }
                        };
                        return '<span class="label font-weight-bold label-lg ' + status[row.Proposal].class + ' label-inline">' + status[row.Proposal].title + '</span>';
                    },
                },
                {
                    field: 'Acc Prop',
                    title: 'Acc Prop',
                    width: 70,
                    template: function (row) {
                        return '<span class="label font-weight-bold label-lg label-light-default label-inline">' + row.Tanggal + '</span>';
                    }
                },
                {
                    field: 'Dana Terpakai',
                    title: 'Dana Terpakai',
                    width: 90,
                },
                {
                    field: 'Dana Sisa',
                    title: 'Dana Sisa',
                    width: 90,
                },
                {
                    field: 'LPJ',
                    title: 'LPJ',
                    width: 100,
                    template: function (row) {
                        var status = {
                            1: {
                                'title': 'DIPROSES',
                                'class': 'label-light-warning'
                            },
                            2: {
                                'title': 'DISETUJUI',
                                'class': 'label-light-success'
                            },
                            3: {
                                'title': 'DITOLAK',
                                'class': 'label-light-danger'
                            }
                        };
                        return '<span class="label font-weight-bold label-lg ' + status[row.LPJ].class + ' label-inline">' + status[row.LPJ].title + '</span>';
                    },
                },
                {
                    field: 'Acc LPJ',
                    title: 'Acc LPJ',
                    width: 70,
                    template: function (row) {
                        return '<span class="label font-weight-bold label-lg label-light-default label-inline">' + row.Tanggal + '</span>';
                    }
                },
                {
                    field: 'TA',
                    title: 'TA',
                    width: 70,
                    template: function (row) {
                        return '<span class="label font-weight-bold label-lg label-light-default label-inline">' + row.Tanggal + '</span>';
                    }
                },
            ]
        };


        var localSelectorDemo = function () {
            // enable extension
            options.extensions = {
                // boolean or object (extension options)
                checkbox: true,
            };

            var datatable = $('#kt_datatable_budget_fondation').KTDatatable(options);
            var count_data = null;

            datatable.on(
                    'datatable-on-check datatable-on-uncheck',
                    function (e) {
                        var checkedNodes = $.makeArray(datatable.getSelectedRecords().find('.checkbox-single > [type="checkbox"]').
                                map(function (i, chk) {
                                    return $(chk).val();
                                }));
                        count_data = checkedNodes.join(',');
                    });

            $('#frm-excel').on('submit', function () {
                document.getElementById('id_check_excel').value = count_data;
            });

            $('#frm-form').on('submit', function () {
                document.getElementById('id_check_form').value = count_data;
            });

            $('#frm-files').on('submit', function () {
                document.getElementById('id_check_files').value = count_data;
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

            $('#kt_datatable_search_payment').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'Pembayaran');
            });

            $('#kt_datatable_search_schoolyear').on('change', function () {
                datatable.search($(this).val().toLowerCase(), 'TA');
            });

            $('#kt_datatable_search_grade', '#kt_datatable_search_program', '#kt_datatable_search_gender', '#kt_datatable_search_payment', '#kt_datatable_search_schoolyear').selectpicker();

        };

        return {
            // Public functions
            init: function () {
                // init dmeo
                localSelectorDemo();
            },
        };
    }();

    jQuery(document).ready(function () {
        KTDatatableHtmlTableDemo.init();
    });

    /******/ })()
        ;
//# sourceMappingURL=html-table.js.map