$(document).ready(function () {

	if (id_role == 7) {
		var start = moment();
	} else {
		var start = moment().subtract(29, 'days');
	}
	var end = moment();
	var lstart
	var lend;
	var date_range = '';

	function call_today(start, end) {
		$('#kt_daterangepicker_6 .form-control').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
		$("#date_range_excel").val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
		date_range = start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY');

		lstart = $('#kt_daterangepicker_6').data('daterangepicker').startDate.format('YYYY-MM-DD');
		lend = $('#kt_daterangepicker_6').data('daterangepicker').endDate.format('YYYY-MM-DD');
	}

	if (id_role == 7) {
		$('#kt_daterangepicker_6').daterangepicker({
			buttonClasses: ' btn',
			applyClass: 'btn-primary',
			cancelClass: 'btn-secondary',
			startDate: start,
			endDate: end,
			showCustomRangeLabel: false,
			ranges: {
				'Today': [moment(), moment()],
			}
		}, call_today);
	} else {
		$('#kt_daterangepicker_6').daterangepicker({
			buttonClasses: ' btn',
			applyClass: 'btn-primary',
			cancelClass: 'btn-secondary',
			startDate: start,
			endDate: end,
			ranges: {
				'Today': [moment(), moment()],
				'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				'Last 7 Days': [moment().subtract(6, 'days'), moment()],
				'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				'This Month': [moment().startOf('month'), moment().endOf('month')],
				'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
			}
		}, call_today);
	}

	call_today(start, end);

	$('#kt_daterangepicker_6').on('apply.daterangepicker', function (ev, picker) {
		$("#table_transcation").DataTable().destroy();
		datatable_init();

	});

	$('kt_daterangepicker_6').on('cancel.daterangepicker', function (ev, picker) {
		$("#table_transcation").DataTable().destroy();
		datatable_init();

	});

	datatable_init();

	function datatable_init() {

		show_employee_saving();

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
				var column_kredit_um = 9;
				var column_debit_um = 10;
				var column_saldo_um = 11;
				var api = this.api(),
					data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return typeof i === 'string' ? i.replace(/[\$,.]/g, '') * 1 : typeof i ===
						'number' ? i : 0;
				};
				// Total over this page
				var pageTotal_kr_um = api.column(column_kredit_um, {
					page: 'current'
				}).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);
				var pageTotal_de_um = api.column(column_debit_um, {
					page: 'current'
				}).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);
				var pageTotal_sal_um = api.column(column_saldo_um, {
					page: 'current'
				}).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);

				// Update footer
				$(api.column(column_kredit_um).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_kr_um
					.toFixed(0)));

				$(api.column(column_debit_um).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_de_um
					.toFixed(0)));

				$(api.column(column_saldo_um).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_sal_um
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

	$('#btn_excel').on('click', function (e) {
		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		var rows_selected = $("#table_transcation").DataTable().column(0).checkboxes.selected();
		// Iterate over all selected checkboxes
		//alert(rows_selected.join(","));
		KTApp.blockPage({
			overlayColor: '#FFA800',
			state: 'warning',
			size: 'lg',
			opacity: 0.1,
			message: 'Silahkan Tunggu...'
		});

		$.ajax({
			type: "POST",
			url: `${HOST_URL}/finance/report/export_data_employee_csv_all`,
			dataType: "JSON",
			data: {
				data_check: rows_selected.join(","),
				date_range: date_range,
				start_date: lstart,
				end_date: lend,
				[csrfName]: csrfHash
			},
			success: function (data) {
				// Update CSRF hash
				KTApp.unblockPage();
				console.log(data);

				$('.txt_csrfname').val(data.token);

				if (data.status) {

					var $a = $("<a>");
					$a.attr("href", data.file);
					$("body").append($a);
					$a.attr("download", data.filename);
					$a[0].click();
					$a.remove();

					Swal.fire({
						html: data.messages,
						icon: "success",
						buttonsStyling: false,
						confirmButtonText: "Oke!",
						customClass: {
							confirmButton: "btn font-weight-bold btn-success"
						}
					}).then(function () {
						KTUtil.scrollTop();
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
		});
		e.preventDefault();
	});

	$('#btn_pdf').on('click', function (e) {

		var rows_selected = $("#table_transcation").DataTable().column(0).checkboxes.selected();
		// Iterate over all selected checkboxes
		//alert(rows_selected.join(","));
		KTApp.blockPage({
			overlayColor: '#FFA800',
			state: 'warning',
			size: 'lg',
			opacity: 0.1,
			message: 'Silahkan Tunggu...'
		});

		$.ajax({
			type: "POST",
			url: `${HOST_URL}/finance/report/print_data_employee_saving_pdf_all`,
			data: {
				data_check: rows_selected.join(","),
				date_range: date_range,
				start_date: lstart,
				end_date: lend
			},
			xhrFields: {
				responseType: 'blob' // to avoid binary data being mangled on charset conversion
			},
			success: function (blob, data, xhr) {
				KTApp.unblockPage();
				// check for a filename
				try {
					var filename = "";
					var disposition = xhr.getResponseHeader('Content-Disposition');
					if (disposition && disposition.indexOf('attachment') !== -1) {
						var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
						var matches = filenameRegex.exec(disposition);
						if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
					}

					if (typeof window.navigator.msSaveBlob !== 'undefined') {
						// IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
						window.navigator.msSaveBlob(blob, filename);
					} else {
						var URL = window.URL || window.webkitURL;
						var downloadUrl = URL.createObjectURL(blob);

						if (filename) {
							// use HTML5 a[download] attribute to specify filename
							var a = document.createElement("a");
							// safari doesn't support this yet
							if (typeof a.download === 'undefined') {
								window.open(downloadUrl, '_blank');
							} else {
								a.href = downloadUrl;
								a.download = filename;
								document.body.appendChild(a);
								a.click();
								document.body.removeChild(a); // Cleanup
							}
						} else {
							window.open(downloadUrl, '_blank');
						}

					}

					Swal.fire({
						html: "Berhasil!, Laporan berhasil dicetak, Silahkan cek ulang.",
						icon: "success",
						buttonsStyling: false,
						confirmButtonText: "Oke!",
						customClass: {
							confirmButton: "btn font-weight-bold btn-success"
						}
					}).then(function () {
						KTUtil.scrollTop();
					});
				} catch {

					Swal.fire({
						html: "Mohon Maaf, Pilih/Centang data terlebih dahulu. Silahkan cek ulang.",
						icon: "error",
						buttonsStyling: false,
						confirmButtonText: "Oke!",
						customClass: {
							confirmButton: "btn font-weight-bold btn-success"
						}
					}).then(function () {
						KTUtil.scrollTop();
					});
				}
			}
		});
		e.preventDefault();
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

	$(".findRekapNasabah").select2({
		placeholder: "Input NIP Pegawai",
		minimumInputLength: 6,
		maximumInputLength: 8,
		allowClear: true,
	});

	$("#modalRekap").on("hidden.bs.modal", function () {
		$("#inputNIPRekap").val("");
		$("#userRekap").html("username");
	});

	$("#tb_transaksi").on("click", ".edit_nasabah", function () {

		$('[name="id_pegawai"]').val('');
		$('[name="nip_pegawai"]').val('');
		$('[name="nama_pegawai"]').val('');
		$('[name="email_nasabah"]').val('');
		$('[name="nama_wali"]').val('');
		$('[name="nomor_handphone_pegawai"]').val('');
		$('[name="jabatan_pegawai"]').empty();

		var id_pegawai = $(this).data("id_pegawai") || "";
		var id_jabatan = $(this).data("id_jabatan") || "";
		var nama_jabatan = $(this).data("nama_jabatan") || "";
		var nip_pegawai = $(this).data("nip_pegawai") || "";
		var nama_lengkap = $(this).data("nama_lengkap") || "";
		var level_tingkat = $(this).data("level_tingkat") || "";
		var jenis_kelamin = $(this).data("jenis_kelamin") || "";
		var id_th_ajaran = $(this).data("id_th_ajaran") || "";
		var nama_th_ajaran = $(this).data("nama_th_ajaran") || "";
		var email = $(this).data("email") || "";
		var status_pegawai = $(this).data("status_pegawai") || "";
		var nomor_handphone_pegawai = $(this).data("nomor_handphone") || "";

		$("#tingkat").change(function () {
			level_tingkat = $(this).val();
			var url = `${HOST_URL}finance/savings/add_ajax_position/${level_tingkat}`;
			$('#jabatan').load(url);
			return false;
		});

		$('[name="id_pegawai"]').val(id_pegawai);
		$('[name="nip_pegawai"]').val(nip_pegawai);
		$('[name="nama_pegawai"]').val(nama_lengkap.toUpperCase());

		$('[name="jenis_kelamin"]').find('option[value="' + jenis_kelamin + '"]').prop('selected', true);
		$('[name="level_tingkat"]').find('option[value="' + level_tingkat + '"]').prop('selected', true);
		$('[name="status_pegawai"]').find('option[value="' + status_pegawai + '"]').prop('selected', true);
		$('[name="th_ajaran"]').find('option[value="' + id_th_ajaran + '"]').prop('selected', true);

		$('[name="email_nasabah"]').val(email);
		$('[name="nomor_handphone_pegawai"]').val(nomor_handphone_pegawai);

		if (nama_lengkap != null && nama_lengkap != "") {
			$('[name="jabatan_pegawai"]').find('option[value="' + id_jabatan + '"]').prop('selected', true);
		} else {
			var nama_lengkap = "BELUM DIPILIH";
			$('[name="jabatan_pegawai"]').prepend($("<option value='0' selected ></option>").text(`${nama_lengkap}`));
		}

		$("#modalEditNasabah").modal("show");
	});

	$("#findRekapNasabah").on("change", function () {
		var nip = $("#findRekapNasabah").find(":selected").val();
		var nama = $("#findRekapNasabah").find(":selected").text().split('(');

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_employee_info_recap/${nip}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_pegawai']) {
					jumlah_saldo_umum = data['info_pegawai'][0]['saldo_tabungan_umum'] || "";
					info_jabatan = data['info_pegawai'][0]['hasil_nama_jabatan'] || "";
					info_status = data['info_pegawai'][0]['jenis_pegawai'] || "";

					if (info_status == '1') {
						nama_status = 'PEGAWAI TETAP'
					} else if (info_status == '2') {
						nama_status = 'PEGAWAI TIDAK TETAP'
					} else if (info_status == '3') {
						nama_status = 'HONORER'
					}

				} else {
					jumlah_saldo_umum = "-";
					info_jabatan = "-";
					info_status = "-";
				}

				if (data['info_tabungan_umum'].length !== 0) {
					if (data['info_tabungan_umum'][0]['catatan'] == "" || data['info_tabungan_umum'][0]['catatan'] == null) {
						info_catatan_umum = "-"
					} else {
						info_catatan_umum = data['info_tabungan_umum'][0]['catatan'];
					}
					info_waktu_transaksi_umum = data['info_tabungan_umum'][0]['waktu_transaksi'];
				} else {
					info_catatan_umum = "-";
					info_waktu_transaksi_umum = "-";
				}

			},
		});

		$("#userStatusPegawaiRekap").html(nama_status);
		$("#infoNamaPegawaiRekap").html(nama[1].slice(0, -1));
		$("#userJabatanRekap").html(info_jabatan);

		$("#userCatatanRekap").html(info_catatan_umum);
		$("#infoTerakhirTransaksiRekap").html(info_waktu_transaksi_umum);
		$("#userJumlahSaldoRekap").html(CurrencyID(jumlah_saldo_umum));
	});

	function CurrencyID(nominal) {
		var formatter = new Intl.NumberFormat("id-ID", {
			currency: "IDR",
			minimumFractionDigits: 0,
		});
		return formatter.format(nominal);
	}

	function list_employee() {
		$.ajax({
			type: "GET",
			url: `${HOST_URL}finance/savings/savings/get_all_employee`,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function (data) {
				var html = "";
				var option = "<option></option>";
				var i;
				for (i = 0; i < data.length; i++) {
					html +=
						'<option value="' +
						data[i].nip +
						'"> ' +
						`${data[i].nip}` + ` (${data[i].nama_lengkap})` +
						"</option>";
				}
				$("#findRekapNasabah").html(option + html);
			},
		});
	}

	$("#btnRekap").on("click", function () {
		list_employee();
	});

	$("#btnUpdateNasabah").on("click", function () {
		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		var id_pegawai = $('[name="id_pegawai"]').val() || "";
		var id_jabatan = $('[name="jabatan_pegawai"]').val() || "";
		var nip = $('[name="nip_pegawai"]').val() || "";
		var nama = $('[name="nama_pegawai"]').val() || "";
		var level_tingkat = $('[name="level_tingkat"]').val() || "";
		var email = $('[name="email_nasabah"]').val() || "";
		var jenis_pegawai = $('[name="status_pegawai"]').val() || "";
		var email_nasabah = $('[name="email_nasabah"]').val() || "";
		var nomor_handphone_pegawai = $('[name="nomor_handphone_pegawai"]').val() || "";
		var jenis_kelamin = $('[name="jenis_kelamin"]').val() || "";
		var th_ajaran = $('[name="th_ajaran"]').val() || "";

		if (id_pegawai != null && id_pegawai != "" && id_jabatan != null && id_jabatan != "" && nip != null && nip != "" && nama != null && nama != "" && level_tingkat != null && level_tingkat != "" && jenis_kelamin != null && jenis_kelamin != "" && th_ajaran != null && th_ajaran != "" && jenis_pegawai != null && jenis_pegawai != "") {

			Swal.fire({
				title: "Peringatan!",
				html: "Apakah anda yakin Mengupdate Nasabah Pegawai atas Nama <b>" + nama.toUpperCase() + " (" + nip + ")</b> ?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Ya, Simpan!",
				cancelButtonText: "Tidak, Batal!",
				closeOnConfirm: false,
				closeOnCancel: false
			}).then(function (result) {
				if (result.value) {

					$("#modalEditNasabah").modal("hide");
					KTApp.blockPage({
						overlayColor: '#FFA800',
						state: 'warning',
						size: 'lg',
						opacity: 0.1,
						message: 'Silahkan Tunggu...'
					});

					$.ajax({
						type: "POST",
						url: `${HOST_URL}/finance/savings/update_employee_saving`,
						dataType: "JSON",
						data: {
							id_pegawai: id_pegawai,
							id_jabatan: id_jabatan,
							nip: nip,
							nama_lengkap: nama,
							email: email,
							level_tingkat: level_tingkat,
							jenis_pegawai: jenis_pegawai,
							email_nasabah: email_nasabah,
							nomor_handphone_pegawai: nomor_handphone_pegawai,
							jenis_kelamin: jenis_kelamin,
							th_ajaran: th_ajaran,
							[csrfName]: csrfHash
						},
						success: function (data) {
							// Update CSRF hash
							KTApp.unblockPage();

							$('.txt_csrfname').val(data.token);

							if (data.status) {
								Swal.fire({
									html: data.messages,
									icon: "success",
									buttonsStyling: false,
									confirmButtonText: "Oke!",
									customClass: {
										confirmButton: "btn font-weight-bold btn-success"
									}
								}).then(function () {
									KTUtil.scrollTop();
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
							$("#table_transcation").DataTable().destroy();
							datatable_init();
						},
					});
				} else {
					Swal.fire("Dibatalkan!", "Edit Profil Nasabah/Pegawai atas Nama <b>" + nama.toUpperCase() + " (" + nip + ")</b> batal diubah.", "error");
					return false;
				}
			});
		} else {

			Swal.fire({
				html: "Opps!, Pastikan Inputan Terisi dengan Benar dan Tidak Boleh Kosong, Silahkan input ulang.",
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
		return false;
	});

	function show_employee_saving() {

		$.ajax({
			type: "GET",
			url: `${HOST_URL}finance/savings/get_all_employee_customer`,
			async: false,
			data: {
				start_date: lstart,
				end_date: lend,
			},
			dataType: "JSON",
			success: function (data) {
				var html = "";

				for (var i = 0; i < data.length; i++) {

					if (data[i].kredit_umum != null) {
						var kredit_umum = CurrencyID(data[i].kredit_umum);
					} else if (data[i].kredit_umum == null) {
						var kredit_umum = CurrencyID(0);
					}

					if (data[i].debet_umum != null) {
						var debet_umum = CurrencyID(data[i].debet_umum);
					} else if (data[i].debet_umum == null) {
						var debet_umum = CurrencyID(0);
					}

					if (data[i].saldo_umum != null) {
						var saldo_umum = CurrencyID(data[i].saldo_umum);
					} else if (data[i].saldo_umum == null) {
						var saldo_umum = CurrencyID(0);
					}

					if (data[i].hasil_nama_jabatan != null) {
						var nama_jabatan = data[i].hasil_nama_jabatan;
					} else if (data[i].hasil_nama_jabatan == null) {
						var nama_jabatan = "BELUM DIPILIH";
					}

					if (data[i].level_tingkat == "1") {
						var nama_tingkat = "DC/KB/TK";
					} else if (data[i].level_tingkat == "3") {
						var nama_tingkat = "SD";
					} else if (data[i].level_tingkat == "4") {
						var nama_tingkat = "SMP";
					} else if (data[i].level_tingkat == "6") {
						var nama_tingkat = "UMUM";
					}

					if (data[i].jenis_kelamin == "1") {
						var jenis_kelamin = "L";
					} else if (data[i].jenis_kelamin == "2") {
						var jenis_kelamin = "P";
					}

					if (data[i].jenis_pegawai == "1") {
						var status_pegawai = "TETAP";
						var color = "text-success";
					} else if (data[i].jenis_pegawai == "2") {
						var status_pegawai = "TIDAK TETAP";
						var color = "text-warning";
					} else if (data[i].jenis_pegawai == "3") {
						var status_pegawai = "HONORER";
						var color = "text-danger";
					}

					var option = "<div class='dropdown dropdown-inline'>" +
						"<a href='javascript:;' class='btn btn-xs  btn-clean btn-icon btn-primary' data-toggle='dropdown'>" +
						"<i class='la la-cog'></i>" +
						"</a>" +
						"<div class='dropdown-menu dropdown-menu-sm dropdown-menu-right'>" +
						"<ul class='nav nav-hover flex-column'>" +
						"<li class='nav-item'><a href='javascript:void(0);' class='nav-link edit_nasabah' data-id_pegawai='" +
						data[i].id_pegawai + "' data-nip_pegawai='" + data[i].nip + "' data-level_tingkat='" + data[i].level_tingkat + "' data-id_th_ajaran='" + data[i].th_ajaran + "' data-nama_th_ajaran='" + data[i].tahun_ajaran + "' data-id_jabatan='" + data[i].id_jabatan +
						"' data-nama_jabatan='" + data[i].hasil_nama_jabatan + "' data-nama_lengkap='" + data[i].nama_lengkap + "' data-jenis_kelamin='" + data[i].jenis_kelamin + "' data-email='" + data[i].email + "' data-status_pegawai='" + data[i].jenis_pegawai + "' data-nomor_handphone='" + data[i].nomor_hp +
						"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit Profil</span></a></li>" +
						"</ul>" +
						"</div>" +
						"</div>";

					html +=
						"<tr>" +
						"<td>" +
						`${data[i].id_pegawai}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${data[i].nip}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${data[i].nama_lengkap.toUpperCase()}` +
						"</td>" +
						"<td class='font-weight-bold'>" +
						`${nama_jabatan}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${jenis_kelamin}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${nama_tingkat}` +
						"</td>" +
						"<td>" +
						`${data[i].tahun_ajaran}` +
						"</td>" +
						"<td>" +
						`${data[i].nomor_hp}` +
						"</td>" +
						"<td class='font-weight-bolder " + color + "'>" +
						`${status_pegawai}` +
						"</td>" +
						"<td>" +
						`${kredit_umum}` +
						"</td>" +
						'<td class="">' +
						`${debet_umum}` +
						"</td>" +
						'<td class="">' +
						`${saldo_umum}` +
						"</td>" +
						'<td class="">' +
						`${option}` +
						"</td>" +
						"</tr>";
				}
				$("#tb_transaksi").html(html);
			},
		});

	}
});


