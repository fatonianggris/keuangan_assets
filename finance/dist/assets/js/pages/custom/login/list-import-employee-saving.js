
datatable_init();

function datatable_init() {

	show_import_employee_saving();

	var table = $("#table_transcation").DataTable({
		responsive: true,
		dom: `<'row'<'col-sm-12'tr>>
		<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
		lengthMenu: [[-1], ["All"]],
		pageLength: -1,
		searchDelay: 500,
		scrollY: '60vh',
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
		footerCallback: function (row, data, start, end, display) {

			var column_saldo_um = 9;
			var column_saldo_qr = 10;
			var column_saldo_ws = 11;
			var api = this.api(),
				data;

			// Remove the formatting to get integer data for summation
			var intVal = function (i) {
				return typeof i === 'string' ? i.replace(/[\$,.]/g, '') * 1 : typeof i ===
					'number' ? i : 0;
			};
			// Total over this page

			var pageTotal_sal_um = api.column(column_saldo_um, {
				page: 'current'
			}).data().reduce(function (a, b) {
				return intVal(a) + intVal(b);
			}, 0);

			var pageTotal_sal_qr = api.column(column_saldo_qr, {
				page: 'current'
			}).data().reduce(function (a, b) {
				return intVal(a) + intVal(b);
			}, 0);

			var pageTotal_sal_ws = api.column(column_saldo_ws, {
				page: 'current'
			}).data().reduce(function (a, b) {
				return intVal(a) + intVal(b);
			}, 0);
			// Update footer

			$(api.column(column_saldo_um).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_sal_um
				.toFixed(0)));

			$(api.column(column_saldo_qr).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_sal_qr
				.toFixed(0)));

			$(api.column(column_saldo_ws).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_sal_ws
				.toFixed(0)));

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
			}
		]
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

}

$('#btn_accept_import').on('click', function (e) {
	e.preventDefault();
	var rows_selected = $("#table_transcation").DataTable().column(0).checkboxes.selected();

	var csrfName = $('.txt_csrfname').attr('name');
	var csrfHash = $('.txt_csrfname').val(); // CSRF hash

	Swal.fire({
		title: "Peringatan!",
		html: `Apakah anda yakin ingin <b>MENYETUJUI</b> impor data Nasabah Pegawai sekarang juga?`,
		icon: "warning",
		input: 'password',
		inputLabel: 'Password Anda',
		inputPlaceholder: 'Masukkan password Anda',
		inputAttributes: {
			'aria-label': 'Masukkan password Anda'
		},
		inputValidator: (value) => {
			if (!value) {
				return 'Password Anda diperlukan!'
			}
		},
		showCancelButton: true,
		confirmButtonColor: "#1BC5BD",
		confirmButtonText: "Ya, Setuju!",
		cancelButtonText: "Tidak, Nanti saja!",
		showLoaderOnConfirm: true,
		closeOnConfirm: false,
		closeOnCancel: true,
		preConfirm: (text) => {
			return $.ajax({
				type: "post",
				url: `${HOST_URL}finance/savings/accept_import_employee_saving`,
				data: {
					password: text,
					data_check: rows_selected.join(","),
					status_similiar: false,
					[csrfName]: csrfHash
				},
				dataType: 'JSON',
				success: function (data) {

					if (data.status == true && data.confirm == true) {
						Swal.fire({
							html: data.messages,
							icon: "warning",
							showCancelButton: true,
							confirmButtonColor: "#1BC5BD",
							confirmButtonText: "Ya, Lanjutkan!",
							cancelButtonText: "Tidak, Revisi!",
							showLoaderOnConfirm: true,
							closeOnConfirm: false,
							closeOnCancel: true,
						}).then(function (result) {

							if (result.isConfirmed) {

								$.ajax({
									type: "post",
									url: `${HOST_URL}finance/savings/accept_import_personal_saving`,
									data: {
										password: text,
										data_check: rows_selected.join(","),
										status_similiar: true,
										[csrfName]: csrfHash
									},
									dataType: 'JSON',
									success: function (data) {

										$('.txt_csrfname').val(data.token);

										if (data.status == true) {
											Swal.fire({
												html: data.messages,
												icon: "success",
												buttonsStyling: false,
												confirmButtonText: "Oke!",
												customClass: {
													confirmButton: "btn font-weight-bold btn-success"
												}
											}).then(function () {
												setTimeout(function () {
													window.location.replace(`${HOST_URL}/finance/savings/list_personal_saving`);
												}, 500);
											});

										} else {
											Swal.fire({
												html: data.messages,
												icon: "error",
												buttonsStyling: false,
												confirmButtonText: "Oke!",
												customClass: {
													confirmButton: "btn font-weight-bold btn-danger"
												}
											}).then(function () {
												KTUtil.scrollTop();
											});
										}
									},
									error: function (result) {
										// console.log(result);
										Swal.fire("Opsss!", "Koneksi Internet Bermasalah.", "error");
									}
								});
							} else {
								Swal.fire("Dibatalkan!", "Persetujuan Impor Data Nasabah Pegawai telah dibatalkan.", "error");
							}
						});
						return false;
					} else if (data.status == true && data.confirm == false) {
						Swal.fire({
							html: data.messages,
							icon: "success",
							buttonsStyling: false,
							confirmButtonText: "Oke!",
							customClass: {
								confirmButton: "btn font-weight-bold btn-success"
							}
						}).then(function () {
							setTimeout(function () {
								window.location.replace(`${HOST_URL}/finance/savings/list_employee_saving`);
							}, 500);
						});

					} else {
						Swal.fire({
							html: data.messages,
							icon: "error",
							buttonsStyling: false,
							confirmButtonText: "Oke!",
							customClass: {
								confirmButton: "btn font-weight-bold btn-danger"
							}
						}).then(function () {
							KTUtil.scrollTop();
						});
					}
				},
				error: function (result) {
					// console.log(result);
					Swal.fire("Opsss!", "Koneksi Internet Bermasalah.", "error");
				}
			});
		},
		allowOutsideClick: () => !Swal.isLoading()
	}).then(function (result) {
		if (!result.isConfirmed) {
			Swal.fire("Dibatalkan!", "Persetujuan Impor Data Nasabah Pegawai telah dibatalkan.", "error");
		}
	});
	return false;
});

$('#btn_reject_import').on('click', function (e) {
	e.preventDefault();
	var csrfName = $('.txt_csrfname').attr('name');
	var csrfHash = $('.txt_csrfname').val(); // CSRF hash

	Swal.fire({
		title: "Peringatan!",
		html: "Apakah anda yakin ingin <b>MEMBATALKAN</b> impor data Nasabah Pegawai sekarang juga?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Ya, Batalkan!",
		cancelButtonText: "Tidak, Nanti saja!",
		showLoaderOnConfirm: true,
		closeOnConfirm: false,
		closeOnCancel: true,
		preConfirm: (text) => {
			return $.ajax({
				type: "post",
				url: `${HOST_URL}/finance/savings/reject_import_employee_saving`,
				data: {
					[csrfName]: csrfHash
				},
				dataType: 'JSON',
				success: function (data) {
					if (data.status) {
						Swal.fire({
							html: data.messages,
							icon: "warning",
							buttonsStyling: false,
							confirmButtonText: "Oke!",
							customClass: {
								confirmButton: "btn font-weight-bold btn-warning"
							}
						}).then(function () {
							setTimeout(function () {
								window.location.replace(`${HOST_URL}/finance/savings/list_employee_saving`);
							}, 500);
						});
					} else {
						Swal.fire({
							html: data.messages,
							icon: "error",
							buttonsStyling: false,
							confirmButtonText: "Oke!",
							customClass: {
								confirmButton: "btn font-weight-bold btn-danger"
							}
						}).then(function () {
							KTUtil.scrollTop();
						});
					}
				},
				error: function (result) {
					// console.log(result);
					Swal.fire("Opsss!", "Koneksi Internet Bermasalah.", "error");
				}
			});
		},
		allowOutsideClick: () => !Swal.isLoading()
	}).then(function (result) {
		if (!result.isConfirm) {
			Swal.fire("Dibatalkan!", "Pembatalan Impor Data Nasabah Pegawai telah dibatalkan.", "error");
		}
	});
	return false;
});

$('#kt_datepicker_transaction').datepicker({
	todayHighlight: true,
	format: "dd/mm/yyyy",
	orientation: "bottom left",
	templates: {
		leftArrow: '<i class="la la-angle-left"></i>',
		rightArrow: '<i class="la la-angle-right"></i>',
	},
});

$("#tb_transaksi").on("click", ".edit_nasabah", function () {

	$("#modal_ps").html("");

	$('[name="id_nasabah"]').val('');
	$('[name="nip_pegawai"]').val('');
	$('[name="old_nip"]').val('');
	$('[name="nama_pegawai"]').val('');
	$('[name="old_nama_pegawai"]').val('');
	$('[name="email_nasabah"]').val('');
	$('[name="tanggal_transaksi"]').val('');
	$('[name="nomor_handphone_pegawai"]').val('');
	$('[name="saldo_umum"]').val('');
	$('[name="saldo_qurban"]').val('');
	$('[name="saldo_wisata"]').val('');

	$("#status_nip").html('');
	$("#status_nama").html('');

	var id_nasabah = $(this).data("id_nasabah") || "";
	var nip_pegawai = $(this).data("nip_pegawai") || "";
	var old_nip = $(this).data("nip_pegawai") || "";
	var nama_pegawai = $(this).data("nama_pegawai") || "";
	var old_nama_pegawai = $(this).data("nama_pegawai") || "";
	var level_tingkat = $(this).data("level_tingkat") || "";
	var tanggal_transaksi = $(this).data("tanggal_transaksi") || "";
	var id_th_ajaran = $(this).data("id_th_ajaran") || "";
	var nama_th_ajaran = $(this).data("nama_th_ajaran") || "";
	var email = $(this).data("email") || "";
	var status_pegawai = $(this).data("status_pegawai") || "";
	var jenis_kelamin = $(this).data("jenis_kelamin") || "";
	var nomor_handphone = $(this).data("nomor_handphone") || "";
	var status_nip_duplikat = $(this).data("status_nasabah") || "";
	var status_nama_duplikat = $(this).data("status_nama_nasabah") || "";

	var saldo_umum = $(this).data("saldo_umum") || "";
	var saldo_qurban = $(this).data("saldo_qurban") || "";
	var saldo_wisata = $(this).data("saldo_wisata") || "";

	if (status_nip_duplikat == "1") {
		var nip_duplikat = "<p class='font-weight-boldest display-4 text-danger text-center'>TERPAKAI</p>";
	} else if (status_nip_duplikat == "2") {
		var nip_duplikat = "<p class='font-weight-boldest display-4 text-success text-center'>TIDAK TERDAFTAR</p>";
	} else if (status_nip_duplikat == "3") {
		var nip_duplikat = "<p class='font-weight-boldest display-4 text-danger text-center'>DUPLIKAT</p>";
	}

	if (status_nama_duplikat == "1") {
		var nama_duplikat = "<p class='font-weight-boldest display-4 text-warning text-center'>MIRIP</p>";
	} else if (status_nama_duplikat == "2") {
		var nama_duplikat = "<p class='font-weight-boldest display-4 text-success text-center'>TIDAK TERDAFTAR</p>";
	} else if (status_nama_duplikat == "3") {
		var nama_duplikat = "<p class='font-weight-boldest display-4 text-danger text-center'>DUPLIKAT</p>";
	} else if (status_nama_duplikat == "4") {
		var nama_duplikat = "<p class='font-weight-boldest display-4 text-danger text-center'>TERPAKAI</p>";
	}

	if (status_nama_duplikat == '1') {
		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_name_similliar/${nama_pegawai.replace(/'/g, '')}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data.status) {
					var html = "";
					for (var i = 0; i < data.data.length; i++) {

						if (data.data[i].level_tingkat == "1") {
							var nama_tingkat = "DC/KB/TK";
						} else if (data.data[i].level_tingkat == "3") {
							var nama_tingkat = "SD";
						} else if (data.data[i].level_tingkat == "4") {
							var nama_tingkat = "SMP";
						} else if (data.data[i].level_tingkat == "6") {
							var nama_tingkat = "UMUM";
						}

						if (data.data[i].jenis_kelamin == "1") {
							var jenis_kelamin = "L";
						} else if (data.data[i].jenis_kelamin == "2") {
							var jenis_kelamin = "P";
						}

						if (data.data[i].jenis_pegawai == "1") {
							var status_pegawai = "TETAP";
						} else if (data.data[i].jenis_pegawai == "2") {
							var status_pegawai = "TIDAK TETAP";
						} else if (data.data[i].jenis_pegawai == "3") {
							var status_pegawai = "HONORER";
						} else if (data.data[i].jenis_pegawai == "4") {
							var status_pegawai = "KELUAR";
						}

						html +=
							"<tr>" +
							"<td class='font-weight-bolder text-danger'>" +
							`${data.data[i].nip}` +
							"</td>" +
							"<td class='font-weight-bolder text-dark'>" +
							`${data.data[i].nama_lengkap.toUpperCase()}` +
							"</td>" +
							"<td class='font-weight-bolder text-dark'>" +
							`${nama_tingkat}` +
							"</td>" +
							"<td>" +
							`${data.data[i].email}` +
							"</td>" +
							"<td>" +
							`${data.data[i].nomor_hp}` +
							"</td>" +
							"<td>" +
							`${jenis_kelamin}` +
							"</td>" +
							"<td>" +
							`${status_pegawai}` +
							"</td>" +
							"<td class='font-weight-bolder text-danger'>" +
							`${data.data[i].score}%` +
							"</td>" +
							"</tr>";
					}

					$("#modal_ps").html("<div class='alert alert-danger text-center font-weight-bold' role='alert'>"
						+ `${String(data.messages)}`
						+ "</div>"
						+ "<table class='table table-separate table-hover table-light-dark table-checkable'>"
						+ "<thead>"
						+ "<tr>"
						+ "<th>NIP</th>"
						+ "<th>Nama</th>"
						+ "<th>Tingkat</th>"
						+ "<th>Email</th>"
						+ "<th>Nomor HP</th>"
						+ "<th>JK</th>"
						+ "<th>Status Peg.</th>"
						+ "<th>Score</th>"
						+ "</tr>"
						+ "</thead>"
						+ "<tbody>" +
						html
						+ "</tbody>"
						+ "<tfoot>"
						+ "<tr>"
						+ "<th></th>"
						+ "<th></th>"
						+ "<th></th>"
						+ "<th></th>"
						+ "<th></th>"
						+ "<th></th>"
						+ "<th></th>"
						+ "<th></th>"
						+ "</tr>"
						+ "</tfoot>"
						+ "</table>");
				} else {

				}
			},
		});
	}

	$('[name="id_nasabah"]').val(id_nasabah);
	$('[name="nip_pegawai"]').val(nip_pegawai);
	$('[name="old_nip"]').val(old_nip);
	$('[name="nama_pegawai"]').val(nama_pegawai.toUpperCase());
	$('[name="old_nama_pegawai"]').val(old_nama_pegawai.toUpperCase());
	$('[name="tanggal_transaksi"]').val(tanggal_transaksi);

	$('[name="jenis_kelamin"]').find('option[value="' + jenis_kelamin + '"]').prop('selected', true);
	$('[name="level_tingkat"]').find('option[value="' + level_tingkat + '"]').prop('selected', true);
	$('[name="status_pegawai"]').find('option[value="' + status_pegawai + '"]').prop('selected', true);
	$('[name="th_ajaran"]').find('option[value="' + id_th_ajaran + '"]').prop('selected', true);

	$('[name="email_nasabah"]').val(email);
	$('[name="nomor_handphone_pegawai"]').val(nomor_handphone);
	$('[name="saldo_umum"]').val(saldo_umum);
	$('[name="saldo_qurban"]').val(saldo_qurban);
	$('[name="saldo_wisata"]').val(saldo_wisata);

	$("#status_nip").html(nip_duplikat);
	$("#status_nama").html(nama_duplikat);

	$("#modalEditImportNasabah").modal("show");
});

function CurrencyID(nominal) {
	var formatter = new Intl.NumberFormat("id-ID", {
		currency: "IDR",
		minimumFractionDigits: 0,
	});
	return formatter.format(nominal);
}


function show_import_employee_saving() {

	$.ajax({
		type: "GET",
		url: `${HOST_URL}/finance/savings/get_all_import_employee_customer`,
		async: false,
		dataType: "JSON",
		success: function (data) {
			var html = "";

			for (var i = 0; i < data.length; i++) {

				if (data[i].saldo_umum != null) {
					var saldo_umum = CurrencyID(data[i].saldo_umum);
				} else if (data[i].saldo_umum == null) {
					var saldo_umum = CurrencyID(0);
				}

				if (data[i].saldo_qurban != null) {
					var saldo_qurban = CurrencyID(data[i].saldo_qurban);
				} else if (data[i].saldo_qurban == null) {
					var saldo_qurban = CurrencyID(0);
				}

				if (data[i].saldo_wisata != null) {
					var saldo_wisata = CurrencyID(data[i].saldo_wisata);
				} else if (data[i].saldo_wisata == null) {
					var saldo_wisata = CurrencyID(0);
				}

				if (data[i].tingkat == "1") {
					var nama_tingkat = "DC/KB/TK";
				} else if (data[i].tingkat == "3") {
					var nama_tingkat = "SD";
				} else if (data[i].tingkat == "4") {
					var nama_tingkat = "SMP";
				} else if (data[i].tingkat == "6") {
					var nama_tingkat = "UMUM";
				}

				if (data[i].jenis_kelamin == "1") {
					var nama_jk = "L";
				} else if (data[i].jenis_kelamin == "2") {
					var nama_jk = "P";
				}

				if (data[i].status_pegawai == "1") {
					var nama_status_pegawai = "TETAP";
					var color_status = "text-success";
				} else if (data[i].status_pegawai == "2") {
					var nama_status_pegawai = "TIDAK TETAP";
					var color_status = "text-warning";
				} else if (data[i].status_pegawai == "3") {
					var nama_status_pegawai = "HONORER";
					var color_status = "text-info";
				} else if (data[i].status_pegawai == "4") {
					var nama_status_pegawai = "KELUAR";
					var color_status = "text-danger";
				}

				if (data[i].status_nasabah == "1") {
					var status_nasabah = "TERPAKAI";
					var color = "label-light-danger";
				} else if (data[i].status_nasabah == "2") {
					var status_nasabah = "TIDAK TERDAFTAR";
					var color = "label-light-success";
				} else if (data[i].status_nasabah == "3") {
					var status_nasabah = "DUPLIKAT";
					var color = "label-light-danger";
				}

				if (data[i].status_nama_nasabah == "1") {
					var status_nama_nasabah = "MIRIP";
					var color_nama = "label-light-warning";
				} else if (data[i].status_nama_nasabah == "2") {
					var status_nama_nasabah = "TIDAK TERDAFTAR";
					var color_nama = "label-light-success";
				} else if (data[i].status_nama_nasabah == "3") {
					var status_nama_nasabah = "DUPLIKAT";
					var color_nama = "label-light-danger";
				} else if (data[i].status_nama_nasabah == "4") {
					var status_nama_nasabah = "TERPAKAI";
					var color_nama = "label-light-danger";
				}

				var option = "<div class='dropdown dropdown-inline'>" +
					"<a href='javascript:;' class='btn btn-xs  btn-clean btn-icon btn-primary' data-toggle='dropdown'>" +
					"<i class='la la-cog'></i>" +
					"</a>" +
					"<div class='dropdown-menu dropdown-menu-sm dropdown-menu-right'>" +
					"<ul class='nav nav-hover flex-column'>" +
					"<li class='nav-item'><a href='javascript:void(0);' id='edit_button' class='nav-link edit_nasabah' data-id_nasabah='" +
					data[i].id_nasabah + "' data-nip_pegawai='" + data[i].nip + "' data-level_tingkat='" + data[i].tingkat + "' data-id_th_ajaran='" + data[i].tahun_ajaran + "' data-nama_th_ajaran='" + data[i].nama_tahun_ajaran +
					"' data-nama_pegawai='" + data[i].nama_nasabah + "' data-tanggal_transaksi='" + data[i].tanggal_transaksi + "' data-email='" + data[i].email_nasabah + "' data-jenis_kelamin='" + data[i].jenis_kelamin + "' data-nomor_handphone='" + data[i].nomor_hp_pegawai +
					"' data-status_pegawai='" + data[i].status_pegawai + "' data-saldo_umum='" + data[i].saldo_umum + "' data-saldo_wisata='" + data[i].saldo_wisata + "' data-saldo_qurban='" + data[i].saldo_qurban + "' data-status_nasabah='" + data[i].status_nasabah + "' data-status_nama_nasabah='" + data[i].status_nama_nasabah +
					"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit Data</span></a></li>" +
					"<li class='nav-item'><a href='javascript:void(0);' class='nav-link delete_nasabah' data-id_nasabah='" +
					data[i].id_nasabah + "' data-nip_pegawai='" + data[i].nip + "' data-level_tingkat='" + data[i].tingkat + "' data-id_th_ajaran='" + data[i].tahun_ajaran + "' data-nama_th_ajaran='" + data[i].nama_tahun_ajaran +
					"' data-nama_pegawai='" + data[i].nama_nasabah + "' data-status_nasabah='" + data[i].status_nasabah + "' data-status_nama_nasabah='" + data[i].status_nama_nasabah + "'><i class='nav-icon la la-trash text-danger'></i><span class='nav-text text-danger font-weight-bold text-hover-primary'>Hapus</span></a></li>" +
					"</ul>" +
					"</div>" +
					"</div>";

				html +=
					"<tr>" +
					"<td>" +
					`${data[i].id_nasabah}` +
					"</td>" +
					"<td class='font-weight-bolder'>" +
					`${data[i].nip}` +
					"</td>" +
					"<td class='font-weight-bolder'>" +
					`${data[i].nama_nasabah.toUpperCase()}` +
					"</td>" +
					"<td class='font-weight-bolder'>" +
					`${nama_jk}` +
					"</td>" +
					"<td>" +
					`${data[i].nama_tahun_ajaran}` +
					"</td>" +
					"<td class='font-weight-bolder'>" +
					`${nama_tingkat}` +
					"</td>" +
					'<td class="font-weight-bolder ' + color_status + '">' +
					`${nama_status_pegawai}` +
					"</td>" +
					'<td class="">' +
					`${data[i].nomor_hp_pegawai}` +
					"</td>" +
					'<td class="">' +
					`${data[i].email_nasabah}` +
					"</td>" +
					'<td class="">' +
					`${saldo_umum}` +
					"</td>" +
					'<td class="">' +
					`${saldo_qurban}` +
					"</td>" +
					'<td class="">' +
					`${saldo_wisata}` +
					"</td>" +
					'<td class=""> <span class="label label-over ' + color + ' font-weight-bolder label-inline">' +
					`${status_nasabah}` +
					"</span> </td>" +
					'<td class=""> <span class="label label-over ' + color_nama + ' font-weight-bolder label-inline">' +
					`${status_nama_nasabah}` +
					"</span> </td>" +
					'<td class="">' +
					`${option}` +
					"</td>" +
					"</tr>";
			}
			$("#tb_transaksi").html(html);
		},
	});

}

$("#tb_transaksi").on("click", ".delete_nasabah", function () {
	var id_nasabah = $(this).data("id_nasabah");
	var nip = $(this).data("nip_pegawai");
	var nama_pegawai = $(this).data("nama_pegawai");

	var csrfName = $('.txt_csrfname').attr('name');
	var csrfHash = $('.txt_csrfname').val(); // CSRF hash

	Swal.fire({
		title: "Peringatan!",
		icon: "warning",
		input: 'password',
		inputLabel: 'Password Anda',
		inputPlaceholder: 'Masukkan password Anda',
		inputAttributes: {
			'aria-label': 'Masukkan password Anda'
		},
		inputValidator: (value) => {
			if (!value) {
				return 'Password Anda diperlukan!'
			}
		},
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Ya, hapus!",
		cancelButtonText: "Tidak, batal!",
		closeOnConfirm: false,
		closeOnCancel: true,
		html: "Apakah anda yakin ingin menghapus Data Import Tabungan Pegawai atas nama <b>'" +
			nama_pegawai.toUpperCase() + "' (" + nip + ")</b> ? <br></br> <div id='recaptcha_delete'></div>",
		didOpen: () => {
			grecaptcha.render('recaptcha_delete', {
				'sitekey': CAPTCA_KEY
			})
		},
		preConfirm: function () {
			if (grecaptcha.getResponse().length === 0) {
				Swal.showValidationMessage(`Silahkan centang reCaptcha terlebih dahulu`)
			}
		}
	}).then(function (result) {

		if (result.value) {
			$.ajax({
				type: "post",
				url: `${HOST_URL}/finance/savings/delete_import_employee_saving`,
				data: {
					id_nasabah: id_nasabah,
					nip: nip,
					nama_pegawai: nama_pegawai,
					password: result.value,
					[csrfName]: csrfHash
				},
				dataType: 'JSON',
				success: function (data) {

					$('.txt_csrfname').val(data.token);

					if (data.status == true) {
						Swal.fire({
							html: data.messages,
							icon: "success",
							buttonsStyling: false,
							confirmButtonText: "Oke!",
							customClass: {
								confirmButton: "btn font-weight-bold btn-success"
							}
						}).then(function () {
							setTimeout(function () {
								location.reload();
							}, 500);
						});

					} else {
						Swal.fire({
							html: data.messages,
							icon: "error",
							buttonsStyling: false,
							confirmButtonText: "Oke!",
							customClass: {
								confirmButton: "btn font-weight-bold btn-danger"
							}
						}).then(function () {
							KTUtil.scrollTop();
						});
					}
				},
				error: function (result) {
					console.log(result);
					Swal.fire("Opsss!", "Koneksi Internet Bermasalah.", "error");
				}
			});

			return false;
		} else {
			Swal.fire("Dibatalkan!", "Penghapusan Data Import Tabungan Pegawai atas nama <b>'" + nama_pegawai.toUpperCase() + "'</b> (" + nip + ") batal dihapus.", "error");
			return false;
		}
	});
	return false;
});



