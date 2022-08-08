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
            var table = $('#kt_datatable').DataTable({
                responsive: true,
                // Pagination settings
                dom: `<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
                // read more: https://datatables.net/examples/basic_init/dom.html
                language: {
                    'lengthMenu': 'Display _MENU_',
                },
                headerCallback: function (row, data, start, end, display) {
                    row.getElementsByTagName('th')[0].innerHTML = `
                    <label class="checkbox checkbox-single">
                        <input type="checkbox" value="" class="group-checkable"/>
                        <span></span>
                    </label>`;
                },
                footerCallback: function (row, data, start, end, display) {

                    var column_ds = 9;
                    var column_da = 4;
                    var column_dt = 8;
                    var column_dac = 7;
                    var column_de = 6;
                    var api_ds = this.api(), data;
                    var api_da = this.api(), data;
                    var api_dt = this.api(), data;
                    var api_dac = this.api(), data;
                    var api_de = this.api(), data;

                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ? i.replace(/[\$,.]/g, '') * 1 : typeof i === 'number' ? i : 0;
                    };

                    // Total over this page
                    var pageTotal_ds = api_ds.column(column_ds, {page: 'current'}).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
                    var pageTotal_da = api_da.column(column_da, {page: 'current'}).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
                    var pageTotal_dt = api_dt.column(column_dt, {page: 'current'}).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
                    var pageTotal_dac = api_dac.column(column_dac, {page: 'current'}).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
                    var pageTotal_de = api_de.column(column_de, {page: 'current'}).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    // Update footer
                    $(api_ds.column(column_ds).footer()).html('Rp.' + KTUtil.numberString(pageTotal_ds.toFixed(0)));
                    $(api_da.column(column_da).footer()).html('Rp.' + KTUtil.numberString(pageTotal_da.toFixed(0)));
                    $(api_dt.column(column_dt).footer()).html('Rp.' + KTUtil.numberString(pageTotal_dt.toFixed(0)));
                    $(api_dac.column(column_dac).footer()).html('Rp.' + KTUtil.numberString(pageTotal_dac.toFixed(0)));
                    $(api_dac.column(column_de).footer()).html('Rp.' + KTUtil.numberString(pageTotal_de.toFixed(0)));
                },
                lengthMenu: [[-1], ["All"]],
                pageLength: -1,
                searchDelay: 500,
                scrollY: '60vh',
                scrollX: true,
                scrollCollapse: true,
                processing: true,
                columnDefs: [
                    {
                        targets: 0,
                        orderable: false,
                        width: '22',
                        checkboxes: {
                            'selectRow': false
                        },
                        render: function (data, type, full, meta) {
                            return `
                        <label class="checkbox checkbox-single checkbox-primary mb-0">
                            <input type="checkbox" value="" class="dt-checkboxes checkable"/>
                            <span></span>
                        </label>`;
                        },
                    },
                    {
                        targets: -1,
                        title: 'Aksi',
                        orderable: false,
                    },
                    {
                        targets: 5,
                        render: function (data, type, full, meta) {
                            var status = {
                                0: {'title': 'DIPROSES', 'class': 'label-light-warning'},
                                1: {'title': 'DIPROSES*', 'class': ' label-light-warning'},
                                2: {'title': 'DITERIMA', 'class': ' label-light-success'},
                                3: {'title': 'DITOLAK', 'class': ' label-light-danger'},
                            };
                            if (typeof status[data] === 'undefined') {
                                return data;
                            }
                            return '<span class="label label-lg font-weight-bold ' + status[data].class + ' label-inline">' + status[data].title + '</span>';
                        },
                    },
                    {
                        targets: 10,
                        render: function (data, type, full, meta) {
                            var status = {
                                0: {'title': 'MENUNGGU', 'class': 'label-light-default'},
                                1: {'title': 'DIPROSES', 'class': ' label-light-warning'},
                                2: {'title': 'DITERIMA', 'class': ' label-light-success'},
                                3: {'title': 'DITOLAK', 'class': ' label-light-danger'},
                            };
                            if (typeof status[data] === 'undefined') {
                                return data;
                            }
                            return '<span class="label label-lg font-weight-bold ' + status[data].class + ' label-inline">' + status[data].title + '</span>';
                        },
                    },
                    {
                        targets: 12,
                        visible: false,
                        searchable: true
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

            $('#kt_datepicker_prop').datepicker({
                todayHighlight: true,
                orientation: "bottom left",
                templates: {
                    leftArrow: '<i class="la la-angle-left"></i>',
                    rightArrow: '<i class="la la-angle-right"></i>',
                },
            });

            $('#kt_datepicker_lpj').datepicker({
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
            },

        };

    }();

    jQuery(document).ready(function () {
        KTDatatablesSearchOptionsAdvancedSearch.init();
    });

    /******/ })()
        ;
//# sourceMappingURL=advanced-search.js.map