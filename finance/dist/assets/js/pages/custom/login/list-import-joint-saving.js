
datatable_init();

function datatable_init() {

	show_import_joint_saving();

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
			var column_saldo = 10;

			var api = this.api(),
				data;

			// Remove the formatting to get integer data for summation
			var intVal = function (i) {
				return typeof i === 'string' ? i.replace(/[\$,.]/g, '') * 1 : typeof i ===
					'number' ? i : 0;
			};
			// Total over this page
			var pageTotal_sal = api.column(column_saldo, {
				page: 'current'
			}).data().reduce(function (a, b) {
				return intVal(a) + intVal(b);
			}, 0);

			// Update footer
			$(api.column(column_saldo).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_sal
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
		html: `Apakah anda yakin ingin <b>MENYETUJUI</b> impor data Nasabah Tabungan Bersama sekarang juga?`,
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
				url: `${HOST_URL}finance/savings/accept_import_joint_saving`,
				data: {
					password: text,
					data_check: rows_selected.join(","),
					status_pj: false,
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
									url: `${HOST_URL}finance/savings/accept_import_joint_saving`,
									data: {
										password: text,
										data_check: rows_selected.join(","),
										status_pj: true,
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
													window.location.replace(`${HOST_URL}/finance/savings/list_joint_saving`);
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
								Swal.fire("Dibatalkan!", "Persetujuan Impor Data Nasabah Tabungan Bersama telah dibatalkan.", "error");
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
								window.location.replace(`${HOST_URL}/finance/savings/list_joint_saving`);
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
			Swal.fire("Dibatalkan!", "Persetujuan Impor Data Nasabah Tabungan Bersama telah dibatalkan.", "error");
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
		html: "Apakah anda yakin ingin <b>MEMBATALKAN</b> impor data Nasabah Tabungan Bersama sekarang juga?",
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
				url: `${HOST_URL}finance/savings/reject_import_joint_saving`,
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
								window.location.replace(`${HOST_URL}/finance/savings/list_joint_saving`);
							}, 1000);
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
			Swal.fire("Dibatalkan!", "Pembatalan Impor Data Nasabah Tabungan Bersama telah dibatalkan.", "error");
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


$('#id_siswa_penanggung_jawab').select2({
	placeholder: "Pilih Siswa Penanggung Jawab",
});

$("#id_siswa_penanggung_jawab").on("change", function () {

	var nis = $("#id_siswa_penanggung_jawab").find(":selected").val();
	$.ajax({
		type: "GET",
		url: `${HOST_URL}/finance/savings/get_student_by_nis/${nis}`,
		async: false,
		dataType: "JSON",
		success: function (data) {
			if (data['data_siswa'][0]) {
				nis = data['data_siswa'][0]['nis'];
				nama_lengkap = data['data_siswa'][0]['nama_lengkap'];
				nama_wali = data['data_siswa'][0]['nama_wali'];
				nomor_handphone = data['data_siswa'][0]['nomor_handphone'];
				email = data['data_siswa'][0]['email'];
			} else {
				nis = "";
				nama_lengkap = "";
				nama_wali = "";
				nomor_handphone = "";
				email = "";
			}

			$('[name="nama_wali"]').val(nama_wali.toUpperCase());
			$('[name="nomor_handphone_wali"]').val(nomor_handphone);
		}
	});

});

$("#tb_transaksi").on("click", ".edit_joint", function () {

	$("#status_norek").html('');

	$('[name="id_nasabah_bersama"]').val('');
	$('[name="id_siswa_penanggung_jawab"]').val('');
	$('[name="nomor_rekening_bersama"]').val('');
	$('[name="nama_lengkap"]').val('');
	$('[name="nama_tabungan_bersama"]').val('');
	$('[name="nama_th_ajaran"]').val('');
	$('[name="tanggal_transaksi"]').val('');
	$('[name="nomor_handphone_wali"]').val('');
	$('[name="nama_th_ajaran"]').val('');
	$('[name="nama_wali"]').val('');
	$('[name="saldo_bersama"]').val('');
	$('[name="id_siswa_penanggung_jawab"] option:selected').remove();
	$('[name="id_th_ajaran"] option:selected').remove();
	$('[name="id_tingkat"] option:selected').remove();

	var id_tabungan = $(this).data("id_nasabah_bersama");
	var id_pj = $(this).data("id_siswa_penanggung_jawab");
	var id_tingkat = $(this).data("id_tingkat")
	var id_th_ajaran = $(this).data("id_th_ajaran");
	var nomor_rekening = $(this).data("nomor_rekening_bersama");
	var old_nomor_rekening = $(this).data("nomor_rekening_bersama");
	var nama_siswa = $(this).data("nama_lengkap");
	var nama_tabungan = $(this).data("nama_tabungan_bersama");
	var tanggal_transaksi = $(this).data("tanggal_transaksi");
	var nama_th_ajaran = $(this).data("nama_th_ajaran");
	var nama_wali = $(this).data("nama_wali");
	var nomor_handphone = $(this).data("nomor_handphone_wali");
	var saldo_bersama = $(this).data("saldo_bersama");
	var status_norek_duplikat = $(this).data("status_nasabah_bersama");

	if (id_tingkat == "1") {
		var nama_tingkat = "KB";
	} else if (id_tingkat == "2") {
		var nama_tingkat = "TK";
	} else if (id_tingkat == "3") {
		var nama_tingkat = "SD";
	} else if (id_tingkat == "4") {
		var nama_tingkat = "SMP";
	} else if (id_tingkat == "6") {
		var nama_tingkat = "DC";
	}

	if (status_norek_duplikat == "1") {
		var norek_duplikat = "<p class='font-weight-boldest display-4 text-danger text-center'>TERPAKAI</p>";
	} else if (status_norek_duplikat == "2") {
		var norek_duplikat = "<p class='font-weight-boldest display-4 text-success text-center'>TIDAK TERDAFTAR</p>";
	} else if (status_norek_duplikat == "3") {
		var norek_duplikat = "<p class='font-weight-boldest display-4 text-danger text-center'>DUPLIKAT</p>";
	}

	$('[name="id_nasabah_bersama"]').val(id_tabungan);
	$('[name="nomor_rekening_bersama"]').val(nomor_rekening);
	$('[name="old_nomor_rekening_bersama"]').val(old_nomor_rekening);
	$('[name="nama_tabungan_bersama"]').val(nama_tabungan.toUpperCase());
	$('[name="nomor_handphone_wali"]').val(nomor_handphone);
	$('[name="tanggal_transaksi"]').val(tanggal_transaksi);
	$('[name="id_siswa_penanggung_jawab"] option:selected').remove();
	if (nama_siswa != null && nama_siswa != "") {
		var nama_lengkap = nama_siswa.toUpperCase();
		$('[name="id_siswa_penanggung_jawab"]').prepend($("<option selected></option>").attr("value", id_pj).text(`${nama_lengkap} ` + `(${id_pj})`));
	} else {
		var nama_lengkap = "TIDAK TERDAFTAR";
		$('[name="id_siswa_penanggung_jawab"]').prepend($("<option value='0' selected></option>").text(`${nama_lengkap}`));
	}
	$('[name="id_tingkat"] option:selected').remove();
	$('[name="id_tingkat"]').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));
	$('[name="id_th_ajaran"] option:selected').remove();
	$('[name="id_th_ajaran"]').prepend($("<option selected></option>").attr("value", id_th_ajaran).text(nama_th_ajaran));
	$('[name="nama_wali"]').val(nama_wali.toUpperCase());
	$('[name="saldo_bersama"]').val(saldo_bersama);

	$("#status_norek").html(norek_duplikat);

	$.ajax({
		type: "GET",
		url: `${HOST_URL}/finance/savings/savings/get_all_student`,
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function (data) {
			var i;
			for (i = 0; i < data.length; i++) {
				$('[name="id_siswa_penanggung_jawab"]').append($("<option></option>").attr("value", data[i].nis).text(`${data[i].nama_lengkap.toUpperCase()} ` + `(${data[i].nis})`));
			}
		},
	});

	$("#modalEditJoint").modal("show");
});

