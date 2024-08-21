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
				lengthMenu: [[-1], ["All"]],
				pageLength: -1,
				searchDelay: 500,
				scrollY: '80vh',
				scrollX: true,
				scrollCollapse: true,
				processing: true,
				headerCallback: function (row, data, start, end, display) {
					row.getElementsByTagName('th')[0].innerHTML = `
				<label class="checkbox checkbox-single">
					<input type="checkbox" value="" class="group-checkable"/>
					<span></span>
				</label>`;
				},
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
						targets: 9,
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
							return '<span class="label label-over font-weight-bolder ' + status[data].class + ' label-inline">' + status[data].title + '</span>';
						},
					},
					{
						targets: 12,
						render: function (data, type, full, meta) {
							var status = {
								1: {
									'title': 'TERDAFTAR',
									'class': 'label-light-success'
								},
								2: {
									'title': 'TIDAK TERDAFTAR',
									'class': 'label-light-warning'
								},
								3: {
									'title': 'DUPLIKAT',
									'class': 'label-light-danger'
								},
							};
							if (typeof status[data] === 'undefined') {
								return data;
							}
							return '<span class="label label-over font-weight-bolder ' + status[data].class + ' label-inline">' + status[data].title + '</span>';
						},
					},
					{
						targets: 13,
						render: function (data, type, full, meta) {
							var status = {
								1: {
									'title': 'TERDAFTAR',
									'class': 'label-light-success'
								},
								2: {
									'title': 'TIDAK TERDAFTAR',
									'class': 'label-light-warning'
								},
								3: {
									'title': 'DUPLIKAT',
									'class': 'label-light-danger'
								},
								4: {
									'title': 'MIRIP',
									'class': 'label-light-warning'
								},
							};
							if (typeof status[data] === 'undefined') {
								return data;
							}
							return '<span class="label label-over font-weight-bolder ' + status[data].class + ' label-inline">' + status[data].title + '</span>';
						},
					},
					{
						targets: 14,
						render: function (data, type, full, meta) {
							var status = {
								1: {
									'title': 'TIDAK TERDAFTAR',
									'class': 'label-light-success',
								},
								2: {
									'title': 'TERPAKAI',
									'class': 'label-light-danger',
								},
								3: {
									'title': 'DUPLIKAT',
									'class': 'label-light-danger'
								},
							};
							if (typeof status[data] === 'undefined') {
								return data;
							}
							return '<span class="label label-over font-weight-bolder ' + status[data].class + ' label-inline">' + status[data].title + '</span>';
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
			},

		};

	}();

	jQuery(document).ready(function () {
		KTDatatablesSearchOptionsAdvancedSearch.init();
	});

	/******/
})()
	;
//# sourceMappingURL=advanced-search.js.map
