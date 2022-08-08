/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    var __webpack_exports__ = {};
    /*!*******************************************************************************!*\
     !*** ../demo1/src/js/pages/crud/datatables/search-options/advanced-search.js ***!
     \*******************************************************************************/

    var KTDatatablesSearchOptionsAdvancedSearch = function () {

        $.fn.dataTable.Api.register('column().title()', function () {
            return $(this.header()).text().trim();
        });

        var initTable1 = function () {
            // begin first table
            var table = $('#kt_datatable_income_du_invoice_success').DataTable({
                responsive: true,
                // Pagination settings
                dom: `<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
                // read more: https://datatables.net/examples/basic_init/dom.html
                language: {
                    'lengthMenu': 'Display _MENU_',
                },

                footerCallback: function (row, data, start, end, display) {

                    var column_da = 6;
                    var api_da = this.api(), data;

                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ? i.replace(/[\$,.]/g, '') * 1 : typeof i === 'number' ? i : 0;
                    };

                    // Total over this page
                    var pageTotal_da = api_da.column(column_da, {page: 'current'}).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    // Update footer

                    $(api_da.column(column_da).footer()).html('Rp.' + KTUtil.numberString(pageTotal_da.toFixed(0)));
                },
                lengthMenu: [[-1], ["All"]],
                pageLength: -1,
                searchDelay: 500,
                scrollY: '80vh',
                scrollX: true,
                scrollCollapse: true,
                processing: true,
                columnDefs: [
                    {
                        targets: 7,
                        render: function (data, type, full, meta) {
                            var status = {
                                MENUNGGU: {
                                    'title': 'MENUNGGU',
                                    'class': 'label-light-info'
                                },
                                PROSES: {
                                    'title': 'PROSES',
                                    'class': 'label-light-warning'
                                },
                                SUKSES: {
                                    'title': 'SUKSES',
                                    'class': 'label-light-success'
                                },
                                GAGAL: {
                                    'title': 'GAGAL',
                                    'class': 'label-light-danger'
                                },
                            };
                            if (typeof status[data] === 'undefined') {
                                return data;
                            }
                            return '<span class="label label-lg font-weight-bold ' + status[data].class + ' label-inline">' + status[data].title + '</span>';
                        },
                    },
                    {
                        targets: 9,
                        render: function (data, type, full, meta) {
                            var status = {
                                ganjil: {
                                    'title': 'GANJIL',
                                    'class': 'label-light-warning'
                                },
                                genap: {
                                    'title': 'GENAP',
                                    'class': 'label-light-success'
                                },
                            };
                            if (typeof status[data] === 'undefined') {
                                return data;
                            }
                            return '<span class="label label-lg font-weight-bold ' + status[data].class + ' label-inline">' + status[data].title + '</span>';
                        },
                    },
                ],
            });

            $('#kt_search').on('click', function (e) {
                e.preventDefault();
                var params = {};
                $('.datatable-input').each(function () {
                    var i = $(this).data('col-index');
                    if (params[i]) {
                        params[i] += '|' + $(this).val();
                    } else {
                        params[i] = $(this).val();
                    }

                });
                console.log(params);
                $.each(params, function (i, val) {
                    // apply search params to datatable
                    table.column(i).search(val ? val : '', false, false);
                });
                table.table().draw();
            });


            $('#kt_reset').on('click', function (e) {
                e.preventDefault();
                $('.datatable-input').each(function () {
                    $(this).val('');
                    table.column($(this).data('col-index')).search('', false, false);
                });
                table.table().draw();
            });

            $('#kt_datepicker_post').datepicker({
                todayHighlight: true,
                orientation: "bottom left",
                templates: {
                    leftArrow: '<i class="la la-angle-left"></i>',
                    rightArrow: '<i class="la la-angle-right"></i>',
                },
            });

            $('#kt_datepicker_acc').datepicker({
                todayHighlight: true,
                orientation: "bottom left",
                templates: {
                    leftArrow: '<i class="la la-angle-left"></i>',
                    rightArrow: '<i class="la la-angle-right"></i>',
                },
            });

        };


        var initTable2 = function () {
            // begin first table
            var table = $('#kt_datatable_income_du_invoice_warning').DataTable({
                responsive: true,
                // Pagination settings
                dom: `<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
                // read more: https://datatables.net/examples/basic_init/dom.html
                language: {
                    'lengthMenu': 'Display _MENU_',
                },

                footerCallback: function (row, data, start, end, display) {

                    var column_da = 6;
                    var api_da = this.api(), data;

                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ? i.replace(/[\$,.]/g, '') * 1 : typeof i === 'number' ? i : 0;
                    };

                    // Total over this page
                    var pageTotal_da = api_da.column(column_da, {page: 'current'}).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    // Update footer

                    $(api_da.column(column_da).footer()).html('Rp.' + KTUtil.numberString(pageTotal_da.toFixed(0)));
                },
                lengthMenu: [[-1], ["All"]],
                pageLength: -1,
                order: [[1, 'desc']],
                searchDelay: 500,
                scrollY: '80vh',
                scrollX: true,
                scrollCollapse: true,
                processing: true,
                columnDefs: [
                    {
                        targets: 7,
                        render: function (data, type, full, meta) {
                            var status = {
                                MENUNGGU: {
                                    'title': 'MENUNGGU',
                                    'class': 'label-light-info'
                                },
                                PROSES: {
                                    'title': 'PROSES',
                                    'class': 'label-light-warning'
                                },
                                SUKSES: {
                                    'title': 'SUKSES',
                                    'class': 'label-light-success'
                                },
                                GAGAL: {
                                    'title': 'GAGAL',
                                    'class': 'label-light-danger'
                                },
                            };
                            if (typeof status[data] === 'undefined') {
                                return data;
                            }
                            return '<span class="label label-lg font-weight-bold ' + status[data].class + ' label-inline">' + status[data].title + '</span>';
                        },
                    },
                    {
                        targets: 9,
                        render: function (data, type, full, meta) {
                            var status = {
                                ganjil: {
                                    'title': 'GANJIL',
                                    'class': 'label-light-warning'
                                },
                                genap: {
                                    'title': 'GENAP',
                                    'class': 'label-light-success'
                                },
                            };
                            if (typeof status[data] === 'undefined') {
                                return data;
                            }
                            return '<span class="label label-lg font-weight-bold ' + status[data].class + ' label-inline">' + status[data].title + '</span>';
                        },
                    },
                ],
            });

            $('#kt_search').on('click', function (e) {
                e.preventDefault();
                var params = {};
                $('.datatable-input').each(function () {
                    var i = $(this).data('col-index');
                    if (params[i]) {
                        params[i] += '|' + $(this).val();
                    } else {
                        params[i] = $(this).val();
                    }

                });
                console.log(params);
                $.each(params, function (i, val) {
                    // apply search params to datatable
                    table.column(i).search(val ? val : '', false, false);
                });
                table.table().draw();
            });


            $('#kt_reset').on('click', function (e) {
                e.preventDefault();
                $('.datatable-input').each(function () {
                    $(this).val('');
                    table.column($(this).data('col-index')).search('', false, false);
                });
                table.table().draw();
            });

            $('#kt_datepicker_post').datepicker({
                todayHighlight: true,
                orientation: "bottom left",
                templates: {
                    leftArrow: '<i class="la la-angle-left"></i>',
                    rightArrow: '<i class="la la-angle-right"></i>',
                },
            });

            $('#kt_datepicker_acc').datepicker({
                todayHighlight: true,
                orientation: "bottom left",
                templates: {
                    leftArrow: '<i class="la la-angle-left"></i>',
                    rightArrow: '<i class="la la-angle-right"></i>',
                },
            });

        };


        var initTable3 = function () {
            // begin first table
            var table = $('#kt_datatable_income_du_invoice_danger').DataTable({
                responsive: true,
                // Pagination settings
                dom: `<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
                // read more: https://datatables.net/examples/basic_init/dom.html
                language: {
                    'lengthMenu': 'Display _MENU_',
                },

                footerCallback: function (row, data, start, end, display) {

                    var column_da = 6;
                    var api_da = this.api(), data;

                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ? i.replace(/[\$,.]/g, '') * 1 : typeof i === 'number' ? i : 0;
                    };

                    // Total over this page
                    var pageTotal_da = api_da.column(column_da, {page: 'current'}).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    // Update footer

                    $(api_da.column(column_da).footer()).html('Rp.' + KTUtil.numberString(pageTotal_da.toFixed(0)));
                },
                lengthMenu: [[-1], ["All"]],
                pageLength: -1,
                order: [[1, 'desc']],
                searchDelay: 500,
                scrollY: '80vh',
                scrollX: true,
                scrollCollapse: true,
                processing: true,
                columnDefs: [
                    {
                        targets: 7,
                        render: function (data, type, full, meta) {
                            var status = {
                                MENUNGGU: {
                                    'title': 'MENUNGGU',
                                    'class': 'label-light-info'
                                },
                                PROSES: {
                                    'title': 'PROSES',
                                    'class': 'label-light-warning'
                                },
                                SUKSES: {
                                    'title': 'SUKSES',
                                    'class': 'label-light-success'
                                },
                                GAGAL: {
                                    'title': 'GAGAL',
                                    'class': 'label-light-danger'
                                },
                            };
                            if (typeof status[data] === 'undefined') {
                                return data;
                            }
                            return '<span class="label label-lg font-weight-bold ' + status[data].class + ' label-inline">' + status[data].title + '</span>';
                        },
                    },
                    {
                        targets: 9,
                        render: function (data, type, full, meta) {
                            var status = {
                                ganjil: {
                                    'title': 'GANJIL',
                                    'class': 'label-light-warning'
                                },
                                genap: {
                                    'title': 'GENAP',
                                    'class': 'label-light-success'
                                },
                            };
                            if (typeof status[data] === 'undefined') {
                                return data;
                            }
                            return '<span class="label label-lg font-weight-bold ' + status[data].class + ' label-inline">' + status[data].title + '</span>';
                        },
                    },
                ],
            });

            $('#kt_search').on('click', function (e) {
                e.preventDefault();
                var params = {};
                $('.datatable-input').each(function () {
                    var i = $(this).data('col-index');
                    if (params[i]) {
                        params[i] += '|' + $(this).val();
                    } else {
                        params[i] = $(this).val();
                    }

                });
                console.log(params);
                $.each(params, function (i, val) {
                    // apply search params to datatable
                    table.column(i).search(val ? val : '', false, false);
                });
                table.table().draw();
            });


            $('#kt_reset').on('click', function (e) {
                e.preventDefault();
                $('.datatable-input').each(function () {
                    $(this).val('');
                    table.column($(this).data('col-index')).search('', false, false);
                });
                table.table().draw();
            });

            $('#kt_datepicker_post').datepicker({
                todayHighlight: true,
                orientation: "bottom left",
                templates: {
                    leftArrow: '<i class="la la-angle-left"></i>',
                    rightArrow: '<i class="la la-angle-right"></i>',
                },
            });

            $('#kt_datepicker_acc').datepicker({
                todayHighlight: true,
                orientation: "bottom left",
                templates: {
                    leftArrow: '<i class="la la-angle-left"></i>',
                    rightArrow: '<i class="la la-angle-right"></i>',
                },
            });

        };


        return {

            //main function to initiate the module
            init: function () {
                initTable1();
                initTable2();
                initTable3();
            },

        };

    }();

    jQuery(document).ready(function () {
        KTDatatablesSearchOptionsAdvancedSearch.init();
    });

    /******/ })()
        ;
//# sourceMappingURL=advanced-search.js.map