function CurrencyID(nominal) {
	var formatter = new Intl.NumberFormat("id-ID", {
		currency: "IDR",
		minimumFractionDigits: 0,
	});
	return formatter.format(nominal);
}

function show_import_joint_saving() {
	$.ajax({
		type: "GET",
		url: `${HOST_URL}/finance/savings/get_all_import_joint_customer`,
		async: false,
		dataType: "JSON",
		success: function (data) {
			var html = "";

			for (var i = 0; i < data.length; i++) {

				if (data[i].saldo_bersama != null) {
					var saldo = CurrencyID(data[i].saldo_bersama);
				} else if (data[i].saldo_bersama == null) {
					var saldo = CurrencyID(0);
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

				if (data[i].status_penanggung_jawab == "2") {
					var status_nama = "TIDAK TERDAFTAR";
					var color_nama = "label-light-danger";
				} else if (data[i].status_penanggung_jawab == "1") {
					var status_nama = "TERDAFTAR";
					var color_nama = "label-light-success";
				}

				if (data[i].status_nasabah_bersama == "1") {
					var status_nasabah = "TERPAKAI";
					var color = "label-light-danger";
				} else if (data[i].status_nasabah_bersama == "2") {
					var status_nasabah = "TIDAK TERDAFTAR";
					var color = "label-light-success";
				} else if (data[i].status_nasabah_bersama == "3") {
					var status_nasabah = "DUPLIKAT";
					var color = "label-light-danger";
				}

				var option = "<div class='dropdown dropdown-inline'>" +
					"<a href='javascript:;' class='btn btn-xs  btn-clean btn-icon btn-primary' data-toggle='dropdown'>" +
					"<i class='la la-cog'></i>" +
					"</a>" +
					"<div class='dropdown-menu dropdown-menu-sm dropdown-menu-right'>" +
					"<ul class='nav nav-hover flex-column'>" +
					"<li class='nav-item'><a href='javascript:void(0);' class='nav-link edit_joint' data-id_nasabah_bersama='" + data[i].id_nasabah_bersama + "' data-id_siswa_penanggung_jawab='" + data[i].id_siswa_penanggung_jawab +
					"' data-nomor_rekening_bersama='" + data[i].nomor_rekening_bersama + "' data-nama_tabungan_bersama='" + data[i].nama_tabungan_bersama + "' data-id_tingkat='" + data[i].tingkat + "' data-tanggal_transaksi='" + data[i].tanggal_transaksi +
					"' data-nomor_handphone_wali='" + data[i].nomor_hp_wali + "' data-id_th_ajaran='" + data[i].tahun_ajaran + "' data-nama_th_ajaran='" + data[i].nama_tahun_ajaran + "' data-saldo_bersama='" + data[i].saldo_bersama +
					"' data-nama_lengkap='" + data[i].nama_lengkap + "' data-nama_wali='" + data[i].nama_wali + "' data-nomor_handphone='" + data[i].nomor_hp_wali + "' data-status_nasabah_bersama='" + data[i].status_nasabah_bersama +
					"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit Nasabah</span></a></li>" +
					"<li class='nav-item'><a href='javascript:void(0);' class='nav-link delete_joint' data-id_nasabah_bersama='" + data[i].id_nasabah_bersama + "' data-nomor_rekening_bersama='" + data[i].nomor_rekening_bersama +
					"' data-nama_tabungan_bersama='" + data[i].nama_tabungan_bersama + "' data-id_tingkat='" + data[i].tingkat + "' data-id_th_ajaran='" + data[i].tahun_ajaran + "' data-nama_th_ajaran='" + data[i].nama_tahun_ajaran +
					"' data-saldo_bersama='" + data[i].saldo_bersama + "' data-status_nasabah_bersama='" + data[i].status_nasabah_bersama + "'><i class='nav-icon la la-trash text-danger'></i><span class='nav-text text-danger font-weight-bold text-hover-primary'>Hapus</span></a></li>" +
					"</ul>" +
					"</div>" +
					"</div>";

				html +=
					"<tr>" +
					"<td>" +
					`${data[i].id_nasabah_bersama}` +
					"</td>" +
					"<td class='font-weight-bolder'>" +
					`${data[i].nomor_rekening_bersama}` +
					"</td>" +
					"<td class='font-weight-bolder'>" +
					`${data[i].nama_tabungan_bersama.toUpperCase()}` +
					"</td>" +
					"<td>" +
					`${data[i].id_siswa_penanggung_jawab}` +
					"</td>" +
					'<td class=""> <span class="label label-over ' + color_nama + ' font-weight-bolder label-inline">' +
					`${status_nama}` +
					"</td>" +
					"<td class='font-weight-bolder'>" +
					`${data[i].nama_wali.toUpperCase()}` +
					"</td>" +
					"<td>" +
					`${data[i].nomor_hp_wali}` +
					"</td>" +
					"<td>" +
					`${data[i].tanggal_transaksi}` +
					"</td>" +
					'<td class="">' +
					`${data[i].nama_tahun_ajaran}` +
					"</td>" +
					'<td class="font-weight-bolder">' +
					`${nama_tingkat}` +
					"</td>" +
					'<td class="">' +
					`${saldo}` +
					"</td>" +
					'<td class=""> <span class="label label-over ' + color + ' font-weight-bolder label-inline">' +
					`${status_nasabah}` +
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

$("#tb_transaksi").on("click", ".delete_joint", function () {
	var id_nasabah = $(this).data("id_nasabah_bersama");
	var norek = $(this).data("nomor_rekening_bersama");
	var nama_tabungan = $(this).data("nama_tabungan_bersama");

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
		html: "Apakah anda yakin ingin menghapus Data Import Tabungan Bersama atas nama <b>'" +
			nama_tabungan.toUpperCase() + "' (" + norek + ")</b> ? <br></br> <div id='recaptcha_delete'></div>",
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
				url: `${HOST_URL}/finance/savings/delete_import_joint_saving`,
				data: {
					id_nasabah: id_nasabah,
					nomor_rekening: norek,
					nama_tabungan: nama_tabungan,
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
			Swal.fire("Dibatalkan!", "Penghapusan Data Import Tabungan Bersama atas nama <b>'" + nama_tabungan.toUpperCase() + "'</b> (" + norek + ") batal dihapus.", "error");
			return false;
		}
	});
	return false;
});


