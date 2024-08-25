
datatable_init();

function datatable_init() {

	show_import_personal_saving();

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
		html: `Apakah anda yakin ingin <b>MENYETUJUI</b> impor data Nasabah sekarang juga?`,
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
				url: `${HOST_URL}/finance/savings/accept_import_personal_saving`,
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
									url: `${HOST_URL}/finance/savings/accept_import_personal_saving`,
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
								Swal.fire("Dibatalkan!", "Persetujuan Impor Data Nasabah telah dibatalkan.", "error");
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
		},
		allowOutsideClick: () => !Swal.isLoading()
	}).then(function (result) {
		if (!result.isConfirmed) {
			Swal.fire("Dibatalkan!", "Persetujuan Impor Data Nasabah telah dibatalkan.", "error");
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
		html: "Apakah anda yakin ingin <b>MEMBATALKAN</b> impor data Nasabah sekarang juga?",
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
				url: `${HOST_URL}/finance/savings/reject_import_personal_saving`,
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
		},
		allowOutsideClick: () => !Swal.isLoading()
	}).then(function (result) {
		if (!result.isConfirm) {
			Swal.fire("Dibatalkan!", "Pembatalan Impor Data Nasabah telah dibatalkan.", "error");
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
	$('[name="nis_siswa"]').val('');
	$('[name="old_nis"]').val('');
	$('[name="nama_siswa"]').val('');
	$('[name="old_nama_siswa"]').val('');
	$('[name="email_wali"]').val('');
	$('[name="nama_wali"]').val('');
	$('[name="tanggal_transaksi"]').val('');
	$('[name="nomor_handphone_wali"]').val('');
	$('[name="saldo_umum"]').val('');
	$('[name="saldo_qurban"]').val('');
	$('[name="saldo_wisata"]').val('');
	$('[name="level_tingkat"] option:selected').remove();
	$('[name="th_ajaran"] option:selected').remove();

	$("#status_nis").html('');
	$("#status_nama").html('');

	var id_nasabah = $(this).data("id_nasabah");
	var nis_siswa = $(this).data("nis_siswa");
	var old_nis = $(this).data("nis_siswa");
	var nama_siswa = $(this).data("nama_siswa");
	var old_nama_siswa = $(this).data("nama_siswa");
	var level_tingkat = $(this).data("level_tingkat");
	var tanggal_transaksi = $(this).data("tanggal_transaksi");
	var id_th_ajaran = $(this).data("id_th_ajaran");
	var nama_th_ajaran = $(this).data("nama_th_ajaran");
	var email = $(this).data("email");
	var nama_wali = $(this).data("nama_wali");
	var nomor_handphone = $(this).data("nomor_handphone");
	var status_nis_duplikat = $(this).data("status_nasabah");
	var status_nama_duplikat = $(this).data("status_nama_nasabah");

	var saldo_umum = $(this).data("saldo_umum");
	var saldo_qurban = $(this).data("saldo_qurban");
	var saldo_wisata = $(this).data("saldo_wisata");

	if (level_tingkat == "1") {
		nama_tingkat = "KB";
	} else if (level_tingkat == "2") {
		nama_tingkat = "TK";
	} else if (level_tingkat == "3") {
		nama_tingkat = "SD";
	} else if (level_tingkat == "4") {
		nama_tingkat = "SMP";
	} else if (level_tingkat == "6") {
		nama_tingkat = "DC";
	}

	if (status_nis_duplikat == "1") {
		var nis_duplikat = "<p class='font-weight-boldest display-4 text-danger text-center'>TERPAKAI</p>";
	} else if (status_nis_duplikat == "2") {
		var nis_duplikat = "<p class='font-weight-boldest display-4 text-success text-center'>TIDAK TERDAFTAR</p>";
	} else if (status_nis_duplikat == "3") {
		var nis_duplikat = "<p class='font-weight-boldest display-4 text-danger text-center'>DUPLIKAT</p>";
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
			url: `${HOST_URL}/finance/savings/get_name_similliar/${nama_siswa.replace(/'/g, '')}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data.status) {
					var html = "";
					for (var i = 0; i < data.data.length; i++) {

						if (data.data[i].level_tingkat == "1") {
							var nama_tingkat = "KB";
						} else if (data.data[i].level_tingkat == "2") {
							var nama_tingkat = "TK";
						} else if (data.data[i].level_tingkat == "3") {
							var nama_tingkat = "SD";
						} else if (data.data[i].level_tingkat == "4") {
							var nama_tingkat = "SMP";
						} else if (data.data[i].level_tingkat == "6") {
							var nama_tingkat = "DC";
						}

						html +=
							"<tr>" +
							"<td class='font-weight-bolder text-danger'>" +
							`${data.data[i].nis}` +
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
							`${data.data[i].nomor_handphone}` +
							"</td>" +
							"<td>" +
							`${CurrencyID(data.data[i].saldo_tabungan_umum)}` +
							"</td>" +
							"<td>" +
							`${CurrencyID(data.data[i].saldo_tabungan_qurban)}` +
							"</td>" +
							"<td>" +
							`${CurrencyID(data.data[i].saldo_tabungan_wisata)}` +
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
						+ "<th>NIS</th>"
						+ "<th>Nama</th>"
						+ "<th>Tingkat</th>"
						+ "<th>Email</th>"
						+ "<th>Nomor HP</th>"
						+ "<th>Saldo Umum</th>"
						+ "<th>Saldo Qurban</th>"
						+ "<th>Saldo Wisata</th>"
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
	$('[name="nis_siswa"]').val(nis_siswa);
	$('[name="old_nis"]').val(old_nis);
	$('[name="nama_siswa"]').val(nama_siswa.toUpperCase());
	$('[name="old_nama_siswa"]').val(old_nama_siswa.toUpperCase());
	$('[name="tanggal_transaksi"]').val(tanggal_transaksi);
	$('[name="level_tingkat"]').prepend($("<option selected></option>").attr("value", level_tingkat).text(nama_tingkat));
	$('[name="th_ajaran"]').prepend($("<option selected></option>").attr("value", id_th_ajaran).text(nama_th_ajaran));
	$('[name="email_wali"]').val(email);
	$('[name="nama_wali"]').val(nama_wali.toUpperCase())
	$('[name="nomor_handphone_wali"]').val(nomor_handphone);
	$('[name="saldo_umum"]').val(saldo_umum);
	$('[name="saldo_qurban"]').val(saldo_qurban);
	$('[name="saldo_wisata"]').val(saldo_wisata);

	$("#status_nis").html(nis_duplikat);
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


function show_import_personal_saving() {

	$.ajax({
		type: "GET",
		url: `${HOST_URL}/finance/savings/get_all_import_personal_customer`,
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
					var nama_tingkat = "KB";
				} else if (data[i].tingkat == "2") {
					var nama_tingkat = "TK";
				} else if (data[i].tingkat == "3") {
					var nama_tingkat = "SD";
				} else if (data[i].tingkat == "4") {
					var nama_tingkat = "SMP";
				} else if (data[i].tingkat == "6") {
					var nama_tingkat = "DC";
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
					data[i].id_nasabah + "' data-nis_siswa='" + data[i].nis + "' data-level_tingkat='" + data[i].tingkat + "' data-id_th_ajaran='" + data[i].tahun_ajaran + "' data-nama_th_ajaran='" + data[i].nama_tahun_ajaran +
					"' data-nama_siswa='" + data[i].nama_nasabah + "' data-tanggal_transaksi='" + data[i].tanggal_transaksi + "' data-email='" + data[i].email_nasabah + "' data-nama_wali='" + data[i].nama_wali + "' data-nomor_handphone='" + data[i].nomor_hp_wali +
					"' data-saldo_umum='" + data[i].saldo_umum + "' data-saldo_wisata='" + data[i].saldo_wisata + "' data-saldo_qurban='" + data[i].saldo_qurban + "' data-status_nasabah='" + data[i].status_nasabah + "' data-status_nama_nasabah='" + data[i].status_nama_nasabah +
					"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit Data</span></a></li>" +
					"<li class='nav-item'><a href='javascript:void(0);' class='nav-link delete_nasabah' data-id_nasabah='" +
					data[i].id_nasabah + "' data-nis_siswa='" + data[i].nis + "' data-level_tingkat='" + data[i].tingkat + "' data-id_th_ajaran='" + data[i].tahun_ajaran + "' data-nama_th_ajaran='" + data[i].nama_tahun_ajaran +
					"' data-nama_siswa='" + data[i].nama_nasabah + "' data-status_nasabah='" + data[i].status_nasabah + "' data-status_nama_nasabah='" + data[i].status_nama_nasabah + "'><i class='nav-icon la la-trash text-danger'></i><span class='nav-text text-danger font-weight-bold text-hover-primary'>Hapus</span></a></li>" +
					"</ul>" +
					"</div>" +
					"</div>";

				html +=
					"<tr>" +
					"<td>" +
					`${data[i].id_nasabah}` +
					"</td>" +
					"<td class='font-weight-bolder'>" +
					`${data[i].nis}` +
					"</td>" +
					"<td class='font-weight-bolder'>" +
					`${data[i].nama_nasabah.toUpperCase()}` +
					"</td>" +
					"<td>" +
					`${data[i].tanggal_transaksi}` +
					"</td>" +
					"<td>" +
					`${data[i].nama_tahun_ajaran}` +
					"</td>" +
					"<td class='font-weight-bolder'>" +
					`${nama_tingkat}` +
					"</td>" +
					"<td>" +
					`${data[i].nama_wali.toUpperCase()}` +
					"</td>" +
					'<td class="">' +
					`${data[i].nomor_hp_wali}` +
					"</td>" +
					'<td class="">' +
					`${data[i].email_nasabah}` +
					"</td>" +
					"<td>" +
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
	var nis = $(this).data("nis_siswa");
	var nama_siswa = $(this).data("nama_siswa");

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
		html: "Apakah anda yakin ingin menghapus Data Import Tabungan Personal atas nama <b>'" +
			nama_siswa.toUpperCase() + "' (" + nis + ")</b> ? <br></br> <div id='recaptcha_delete'></div>",
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
				url: `${HOST_URL}/finance/savings/delete_import_personal_saving`,
				data: {
					id_nasabah: id_nasabah,
					nis: nis,
					nama_siswa: nama_siswa,
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
			Swal.fire("Dibatalkan!", "Penghapusan Data Import Tabungan Persoanal atas nama <b>'" + nama_siswa.toUpperCase() + "'</b> (" + nis_siswa + ") batal dihapus.", "error");
			return false;
		}
	});
	return false;
});



