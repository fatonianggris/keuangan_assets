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

			var datatable = $('#kt_datatable_structure').KTDatatable({
				data: {
					saveState: { cookie: false },
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
					field: 'No',
					title: 'No',
					width: 70,
					textAlign: 'center',
				},
				{
					field: 'Role',
					title: 'Role',
					width: 250,
					autoHide: false,
					template: function (row) {
						var status = {
							1: {
								'title': 'PEMBINA',
								'class': 'label-light-success'
							},
							2: {
								'title': 'KETUA',
								'class': 'label-light-primary'
							},
							3: {
								'title': 'PENGAWAS',
								'class': 'label-light-danger'
							},
							4: {
								'title': 'SEKERTARIS',
								'class': 'label-light-info'
							},
							5: {
								'title': 'BENDAHARA',
								'class': 'label-light-warning'
							},
							6: {
								'title': 'UNIT BIDANG',
								'class': 'label-light-default'
							},
							7: {
								'title': 'PEGAWAI',
								'class': 'label-light-default'
							},
							8: {
								'title': 'KOMITE',
								'class': 'label-light-default'
							},
							9: {
								'title': 'DU',
								'class': 'label-light-default'
							},
							10: {
								'title': 'TABUNGAN',
								'class': 'label-light-default'
							}
						};
						return '<span class="label font-weight-bold label-lg ' + status[row.Role].class + ' label-inline">' + status[row.Role].title + '</span>';
					},
				},
				{
					field: 'Nama Struktur',
					title: 'Nama Struktur',
					width: 250,
				},
				{
					field: 'Tanggal',
					title: 'Tanggal',
					textAlign: 'center',
					width: 150,
					template: function (row) {
						return '<span class="label font-weight-bold label-lg label-light-default label-inline">' + row.Tanggal + '</span>';
					}
				},
				{
					field: 'Aksi',
					title: 'Aksi',
					width: 150,
				},
				]
			});

			$('#kt_datatable_search_role').on('change', function () {
				datatable.search($(this).val().toLowerCase(), 'Role');
			});

			$('#kt_datatable_search_role').selectpicker();
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

	/******/
})()
	;
//# sourceMappingURL=html-table.js.map
