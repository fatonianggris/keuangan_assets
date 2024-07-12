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
			showCustomRangeLabel:false,
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

		show_personal_saving();

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
				var column_kredit_um = 5;
				var column_debit_um = 6;
				var column_saldo_um = 7;

				var column_debit_qr = 8;
				var column_kredit_qr = 9;
				var column_saldo_qr = 10;

				var column_kredit_ws = 11;
				var column_debit_ws = 12;
				var column_saldo_ws = 13;
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

				var pageTotal_kr_qr = api.column(column_kredit_qr, {
					page: 'current'
				}).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);
				var pageTotal_de_qr = api.column(column_debit_qr, {
					page: 'current'
				}).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);
				var pageTotal_sal_qr = api.column(column_saldo_qr, {
					page: 'current'
				}).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);

				var pageTotal_kr_ws = api.column(column_kredit_ws, {
					page: 'current'
				}).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);
				var pageTotal_de_ws = api.column(column_debit_ws, {
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
				$(api.column(column_kredit_um).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_kr_um
					.toFixed(0)));

				$(api.column(column_debit_um).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_de_um
					.toFixed(0)));

				$(api.column(column_saldo_um).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_sal_um
					.toFixed(0)));

				$(api.column(column_kredit_qr).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_kr_qr
					.toFixed(0)));

				$(api.column(column_debit_qr).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_de_qr
					.toFixed(0)));

				$(api.column(column_saldo_qr).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_sal_qr
					.toFixed(0)));

				$(api.column(column_kredit_ws).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_kr_ws
					.toFixed(0)));

				$(api.column(column_debit_ws).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_de_ws
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
			url: `${HOST_URL}/finance/report/export_data_personal_csv_all`,
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
			url: `${HOST_URL}/finance/report/print_data_personal_saving_pdf_all`,
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
							}
						} else {
							window.open(downloadUrl, '_blank');
						}

						setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
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
		placeholder: "Input NIS Siswa",
		minimumInputLength: 5,
		maximumInputLength: 6,
		allowClear: true,
	});

	$("#modalRekap").on("hidden.bs.modal", function () {
		$("#inputNISRekap").val("");
		$("#userRekap").html("username");
	});

	$("#tb_transaksi").on("click", ".edit_nasabah", function () {

		$('[name="id_siswa"]').val('');
		$('[name="nis_siswa"]').val('');
		$('[name="nama_siswa"]').val('');
		$('[name="email_wali"]').val('');
		$('[name="nama_wali"]').val('');
		$('[name="nomor_handphone_wali"]').val('');
		$('[name="jenis_kelamin"] option:selected').remove();
		$('[name="level_tingkat"] option:selected').remove();
		$('[name="th_ajaran"] option:selected').remove();

		var id_siswa = $(this).data("id_siswa");
		var nis_siswa = $(this).data("nis_siswa");
		var nama_lengkap = $(this).data("nama_lengkap");
		var level_tingkat = $(this).data("level_tingkat");
		var jenis_kelamin = $(this).data("jenis_kelamin");
		var id_th_ajaran = $(this).data("id_th_ajaran");
		var nama_th_ajaran = $(this).data("nama_th_ajaran");
		var email = $(this).data("email");
		var nama_wali = $(this).data("nama_wali");
		var nomor_handphone = $(this).data("nomor_handphone");

		if (jenis_kelamin == "1") {
			nama_kelamin = "Laki-Laki";
		} else {
			nama_kelamin = "Perempuan";
		}

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

		$("#modalEditNasabah").modal("show");

		$('[name="id_siswa"]').val(id_siswa);
		$('[name="nis_siswa"]').val(nis_siswa);
		$('[name="nama_siswa"]').val(nama_lengkap.toUpperCase());
		$('[name="jenis_kelamin"]').prepend($("<option selected></option>").attr("value", jenis_kelamin).text(nama_kelamin));
		$('[name="level_tingkat"]').prepend($("<option selected></option>").attr("value", level_tingkat).text(nama_tingkat));
		$('[name="th_ajaran"]').prepend($("<option selected></option>").attr("value", id_th_ajaran).text(nama_th_ajaran));
		$('[name="email_wali"]').val(email);
		$('[name="nama_wali"]').val(nama_wali.toUpperCase())
		$('[name="nomor_handphone_wali"]').val(nomor_handphone);
	});

	$("#findRekapNasabah").on("change", function () {
		var nis = $("#findRekapNasabah").find(":selected").val();
		var nama = $("#findRekapNasabah").find(":selected").text().split('(');

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_student_info_recap/${nis}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_siswa']) {
					jumlah_saldo_umum = data['info_siswa'][0]['saldo_tabungan_umum'];
					jumlah_saldo_qurban = data['info_siswa'][0]['saldo_tabungan_qurban'];
					jumlah_saldo_wisata = data['info_siswa'][0]['saldo_tabungan_wisata'];
					info_kelas = data['info_siswa'][0]['informasi'];
				} else {
					jumlah_saldo_umum = "-";
					jumlah_saldo_qurban = "-";
					jumlah_saldo_wisata = "-";
					info_kelas = "-";
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

				if (data['info_tabungan_qurban'].length !== 0) {
					if (data['info_tabungan_qurban'][0]['catatan'] == "" || data['info_tabungan_qurban'][0]['catatan'] == null) {
						info_catatan_qurban = "-"
					} else {
						info_catatan_qurban = data['info_tabungan_qurban'][0]['catatan'];
					}
					info_waktu_transaksi_qurban = data['info_tabungan_qurban'][0]['waktu_transaksi'];
				} else {
					info_catatan_qurban = "-";
					info_waktu_transaksi_qurban = "-";
				}

				if (data['info_tabungan_wisata'].length !== 0) {
					if (data['info_tabungan_wisata'][0]['catatan'] == "" || data['info_tabungan_wisata'][0]['catatan'] == null) {
						info_catatan_wisata = "-"
					} else {
						info_catatan_wisata = data['info_tabungan_wisata'][0]['catatan'];
					}
					info_waktu_transaksi_wisata = data['info_tabungan_wisata'][0]['waktu_transaksi'];
				} else {
					info_catatan_wisata = "-";
					info_waktu_transaksi_wisata = "-";
				}
			},
		});

		$("#userNisRekap").html(nis);
		$("#userNamaRekap").html(nama[1].slice(0, -1));
		$("#userKelasRekap").html(info_kelas);

		$("#userCatatanRekap").html(info_catatan_umum);
		$("#infoTerakhirTransaksiRekap").html(info_waktu_transaksi_umum);
		$("#userJumlahSaldoRekap").html(CurrencyID(jumlah_saldo_umum));

		$("#userCatatanRekapQurban").html(info_catatan_qurban);
		$("#infoTerakhirTransaksiRekapQurban").html(info_waktu_transaksi_qurban);
		$("#userJumlahSaldoRekapQurban").html(CurrencyID(jumlah_saldo_qurban));

		$("#userCatatanRekapWisata").html(info_catatan_wisata);
		$("#infoTerakhirTransaksiRekapWisata").html(info_waktu_transaksi_wisata);
		$("#userJumlahSaldoRekapWisata").html(CurrencyID(jumlah_saldo_wisata));
	});

	function CurrencyID(nominal) {
		var formatter = new Intl.NumberFormat("id-ID", {
			currency: "IDR",
			minimumFractionDigits: 0,
		});
		return formatter.format(nominal);
	}

	function list_student() {
		$.ajax({
			type: "GET",
			url: `${HOST_URL}finance/savings/savings/get_all_student`,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function (data) {
				var html = "";
				var option = "<option></option>";
				var i;
				for (i = 0; i < data.length; i++) {
					html +=
						'<option value="' +
						data[i].nis +
						'"> ' +
						`${data[i].nis}` + ` (${data[i].nama_lengkap})` +
						"</option>";
				}
				$("#findNasabahKredit").html(option + html);
				$("#findNasabahDebet").html(option + html);
				$("#findRekapNasabah").html(option + html);
			},
		});
	}

	$("#btnRekap").on("click", function () {
		list_student();
	});

	$("#btnUpdateNasabah").on("click", function () {
		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		var id_siswa = $('[name="id_siswa"]').val();
		var nis = $('[name="nis_siswa"]').val();
		var nama = $('[name="nama_siswa"]').val();
		var level_tingkat = $('[name="level_tingkat"]').val();
		var nama_wali = $('[name="nama_wali"]').val();
		var email_wali = $('[name="email_wali"]').val()
		var nomor_handphone_wali = $('[name="nomor_handphone_wali"]').val();
		var jenis_kelamin = $('[name="jenis_kelamin"]').val()
		var th_ajaran = $('[name="th_ajaran"]').val();

		if (nis != null && nis != "" && nama != null && nama != "" && level_tingkat != null && level_tingkat != "" && jenis_kelamin != null && jenis_kelamin != "" && th_ajaran != null && th_ajaran != "") {

			Swal.fire({
				title: "Peringatan!",
				html: "Apakah anda yakin Mengupdate Nasabah atas nama <b>" + nama.toUpperCase() + " (" + nis + ")</b> ?",
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
						url: `${HOST_URL}/finance/savings/update_personal_saving`,
						dataType: "JSON",
						data: {
							id_siswa: id_siswa,
							nis: nis,
							nama_lengkap: nama,
							level_tingkat: level_tingkat,
							nama_wali: nama_wali,
							email_wali: email_wali,
							nomor_handphone_wali: nomor_handphone_wali,
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
					Swal.fire("Dibatalkan!", "Edit Profil Nasabah atas nama <b>" + nama.toUpperCase() + " (" + nis + ")</b> batal diubah.", "error");
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

	function show_personal_saving() {

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_all_personal_customer`,
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

					if (data[i].kredit_qurban != null) {
						var kredit_qurban = CurrencyID(data[i].kredit_qurban);
					} else if (data[i].kredit_qurban == null) {
						var kredit_qurban = CurrencyID(0);
					}

					if (data[i].debet_qurban != null) {
						var debet_qurban = CurrencyID(data[i].debet_qurban);
					} else if (data[i].debet_qurban == null) {
						var debet_qurban = CurrencyID(0);
					}

					if (data[i].saldo_qurban != null) {
						var saldo_qurban = CurrencyID(data[i].saldo_qurban);
					} else if (data[i].saldo_qurban == null) {
						var saldo_qurban = CurrencyID(0);
					}

					if (data[i].kredit_wisata != null) {
						var kredit_wisata = CurrencyID(data[i].kredit_wisata);
					} else if (data[i].kredit_wisata == null) {
						var kredit_wisata = CurrencyID(0);
					}

					if (data[i].debet_wisata != null) {
						var debet_wisata = CurrencyID(data[i].debet_wisata);
					} else if (data[i].debet_wisata == null) {
						var debet_wisata = CurrencyID(0);
					}

					if (data[i].saldo_wisata != null) {
						var saldo_wisata = CurrencyID(data[i].saldo_wisata);
					} else if (data[i].saldo_wisata == null) {
						var saldo_wisata = CurrencyID(0);
					}

					if (data[i].level_tingkat == "1") {
						var nama_tingkat = "KB";
					} else if (data[i].level_tingkat == "2") {
						var nama_tingkat = "TK";
					} else if (data[i].level_tingkat == "3") {
						var nama_tingkat = "SD";
					} else if (data[i].level_tingkat == "4") {
						var nama_tingkat = "SMP";
					} else if (data[i].level_tingkat == "6") {
						var nama_tingkat = "DC";
					}

					var option = "<div class='dropdown dropdown-inline'>" +
						"<a href='javascript:;' class='btn btn-xs  btn-clean btn-icon btn-primary' data-toggle='dropdown'>" +
						"<i class='la la-cog'></i>" +
						"</a>" +
						"<div class='dropdown-menu dropdown-menu-sm dropdown-menu-right'>" +
						"<ul class='nav nav-hover flex-column'>" +
						"<li class='nav-item'><a href='javascript:void(0);' class='nav-link edit_nasabah' data-id_siswa='" +
						data[i].id_siswa + "' data-nis_siswa='" + data[i].nis + "' data-level_tingkat='" + data[i].level_tingkat + "' data-id_th_ajaran='" + data[i].th_ajaran + "' data-nama_th_ajaran='" + data[i].tahun_ajaran +
						"' data-nama_lengkap='" + data[i].nama_lengkap + "' data-jenis_kelamin='" + data[i].jenis_kelamin + "' data-email='" + data[i].email + "' data-nama_wali='" + data[i].nama_wali + "' data-nomor_handphone='" + data[i].nomor_handphone +
						"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit Profil</span></a></li>" +
						"</ul>" +
						"</div>" +
						"</div>";

					html +=
						"<tr>" +
						"<td>" +
						`${data[i].id_siswa}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${data[i].nis}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${data[i].nama_lengkap.toUpperCase()}` +
						"</td>" +
						"<td>" +
						`${nama_tingkat}` +
						"</td>" +
						"<td>" +
						`${data[i].tahun_ajaran}` +
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
						"<td>" +
						`${kredit_qurban}` +
						"</td>" +
						'<td class="">' +
						`${debet_qurban}` +
						"</td>" +
						'<td class="">' +
						`${saldo_qurban}` +
						"</td>" +
						'<td class="">' +
						`${kredit_wisata}` +
						"</td>" +
						'<td class="">' +
						`${debet_wisata}` +
						"</td>" +
						'<td class="">' +
						`${saldo_wisata}` +
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


