var KTDatatablesSearchOptionsAdvancedSearch = function () {

	$.fn.dataTable.Api.register('column().title()', function () {
		return $(this.header()).text().trim();
	});

	var initTable1 = function () {
		var months = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
			"Juli", "Agustus", "September", "Oktober", "November", "Desember"];
		// begin first table
		var table = $('#kt_datatable_income_du').DataTable({
			responsive: true,
			// Pagination settings
			dom: `<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
			// read more: https://datatables.net/examples/basic_init/dom.html

			lengthMenu: [
				[10, 25, 50, -1],
				[10, 25, 50, 'All'],
			],
			pageLength: 10,
			ordering: false,
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

				var column_da = 7;
				var api_da = this.api(), data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return typeof i === 'string' ? i.replace(/[\$,.]/g, '') * 1 : typeof i === 'number' ? i : 0;
				};

				// Total over this page
				var pageTotal_da = api_da.column(column_da, { page: 'current' }).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);

				// Update footer
				$(api_da.column(column_da).footer()).html('Rp.' + KTUtil.numberString(pageTotal_da.toFixed(0)));
			},
			searchDelay: 500,
			scrollY: '90vh',
			scrollX: true,
			scrollCollapse: true,
			processing: true,
			serverSide: true,
			checkbox: true,
			ajax: {
				url: HOST_URL + 'finance/income/income/get_data_income_du',
				type: 'POST',
				data: {
					// parameters for custom backend script demo
					columnsDef: [
						'id_tagihan_pembayaran_du', 'id_invoice', 'tanggal_invoice', 'nama_lengkap', 'nomor_pembayaran_du', 'informasi', 'informasi',
						'nominal_tagihan', 'status_pembayaran', 'tahun_ajaran', 'semester', 'bulan_invoice', 'tanggal_transaksi', 'nis', 'id_encrypt', 'status_pembayaran'],
				},
			},
			columns: [
				{ data: 'id_tagihan_pembayaran_du' },
				{ data: 'id_invoice' },
				{ data: 'tanggal_invoice' },
				{ data: 'nama_lengkap' },
				{ data: 'nomor_pembayaran_du' },
				{ data: 'informasi' },
				{ data: 'informasi' },
				{ data: 'nominal_tagihan' },
				{ data: 'status_pembayaran' },
				{ data: 'tahun_ajaran' },
				{ data: 'semester' },
				{ data: 'bulan_invoice' },
				{ data: 'tanggal_transaksi' },
				{ data: 'nis' },
			],
			columnDefs: [
				{
					targets: 0,
					orderable: false,
					width: '22',
					checkboxes: {
						'selectRow': false
					},
					render: function (data, type, full, meta) {
						return '<label class="checkbox checkbox-single checkbox-primary mb-0">\
						<input type="checkbox" value="' + data + '" class="dt-checkboxes checkable"/>\
						<span></span>\
					</label>';
					},
				},
				{
					targets: 1,
					render: function (data, type, full, meta) {

						if (data === '' || data === null || data === '0') {
							return 'UNKNOWN';
						} else {
							return '<span class="font-weight-bolder">' + data + '</span>';
						}
					},
				},
				{
					targets: 2,
					render: function (data, type, full, meta) {

						if (data === '' || data === null || data === '0') {
							return '00/00/0000';
						} else {
							return '<span class="font-weight-bolder text-danger">' + data + '</span>';
						}
					},
				},
				{
					targets: 3,
					render: function (data, type, full, meta) {

						if (data === '' || data === null || data === '0') {
							return 'UNKNOWN';
						} else {
							return '<span class="font-weight-bolder">' + data + '</span>';
						}
					},
				},
				{
					targets: 4,
					render: function (data, type, full, meta) {

						if (data === '' || data === null || data === '0') {
							return 'UNKNOWN';
						} else {
							return '<span class="font-weight-bolder">' + data + '</span>';
						}
					},
				},
				{
					targets: 5,
					render: function (data, type, full, meta) {
						const tingkat = data.split(" ");
						var status = {
							'KB': {
								'title': 'KB',
								'class': 'label-light-info'
							},
							'TK': {
								'title': 'TK',
								'class': 'label-light-primary'
							},
							'SD': {
								'title': 'SD',
								'class': 'label-light-success'
							},
							'SMP': {
								'title': 'SMP',
								'class': 'label-light-warning'
							},
							'SMA': {
								'title': 'SMA',
								'class': 'label-light-danger'
							},
						};
						if (data === '' || data === null || data === '0') {
							return 'UNKNOWN';
						} else {
							return '<span class="label label-lg font-weight-bold ' + status[tingkat[0]].class + ' label-inline">' + status[tingkat[0]].title + '</span>';
						}
					}
				},
				{
					targets: 6,
					render: function (data, type, full, meta) {

						if (data === '' || data === null || data === '0') {
							return 'UNKNOWN';
						} else {
							return '<span class="font-weight-bolder">' + data + '</span>';
						}
					},
				},
				{
					targets: 7,
					render: function (data, type, full, meta) {

						if (data === '' || data === null || data === '0') {
							return 'UNKNOWN';
						} else {
							return '<span class="font-weight-bolder">' + String(data).replace(/(.)(?=(\d{3})+$)/g, '$1,') + '</span>';
						}
					},
				},
				{
					targets: 8,
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

						if (data === '' || data === null || data === '0') {
							return 'UNKNOWN';
						} else {
							return '<span class="font-weight-bolder">' + data + '</span>';
						}
					},
				},
				{
					targets: 10,
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
				{
					targets: 11,
					render: function (data, type, full, meta) {

						if (data === '' || data === null || data === '0') {
							return 'Kosong';
						} else {
							return '<span class="font-weight-bolder">' + months[data] + '</span>';
						}
					},
				},
				{
					targets: 12,
					render: function (data, type, full, meta) {

						if (data === '' || data === null || data === '0') {
							return '<span class="font-weight-bolder text-info">00/00/0000</span>';
						} else {
							return '<span class="font-weight-bolder text-success">' + data + '</span>';
						}
					},
				},
				{
					targets: -1,
					title: 'Aksi',
					orderable: false,
					width: '35',
					render: function (data, type, full, meta) {

						if (data === '' || data === null || data === '0') {
							return '<span class="font-weight-bolder text-info">00/00/0000</span>';
						} else {

							if (full.status_pembayaran == 'MENUNGGU') {
								return `<div class="dropdown dropdown-inline">
									<a href="javascript:;" class="btn btn-xs  btn-clean btn-icon btn-outline-primary" data-toggle="dropdown">
										<i class="la la-cog"></i>
									</a>
									<div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">
										<ul class="nav nav-hover flex-column">
											<li class="nav-item"><a class="nav-link" href="`+ HOST_URL + `finance/income/detail_income_du/` + full.id_encrypt + `"><i class="nav-icon fas fa-eye"></i><span class="nav-text text-hover-primary font-weight-bold">Lihat Detail</span></a></li>
										</ul>
										<ul class="nav nav-hover flex-column">
											<li class="nav-item"><a class="nav-link text-warning" href="`+ HOST_URL + `finance/income/edit_income_du/` + full.id_encrypt + `"><i class="nav-icon fas fa-pen text-warning"></i><span class="nav-text text-hover-primary font-weight-bold text-warning">Edit Tagihan</span></a></li>
										</ul>
										<ul class="nav nav-hover flex-column">
											<li class="nav-item"><a class="nav-link" href="javascript:act_delete_income('`+ full.id_encrypt + `', '` + full.nama_lengkap.replace(/[^A-Za-z0-9\-]/, ' ') + `', '` + full.nis + `')"><i class="nav-icon fas fa-trash text-danger"></i><span class="nav-text text-danger font-weight-bold text-hover-primary">Hapus Tagihan</span></a></li>
										</ul>
									</div>
								</div>`;
							} else {
								return `<div class="dropdown dropdown-inline">
									<a href="javascript:;" class="btn btn-xs  btn-clean btn-icon btn-outline-primary" data-toggle="dropdown">
										<i class="la la-cog"></i>
									</a>
									<div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">
										<ul class="nav nav-hover flex-column">
											<li class="nav-item"><a class="nav-link" href="`+ HOST_URL + `finance/income/detail_income_du/` + full.id_encrypt + `"><i class="nav-icon fas fa-eye"></i><span class="nav-text text-hover-primary font-weight-bold">Lihat Detail</span></a></li>
										</ul>
									</div>
								</div>`;
							}
						}
					},
				},
			],
		});

		$('#frm-excel').on('submit', function () {
			var rows_selected = table.column(0).checkboxes.selected();
			document.getElementById('id_check_excel').value = rows_selected.join(",");
		});

		var filter = function () {
			var val = $.fn.dataTable.util.escapeRegex($(this).val());
			table.column($(this).data('col-index')).search(val ? val : '', false, false).draw();
		};

		var param = {};
		$('.datatable-input').each(function () {
			var i = $(this).data('col-index');
			if (param[i]) {
				param[i] += '|' + $(this).val();
			}
			else {
				param[i] = $(this).val();
			}
		});

		$.each(param, function (i, val) {
			// apply search params to datatable
			table.column(i).search(val ? val : '', false, false).draw();
		});

		$('#kt_search').on('click', function (e) {
			e.preventDefault();
			var params = {};
			$('.datatable-input').each(function () {
				var i = $(this).data('col-index');
				if (params[i]) {
					params[i] += '|' + $(this).val();
				}
				else {
					params[i] = $(this).val();
				}
			});
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

		$('#kt_datepicker_table').datepicker({
			todayHighlight: true,
			format: 'dd/mm/yyyy',
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


//# sourceMappingURL=advanced-search.js.map
