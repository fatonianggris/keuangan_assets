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

		show_transaksi();

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
				var column_kr = 9;
				var column_de = 10;
				var api = this.api(),
					data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return typeof i === 'string' ? i.replace(/[\$,.]/g, '') * 1 : typeof i ===
						'number' ? i : 0;
				};
				// Total over this page
				var pageTotal_kr = api.column(column_kr, {
					page: 'current'
				}).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);
				var pageTotal_de = api.column(column_de, {
					page: 'current'
				}).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);
				
				// Update footer
				$(api.column(column_kr).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_kr
					.toFixed(0)));

				$(api.column(column_de).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_de
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
			url: `${HOST_URL}/finance/report/export_data_csv_transaction_joint_all`,
			dataType: "JSON",
			data: {
				data_check: rows_selected.join(","),
				date_range: date_range,
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
						text: data.messages,
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
						text: data.messages,
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
			url: `${HOST_URL}/finance/report/print_data_pdf_transaction_joint_all`,
			data: {
				data_check: rows_selected.join(","),
				date_range: date_range,
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
						text: "Berhasil!, Laporan berhasil dicetak, Silahkan cek ulang.",
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
						text: "Mohon Maaf, Pilih/Centang data terlebih dahulu. Silahkan cek ulang.",
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

	$(".findTabunganKredit").select2({
		placeholder: "Cari Tabungan Bersama",
		minimumInputLength: 7,
		maximumInputLength: 7,
		allowClear: true,
	});

	$(".findTabunganDebet").select2({
		placeholder: "Cari Tabungan Bersama",
		minimumInputLength: 7,
		maximumInputLength: 7,
		allowClear: true,
	});

	$(".findTabunganKreditEdit").select2({
		placeholder: "Cari Tabungan Bersama",
		minimumInputLength: 7,
		maximumInputLength: 7,
		allowClear: false,
	});

	$(".findTabunganDebetEdit").select2({
		placeholder: "Cari Tabungan Bersama",
		minimumInputLength: 7,
		maximumInputLength: 7,
		allowClear: false,
	});

	$(".findTabunganRekap").select2({
		placeholder: "Cari Tabungan Bersama",
		minimumInputLength: 7,
		maximumInputLength: 7,
		allowClear: true,
	});

	$("#modalKredit").on("hidden.bs.modal", function () {
		$("#inputNominalKredit").val("");
		$("#userKredit").html("username");
		$("#inputNISKredit").val("");
		$("#inputNIPKredit").val("");
		$("#inputCatatanKredit").val("");
		$("#userJumlahSaldo").html(0);
	});

	$("#modalDebet").on("hidden.bs.modal", function () {
		$("#inputNominalDebet").val("");
		$("#userDebet").html("username");
		$("#inputNISDebet").val("");
		$("#inputNIPDebet").val("");
		$("#cekSaldo").val("");
		$("#inputCatatanDebet").val("");
		$("#userJumlahSaldo2").html(0);
	});

	$("#modalRekap").on("hidden.bs.modal", function () {
		$("#inputNISRekap").val("");
		$("#userRekap").html("username");
	});

	$("#tb_transaksi").on("click", ".edit_transaksi_kredit", function () {

		var id_transaksi = $(this).data("id_transaksi_bersama");
		var nomor_rekening = $(this).data("nomor_rekening_bersama");
		var nomor_transaksi = $(this).data("nomor_transaksi_bersama");
		var nama_tabungan = $(this).data("nama_tabungan_bersama");
		var id_th_ajaran = $(this).data("id_th_ajaran");
		var id_tingkat = $(this).data("id_tingkat");
		var th_ajaran = $(this).data("th_ajaran");
		var nominal = $(this).data("nominal");
		var waktu_transaksi = $(this).data("waktu_transaksi");
		var catatan = $(this).data("catatan");

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

		$("#modalEditKreditTransaksi").modal("show");

		$('[name="id_transaksi_kredit_edit"]').val(id_transaksi);
		$('[name="nomor_rekening_kredit_edit"]').empty(0).append($("<option selected></option>").attr("value", nomor_rekening).text(nama_tabungan + " (" + nomor_rekening + ")"));
		$('[name="th_ajaran_kredit_edit"] option:selected').remove();
		$('[name="th_ajaran_kredit_edit"]').prepend($("<option selected></option>").attr("value", id_th_ajaran).text(th_ajaran));
		$('[name="tingkat_kredit_edit"] option:selected').remove();
		$('[name="tingkat_kredit_edit"]').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));
		$('[name="nominal_kredit_edit"]').val(nominal);
		$('[name="waktu_transaksi_kredit_edit"]').val(waktu_transaksi)
		$('[name="catatan_kredit_edit"]').val(catatan);

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_joint_saving_info_recap/${nomor_rekening}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_tabungan']) {
					nomor_rekening_bersama = data['info_tabungan'][0]['nomor_rekening_bersama'];
					nama_tabungan_bersama = data['info_tabungan'][0]['nama_tabungan_bersama'];
					jumlah_saldo_awal = (Number(data['info_tabungan'][0]['saldo_tabungan_bersama']) - Number(data['info_transaksi'][0]['nominal']));
					jumlah_saldo_akhir = data['info_tabungan'][0]['saldo_tabungan_bersama'];

					id_tingkat = data['info_tabungan'][0]['id_tingkat'];
					nis = data['info_tabungan'][0]['nis'];
					nama_wali = data['info_tabungan'][0]['nama_wali'];
					nama_siswa_pj = data['info_tabungan'][0]['nama_lengkap'];
					email_wali = data['info_tabungan'][0]['email'];
					nomor_handphone = data['info_tabungan'][0]['nomor_handphone'];

					if (id_tingkat == "1") {
						nama_tingkat = "KB";
					} else if (id_tingkat == "2") {
						nama_tingkat = "TK";
					} else if (id_tingkat == "3") {
						nama_tingkat = "SD";
					} else if (id_tingkat == "4") {
						nama_tingkat = "SMP";
					} else if (id_tingkat == "6") {
						nama_tingkat = "DC";
					}

				} else {
					jumlah_saldo_bersama = "-";
					nomor_rekening_bersama = "-";
					nama_tabungan_bersama = "-";

					nama_wali = "-";
					nis = "-";
					nama_siswa_pj = "-";
					email_wali = "-";
					nomor_handphone = "-";
					nama_tingkat = "-";
				}

				if (data['info_transaksi'].length !== 0) {
					if (data['info_transaksi'][0]['catatan'] == "" || data['info_transaksi'][0]['catatan'] == null) {
						info_catatan_bersama = "-"
					} else {
						info_catatan_bersama = data['info_transaksi'][0]['catatan'];
					}
					info_waktu_transaksi_bersama = data['info_transaksi'][0]['waktu_transaksi'];
				} else {
					info_catatan_bersama = "-";
					info_waktu_transaksi_bersama = "-";
				}
			},
		});
		$("#nomorTransaksiKreditEdit").html("(" + nomor_transaksi + ")");

		$("#userNorekKreditEdit").html(nama_tabungan_bersama.toUpperCase() + " (" + nomor_rekening_bersama + ")");
		$("#userPenanggungJawabKreditEdit").html(nama_siswa_pj.toUpperCase() + "/" + nama_wali.toUpperCase() + " (" + nis + ")");
		$("#userTingkatKreditEdit").html(nama_tingkat);
		$("#userCatatanKreditEdit").html(info_catatan_bersama);
		$("#infoTerakhirTransaksiKreditEdit").html(info_waktu_transaksi_bersama);

		$("#userJumlahSaldoKreditEdit").html(CurrencyID(jumlah_saldo_awal));
		$("#userJumlahSaldoKreditEditNow").html(CurrencyID(jumlah_saldo_akhir));
	});

	$("#tb_transaksi").on("click", ".edit_transaksi_debet", function () {

		var id_transaksi = $(this).data("id_transaksi_bersama");
		var nomor_rekening = $(this).data("nomor_rekening_bersama");
		var nomor_transaksi = $(this).data("nomor_transaksi_bersama");
		var nama_tabungan = $(this).data("nama_tabungan_bersama");
		var id_th_ajaran = $(this).data("id_th_ajaran");
		var id_tingkat = $(this).data("id_tingkat");
		var th_ajaran = $(this).data("th_ajaran");
		var nominal = $(this).data("nominal");
		var waktu_transaksi = $(this).data("waktu_transaksi");
		var catatan = $(this).data("catatan");

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

		$("#modalEditDebetTransaksi").modal("show");

		$('[name="id_transaksi_debet_edit"]').val(id_transaksi);
		$('[name="nomor_rekening_debet_edit"]').empty(0).append($("<option selected></option>").attr("value", nomor_rekening).text(nama_tabungan + " (" + nomor_rekening + ")"));
		$('[name="th_ajaran_debet_edit"] option:selected').remove();
		$('[name="th_ajaran_debet_edit"]').prepend($("<option selected></option>").attr("value", id_th_ajaran).text(th_ajaran));
		$('[name="tingkat_debet_edit"] option:selected').remove();
		$('[name="tingkat_debet_edit"]').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));
		$('[name="nominal_debet_edit"]').val(nominal);
		$('[name="waktu_transaksi_debet_edit"]').val(waktu_transaksi)
		$('[name="catatan_debet_edit"]').val(catatan);

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_joint_saving_info_recap/${nomor_rekening}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_tabungan']) {
					nomor_rekening_bersama = data['info_tabungan'][0]['nomor_rekening_bersama'];
					nama_tabungan_bersama = data['info_tabungan'][0]['nama_tabungan_bersama'];
					jumlah_saldo_awal = (Number(data['info_tabungan'][0]['saldo_tabungan_bersama']) + Number(data['info_transaksi'][0]['nominal']));
					jumlah_saldo_akhir = data['info_tabungan'][0]['saldo_tabungan_bersama'];

					id_tingkat = data['info_tabungan'][0]['id_tingkat'];
					nis = data['info_tabungan'][0]['nis'];
					nama_wali = data['info_tabungan'][0]['nama_wali'];
					nama_siswa_pj = data['info_tabungan'][0]['nama_lengkap'];
					email_wali = data['info_tabungan'][0]['email'];
					nomor_handphone = data['info_tabungan'][0]['nomor_handphone'];

					if (id_tingkat == "1") {
						nama_tingkat = "KB";
					} else if (id_tingkat == "2") {
						nama_tingkat = "TK";
					} else if (id_tingkat == "3") {
						nama_tingkat = "SD";
					} else if (id_tingkat == "4") {
						nama_tingkat = "SMP";
					} else if (id_tingkat == "6") {
						nama_tingkat = "DC";
					}

				} else {
					jumlah_saldo_bersama = "-";
					nomor_rekening_bersama = "-";
					nama_tabungan_bersama = "-";

					nama_wali = "-";
					nis = "-";
					nama_siswa_pj = "-";
					email_wali = "-";
					nomor_handphone = "-";
					nama_tingkat = "-";
				}

				if (data['info_transaksi'].length !== 0) {
					if (data['info_transaksi'][0]['catatan'] == "" || data['info_transaksi'][0]['catatan'] == null) {
						info_catatan_bersama = "-"
					} else {
						info_catatan_bersama = data['info_transaksi'][0]['catatan'];
					}
					info_waktu_transaksi_bersama = data['info_transaksi'][0]['waktu_transaksi'];
				} else {
					info_catatan_bersama = "-";
					info_waktu_transaksi_bersama = "-";
				}
			},
		});

		$("#nomorTransaksiDebetEdit").html("(" + nomor_transaksi + ")");

		$("#userNorekDebetEdit").html(nama_tabungan_bersama.toUpperCase() + " (" + nomor_rekening_bersama + ")");
		$("#userPenanggungJawabDebetEdit").html(nama_siswa_pj.toUpperCase() + "/" + nama_wali.toUpperCase() + " (" + nis + ")");
		$("#userTingkatDebetEdit").html(nama_tingkat);
		$("#userCatatanDebetEdit").html(info_catatan_bersama);
		$("#infoTerakhirTransaksiDebetEdit").html(info_waktu_transaksi_bersama);

		$("#userJumlahSaldoDebetEdit").html(CurrencyID(jumlah_saldo_awal));
		$("#userJumlahSaldoDebetEditNow").html(CurrencyID(jumlah_saldo_akhir));

	});

	$("#findTabunganKredit").on("change", function () {
		var nomor_rekening = $("#findTabunganKredit").find(":selected").val();
		var nama_tabungan = $("#findTabunganKredit").find(":selected").text();
		// var HOST_URL = "<?php echo base_url('admin/getMemberInfo/'); ?>" + nis;
		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_joint_saving_info_recap/${nomor_rekening}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_tabungan']) {
					nomor_rekening_bersama = data['info_tabungan'][0]['nomor_rekening_bersama'];
					nama_tabungan_bersama = data['info_tabungan'][0]['nama_tabungan_bersama'];
					jumlah_saldo_bersama = data['info_tabungan'][0]['saldo_tabungan_bersama'];
					id_tingkat = data['info_tabungan'][0]['id_tingkat'];

					nis = data['info_tabungan'][0]['nis'];
					nama_wali = data['info_tabungan'][0]['nama_wali'];
					nama_siswa_pj = data['info_tabungan'][0]['nama_lengkap'];
					email_wali = data['info_tabungan'][0]['email'];
					nomor_handphone = data['info_tabungan'][0]['nomor_handphone'];

					if (id_tingkat == "1") {
						nama_tingkat = "KB";
					} else if (id_tingkat == "2") {
						nama_tingkat = "TK";
					} else if (id_tingkat == "3") {
						nama_tingkat = "SD";
					} else if (id_tingkat == "4") {
						nama_tingkat = "SMP";
					} else if (id_tingkat == "6") {
						nama_tingkat = "DC";
					}

				} else {
					jumlah_saldo_bersama = "-";
					nomor_rekening_bersama = "-";
					nama_tabungan_bersama = "-";

					nama_wali = "-";
					nis = "-";
					nama_siswa_pj = "-";
					email_wali = "-";
					nomor_handphone = "-";
					nama_tingkat = "-";
				}

				if (data['info_transaksi'].length !== 0) {
					if (data['info_transaksi'][0]['catatan'] == "" || data['info_transaksi'][0]['catatan'] == null) {
						info_catatan_bersama = "-"
					} else {
						info_catatan_bersama = data['info_transaksi'][0]['catatan'];
					}
					info_waktu_transaksi_bersama = data['info_transaksi'][0]['waktu_transaksi'];
				} else {
					info_catatan_bersama = "-";
					info_waktu_transaksi_bersama = "-";
				}

			},
		});

		$('#inputTingkatKredit').find(":selected").remove();
		$('#inputTingkatKredit').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));

		$("#userNorekKredit").html(nama_tabungan_bersama.toUpperCase() + " (" + nomor_rekening_bersama + ")");
		$("#userPenanggungJawabKredit").html(nama_siswa_pj.toUpperCase() + "/" + nama_wali.toUpperCase() + " (" + nis + ")");
		$("#userTingkatKredit").html(nama_tingkat);
		$("#userCatatanKredit").html(info_catatan_bersama);
		$("#infoTerakhirTransaksiKredit").html(info_waktu_transaksi_bersama);
		$("#userJumlahSaldoKredit").html(CurrencyID(jumlah_saldo_bersama));
	});

	$("#findTabunganDebet").on("change", function () {
		var nomor_rekening = $("#findTabunganDebet").find(":selected").val();
		var nama_tabungan = $("#findTabunganDebet").find(":selected").text();
		// var HOST_URL = "<?php echo base_url('admin/getMemberInfo/'); ?>" + nis;
		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_joint_saving_info_recap/${nomor_rekening}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_tabungan']) {
					nomor_rekening_bersama = data['info_tabungan'][0]['nomor_rekening_bersama'];
					nama_tabungan_bersama = data['info_tabungan'][0]['nama_tabungan_bersama'];
					jumlah_saldo_bersama = data['info_tabungan'][0]['saldo_tabungan_bersama'];
					id_tingkat = data['info_tabungan'][0]['id_tingkat'];

					nis = data['info_tabungan'][0]['nis'];
					nama_wali = data['info_tabungan'][0]['nama_wali'];
					nama_siswa_pj = data['info_tabungan'][0]['nama_lengkap'];
					email_wali = data['info_tabungan'][0]['email'];
					nomor_handphone = data['info_tabungan'][0]['nomor_handphone'];

					if (id_tingkat == "1") {
						nama_tingkat = "KB";
					} else if (id_tingkat == "2") {
						nama_tingkat = "TK";
					} else if (id_tingkat == "3") {
						nama_tingkat = "SD";
					} else if (id_tingkat == "4") {
						nama_tingkat = "SMP";
					} else if (id_tingkat == "6") {
						nama_tingkat = "DC";
					}

				} else {
					jumlah_saldo_bersama = "-";
					nomor_rekening_bersama = "-";
					nama_tabungan_bersama = "-";

					nama_wali = "-";
					nis = "-";
					nama_siswa_pj = "-";
					email_wali = "-";
					nomor_handphone = "-";
					nama_tingkat = "-";
				}

				if (data['info_transaksi'].length !== 0) {
					if (data['info_transaksi'][0]['catatan'] == "" || data['info_transaksi'][0]['catatan'] == null) {
						info_catatan_bersama = "-"
					} else {
						info_catatan_bersama = data['info_transaksi'][0]['catatan'];
					}
					info_waktu_transaksi_bersama = data['info_transaksi'][0]['waktu_transaksi'];
				} else {
					info_catatan_bersama = "-";
					info_waktu_transaksi_bersama = "-";
				}

			},
		});

		$('#inputTingkatDebet').find(":selected").remove();
		$('#inputTingkatDebet').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));

		$("#userNorekDebet").html(nama_tabungan_bersama.toUpperCase() + " (" + nomor_rekening_bersama + ")");
		$("#userPenanggungJawabDebet").html(nama_siswa_pj.toUpperCase() + "/" + nama_wali.toUpperCase() + " (" + nis + ")");
		$("#userTingkatDebet").html(nama_tingkat);
		$("#userCatatanDebet").html(info_catatan_bersama);
		$("#infoTerakhirTransaksiDebet").html(info_waktu_transaksi_bersama);
		$("#userJumlahSaldoDebet").html(CurrencyID(jumlah_saldo_bersama));

	});

	$("#findTabunganRekap").on("change", function () {
		var nomor_rekening = $("#findTabunganRekap").find(":selected").val();
		var nama_tabungan = $("#findTabunganRekap").find(":selected").text();

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_joint_saving_info_recap/${nomor_rekening}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_tabungan']) {
					nomor_rekening_bersama = data['info_tabungan'][0]['nomor_rekening_bersama'];
					nama_tabungan_bersama = data['info_tabungan'][0]['nama_tabungan_bersama'];
					jumlah_saldo_bersama = data['info_tabungan'][0]['saldo_tabungan_bersama'];
					id_tingkat = data['info_tabungan'][0]['id_tingkat'];

					nis = data['info_tabungan'][0]['nis'];
					nama_wali = data['info_tabungan'][0]['nama_wali'];
					nama_siswa_pj = data['info_tabungan'][0]['nama_lengkap'];
					email_wali = data['info_tabungan'][0]['email'];
					nomor_handphone = data['info_tabungan'][0]['nomor_handphone'];

					if (id_tingkat == "1") {
						nama_tingkat = "KB";
					} else if (id_tingkat == "2") {
						nama_tingkat = "TK";
					} else if (id_tingkat == "3") {
						nama_tingkat = "SD";
					} else if (id_tingkat == "4") {
						nama_tingkat = "SMP";
					} else if (id_tingkat == "6") {
						nama_tingkat = "DC";
					}

				} else {
					jumlah_saldo_bersama = "-";
					nomor_rekening_bersama = "-";
					nama_tabungan_bersama = "-";

					nama_wali = "-";
					nis = "-";
					nama_siswa_pj = "-";
					email_wali = "-";
					nomor_handphone = "-";
					nama_tingkat = "-";
				}

				if (data['info_transaksi'].length !== 0) {
					if (data['info_transaksi'][0]['catatan'] == "" || data['info_transaksi'][0]['catatan'] == null) {
						info_catatan_bersama = "-"
					} else {
						info_catatan_bersama = data['info_transaksi'][0]['catatan'];
					}
					info_waktu_transaksi_bersama = data['info_transaksi'][0]['waktu_transaksi'];
				} else {
					info_catatan_bersama = "-";
					info_waktu_transaksi_bersama = "-";
				}
			},
		});

		$("#userNorekRekap").html(nama_tabungan_bersama.toUpperCase() + " (" + nomor_rekening_bersama + ")");
		$("#userPenanggungJawabRekap").html(nama_siswa_pj.toUpperCase() + "/" + nama_wali.toUpperCase() + " (" + nis + ")");
		$("#userTingkatRekap").html(nama_tingkat);
		$("#userCatatanRekap").html(info_catatan_bersama);
		$("#infoTerakhirTransaksiRekap").html(info_waktu_transaksi_bersama);
		$("#userJumlahSaldoRekap").html(CurrencyID(jumlah_saldo_bersama));

	});

	function CurrencyID(nominal) {
		var formatter = new Intl.NumberFormat("id-ID", {
			currency: "IDR",
			minimumFractionDigits: 0,
		});
		return formatter.format(nominal);
	}

	function list_join_saving() {
		$.ajax({
			type: "GET",
			url: `${HOST_URL}finance/savings/get_all_joint_saving`,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function (data) {
				var html = "";
				var option = "<option></option>";
				var i;
				for (i = 0; i < data.length; i++) {
					html +=
						'<option value="' +
						data[i].nomor_rekening_bersama +
						'"> ' +
						`${data[i].nomor_rekening_bersama} (${data[i].nama_tabungan_bersama.toUpperCase()})` +
						"</option>";
				}
				$("#findTabunganKredit").html(option + html);
				$("#findTabunganDebet").html(option + html);
				$("#findTabunganRekap").html(option + html);
			},
		});
	}

	$("#btnKredit").on("click", function () {
		list_join_saving();
	});

	$("#btnDebet").on("click", function () {
		list_join_saving();
	});

	$("#btnRekap").on("click", function () {
		list_join_saving();
	});

	$("#btnInputKredit").on("click", function () {
		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		var nomor_rekening = $('#findTabunganKredit').find(":selected").val();
		var nama_tabungan = $('#findTabunganKredit').find(":selected").text();
		var nominal = $("#inputNominalKredit").val();
		var tingkat = $("#inputTingkatKredit").val();
		var tahun_ajaran = $("#inputTahunAjaranKredit").val();
		var catatan = $("#inputCatatanKredit").val();
		var tanggal_transaksi = $("#inputTanggalKredit").val()

		if (nominal != null && nominal >= 5000 && nominal != "" && nomor_rekening != null && nomor_rekening != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "" && tingkat != null && tingkat != "") {

			Swal.fire({
				title: "Peringatan!",
				text: "Apakah anda yakin ingin Menyetor Tabungan Bersama atas nama " + nama_tabungan + " (" + nomor_rekening + ") dengan Nominal Rp." + nominal + " ?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Ya, Setor!",
				cancelButtonText: "Tidak, Batal!",
				closeOnConfirm: false,
				closeOnCancel: false
			}).then(function (result) {
				if (result.value) {

					$("#modalKredit").modal("hide");
					KTApp.blockPage({
						overlayColor: '#FFA800',
						state: 'warning',
						size: 'lg',
						opacity: 0.1,
						message: 'Silahkan Tunggu...'
					});

					$.ajax({
						type: "POST",
						url: `${HOST_URL}/finance/savings/post_joint_saving_credit`,
						dataType: "JSON",
						data: {
							input_nomor_rekening_bersama: nomor_rekening,
							input_nama_tabungan_bersama: nama_tabungan,
							input_tingkat: tingkat,
							input_nominal_saldo: nominal,
							input_tahun_ajaran: tahun_ajaran,
							input_catatan_saldo: catatan,
							input_tanggal_transaksi: tanggal_transaksi,
							[csrfName]: csrfHash
						},
						success: function (data) {
							// Update CSRF hash
							KTApp.unblockPage();

							$('.txt_csrfname').val(data.token);
							if (data.status) {
								Swal.fire({
									text: data.messages,
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
									text: data.messages,
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
					Swal.fire("Dibatalkan!", "Setoran Tabungan Bersama atas nama " + nama_tabungan + " (" + nomor_rekening + ") batal diinputkan.", "error");
					return false;
				}
			});

			return false;
		} else {
			Swal.fire({
				text: "Opps!, Pastikan Inputan Terisi dengan Benar & Tidak Boleh < 5000, Silahkan input ulang.",
				icon: "error",
				buttonsStyling: false,
				confirmButtonText: "Oke!",
				customClass: {
					confirmButton: "btn font-weight-bold btn-danger"
				}
			}).then(function () {
				KTUtil.scrollTop();
			});
			return false;
		}

	});

	$("#btnUpdateKredit").on("click", function () {
		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		var id_transaksi = $('[name="id_transaksi_kredit_edit"]').val();
		var nomor_rekening = $('[name="nomor_rekening_kredit_edit"]').find(":selected").val();
		var nama_tabungan = $('[name="nomor_rekening_kredit_edit"]').find(":selected").text().split('(');
		var nominal = $('[name="nominal_kredit_edit"]').val();
		var tahun_ajaran = $('[name="th_ajaran_kredit_edit"]').val();
		var tingkat = $('[name="tingkat_kredit_edit"]').val();
		var catatan = $('[name="catatan_kredit_edit"]').val();
		var tanggal_transaksi = $('[name="waktu_transaksi_kredit_edit"]').val()

		nama_tabungan = nama_tabungan[0].slice(0, -1);

		if (nominal != null && nominal >= 5000 && nominal != "" && nomor_rekening != null && nomor_rekening != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "" && tingkat != null && tingkat != "") {

			Swal.fire({
				title: "Peringatan!",
				text: "Apakah anda yakin Update Kredit Tabungan Bersama atas nama " + nama_tabungan + " (" + nomor_rekening + ") dengan Nominal Rp." + nominal + " ?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Ya, Setor!",
				cancelButtonText: "Tidak, Batal!",
				closeOnConfirm: false,
				closeOnCancel: false
			}).then(function (result) {
				if (result.value) {

					$("#modalEditKreditTransaksi").modal("hide");
					KTApp.blockPage({
						overlayColor: '#FFA800',
						state: 'warning',
						size: 'lg',
						opacity: 0.1,
						message: 'Silahkan Tunggu...'
					});

					$.ajax({
						type: "POST",
						url: `${HOST_URL}/finance/savings/update_joint_saving_credit`,
						dataType: "JSON",
						data: {
							input_nomor_rekening_bersama: nomor_rekening,
							input_id_transaksi_bersama: id_transaksi,
							input_nominal_saldo: nominal,
							input_tingkat: tingkat,
							input_catatan_saldo: catatan,
							input_tahun_ajaran: tahun_ajaran,
							input_tanggal_transaksi: tanggal_transaksi,
							[csrfName]: csrfHash
						},
						success: function (data) {
							// Update CSRF hash
							KTApp.unblockPage();

							$('.txt_csrfname').val(data.token);

							if (data.status) {
								Swal.fire({
									text: data.messages,
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
									text: data.messages,
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
					Swal.fire("Dibatalkan!", "Edit Setoran Tabungan Bersama atas nama " + nama_tabungan + " (" + nomor_rekening + ") batal diubah.", "error");
					return false;
				}
			});

			return false;
		} else {
			Swal.fire({
				text: "Opps!, Pastikan Inputan Terisi dengan Benar & Tidak Boleh < 5000 dan Kosong, Silahkan input ulang.",
				icon: "error",
				buttonsStyling: false,
				confirmButtonText: "Oke!",
				customClass: {
					confirmButton: "btn font-weight-bold btn-danger"
				}
			}).then(function () {
				KTUtil.scrollTop();
			});
			return false;
		}
	});

	$("#btnInputDebet").on("click", function () {
		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		var nomor_rekening = $('#findTabunganDebet').find(":selected").val();
		var nama_tabungan = $('#findTabunganDebet').find(":selected").text();
		var saldo = document.getElementById("userJumlahSaldoDebet").textContent;
		var nominal = $("#inputNominalDebet").val();
		var tingkat = $("#inputTingkatDebet").val();
		var catatan = $("#inputCatatanDebet").val();
		var tahun_ajaran = $("#inputTahunAjaranDebet").val();
		var tanggal_transaksi = $("#inputTanggalDebet").val();

		saldo = parseInt(saldo.replace(/\./g, ""));

		if (nominal <= saldo) {

			if (nominal != null && nominal >= 5000 && nominal != "" && nomor_rekening != null && nomor_rekening != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "" && tingkat != null && tingkat != "") {

				Swal.fire({
					title: "Peringatan!",
					text: "Apakah anda yakin Menarik Tabungan Bersama atas nama " + nama_tabungan + " (" + nomor_rekening + ") dengan Nominal Rp." + nominal + " ?",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Ya, Tarik!",
					cancelButtonText: "Tidak, Batal!",
					closeOnConfirm: false,
					closeOnCancel: false
				}).then(function (result) {
					if (result.value) {

						$("#modalDebet").modal("hide");
						KTApp.blockPage({
							overlayColor: '#FFA800',
							state: 'warning',
							size: 'lg',
							opacity: 0.1,
							message: 'Silahkan Tunggu...'
						});

						$.ajax({
							type: "POST",
							url: `${HOST_URL}/finance/savings/post_joint_saving_debet`,
							dataType: "JSON",
							data: {
								input_nomor_rekening_bersama: nomor_rekening,
								input_nominal_saldo: nominal,
								input_tingkat: tingkat,
								input_tahun_ajaran: tahun_ajaran,
								input_catatan_saldo: catatan,
								input_tanggal_transaksi: tanggal_transaksi,
								[csrfName]: csrfHash
							},
							success: function (data) {
								// Update CSRF hash
								KTApp.unblockPage();

								$('.txt_csrfname').val(data.token);

								if (data.status) {
									Swal.fire({
										text: data.messages,
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
										text: data.messages,
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
						Swal.fire("Dibatalkan!", "Penarikan Tabungan Bersama atas nama " + nama_tabungan + " (" + nomor_rekening + ") batal diubah.", "error");
						return false;
					}
				});

				return false;

			} else {
				Swal.fire({
					text: "Opps!, Pastikan Inputan Terisi dengan Benar & Tidak Boleh < 5000 dan Kosong, Silahkan input ulang.",
					icon: "error",
					buttonsStyling: false,
					confirmButtonText: "Oke!",
					customClass: {
						confirmButton: "btn font-weight-bold btn-danger"
					}
				}).then(function () {
					KTUtil.scrollTop();
				});
				return false;
			}
		} else {
			Swal.fire({
				text: "Opps!, Pastikan Inputan Penarikan Tidak Boleh Lebih dari Saldo Tabungan, Silahkan input ulang.",
				icon: "error",
				buttonsStyling: false,
				confirmButtonText: "Oke!",
				customClass: {
					confirmButton: "btn font-weight-bold btn-danger"
				}
			}).then(function () {
				KTUtil.scrollTop();
			});
			return false;
		}
	});

	$("#btnUpdateDebet").on("click", function () {
		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		var id_transaksi = $('[name="id_transaksi_debet_edit"]').val();
		var nomor_rekening = $('[name="nomor_rekening_debet_edit"]').find(":selected").val();
		var nama_tabungan = $('[name="nomor_rekening_debet_edit"]').find(":selected").text().split('(');
		var nominal = $('[name="nominal_debet_edit"]').val();
		var tingkat = $('[name="tingkat_debet_edit"]').val();
		var tahun_ajaran = $('[name="th_ajaran_debet_edit"]').val();
		var catatan = $('[name="catatan_debet_edit"]').val();
		var tanggal_transaksi = $('[name="waktu_transaksi_debet_edit"]').val()
		var saldo = document.getElementById("userJumlahSaldoDebetEdit").textContent;

		saldo = parseInt(saldo.replace(/\./g, ""));
		nama_tabungan = nama_tabungan[0].slice(0, -1);

		if (nominal <= saldo) {

			if (nominal != null && nominal >= 5000 && nominal != "" && nomor_rekening != null && nomor_rekening != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "" && tingkat != null && tingkat != "") {

				Swal.fire({
					title: "Peringatan!",
					text: "Apakah anda yakin Update Penarikan Tabungan Bersama atas nama " + nama_tabungan + " (" + nomor_rekening + ") dengan Nominal Rp." + nominal + " ?",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Ya, Tarik!",
					cancelButtonText: "Tidak, Batal!",
					closeOnConfirm: false,
					closeOnCancel: false
				}).then(function (result) {
					if (result.value) {

						$("#modalEditDebetTransaksi").modal("hide");
						KTApp.blockPage({
							overlayColor: '#FFA800',
							state: 'warning',
							size: 'lg',
							opacity: 0.1,
							message: 'Silahkan Tunggu...'
						});

						$.ajax({
							type: "POST",
							url: `${HOST_URL}/finance/savings/update_joint_saving_debet`,
							dataType: "JSON",
							data: {
								input_nomor_rekening_bersama: nomor_rekening,
								input_id_transaksi_bersama: id_transaksi,
								input_nominal_saldo: nominal,
								input_tingkat: tingkat,
								input_catatan_saldo: catatan,
								input_tahun_ajaran: tahun_ajaran,
								input_tanggal_transaksi: tanggal_transaksi,
								[csrfName]: csrfHash
							},
							success: function (data) {
								// Update CSRF hash
								KTApp.unblockPage();

								$('.txt_csrfname').val(data.token);

								if (data.status) {
									Swal.fire({
										text: data.messages,
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
										text: data.messages,
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
								show_transaksi(); $("#table_transcation").DataTable().destroy();
								datatable_init();
							},
						});
					} else {
						Swal.fire("Dibatalkan!", "Edit Penarikan Tabungan Bersama atas nama " + nama_tabungan + " (" + nomor_rekening + ") batal diubah.", "error");
						return false;
					}
				});

				return false;

			} else {
				Swal.fire({
					text: "Opps!, Pastikan Inputan Terisi dengan Benar & Tidak Boleh < 5000 dan Kosong, Silahkan input ulang.",
					icon: "error",
					buttonsStyling: false,
					confirmButtonText: "Oke!",
					customClass: {
						confirmButton: "btn font-weight-bold btn-danger"
					}
				}).then(function () {
					KTUtil.scrollTop();
				});
				return false;
			}
		} else {
			Swal.fire({
				text: "Opps!, Pastikan Inputan Penarikan Tidak Boleh Lebih dari Saldo Tabungan, Silahkan input ulang.",
				icon: "error",
				buttonsStyling: false,
				confirmButtonText: "Oke!",
				customClass: {
					confirmButton: "btn font-weight-bold btn-danger"
				}
			}).then(function () {
				KTUtil.scrollTop();
			});
			return false;
		}
	});

	function show_transaksi() {

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_all_joint_transaction`,
			async: false,
			data: {
				start_date: lstart,
				end_date: lend,
			},
			dataType: "JSON",
			success: function (data) {
				var html = "";

				for (var i = 0; i < data.length; i++) {
					if (data[i].status_kredit_debet == "1") {
						var bg_color = "bg-light-success";
						var jenis_transaksi = "KREDIT"
						var debet = "0";
						var kredit = CurrencyID(data[i].nominal);
					} else if (data[i].status_kredit_debet == "2") {
						var bg_color = "bg-light-danger";
						var jenis_transaksi = "DEBET"
						var debet = CurrencyID(data[i].nominal);
						var kredit = "0";
					}

					if (data[i].saldo != null) {
						var saldo = CurrencyID(data[i].saldo);
					} else if (data[i].saldo == null) {
						var saldo = CurrencyID(0);
					}


					if (data[i].id_tingkat == "1") {
						var nama_tingkat = "KB";
					} else if (data[i].id_tingkat == "2") {
						var nama_tingkat = "TK";
					} else if (data[i].id_tingkat == "3") {
						var nama_tingkat = "SD";
					} else if (data[i].id_tingkat == "4") {
						var nama_tingkat = "SMP";
					} else if (data[i].id_tingkat == "6") {
						var nama_tingkat = "DC";
					}

					if (data[i].status_edit == 1) {

						if (data[i].status_kredit_debet == "1") {
							var option = "<div class='dropdown dropdown-inline'>" +
								"<a href='javascript:;' class='btn btn-xs  btn-clean btn-icon btn-primary' data-toggle='dropdown'>" +
								"<i class='la la-cog'></i>" +
								"</a>" +
								"<div class='dropdown-menu dropdown-menu-sm dropdown-menu-right'>" +
								"<ul class='nav nav-hover flex-column'>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link edit_transaksi_kredit' data-id_transaksi_bersama='" + data[i].id_transaksi_bersama + "' data-nomor_transaksi_bersama='" + data[i].nomor_transaksi_bersama +
								"' data-nomor_rekening_bersama='" + data[i].nomor_rekening_bersama + "' data-nama_tabungan_bersama='" + data[i].nama_tabungan_bersama + "' data-id_tingkat='" + data[i].id_tingkat +
								"' data-jenis_transaksi='" + jenis_transaksi + "' data-id_th_ajaran='" + data[i].th_ajaran + "' data-th_ajaran='" + data[i].tahun_ajaran + "' data-nominal='" + data[i].nominal + "' data-waktu_transaksi='" + data[i].tanggal_transaksi + "' data-catatan='" + data[i].catatan +
								"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit</span></a></li>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link delete_transaksi_kredit' data-id_transaksi_bersama='" +
								data[i].id_transaksi_bersama + "' data-nomor_rekening_bersama='" + data[i].nomor_rekening_bersama + "' data-nama_tabungan_bersama='" + data[i].nama_tabungan_bersama + "' data-nomor_transaksi_bersama='" + data[i].nomor_transaksi_bersama +
								"' data-jenis_transaksi='" + jenis_transaksi + "' data-nominal='" + data[i].nominal + "'><i class='nav-icon la la-trash text-danger'></i><span class='nav-text text-danger font-weight-bold text-hover-primary'>Hapus</span></a></li>" +
								"</ul>" +
								"</div>" +
								"</div>";
						} else if (data[i].status_kredit_debet == "2") {
							var option = "<div class='dropdown dropdown-inline'>" +
								"<a href='javascript:;' class='btn btn-xs  btn-clean btn-icon btn-primary' data-toggle='dropdown'>" +
								"<i class='la la-cog'></i>" +
								"</a>" +
								"<div class='dropdown-menu dropdown-menu-sm dropdown-menu-right'>" +
								"<ul class='nav nav-hover flex-column'>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link edit_transaksi_debet' data-id_transaksi_bersama='" + data[i].id_transaksi_bersama + "' data-nomor_transaksi_bersama='" + data[i].nomor_transaksi_bersama +
								"' data-nomor_rekening_bersama='" + data[i].nomor_rekening_bersama + "' data-nama_tabungan_bersama='" + data[i].nama_tabungan_bersama + "' data-id_tingkat='" + data[i].id_tingkat +
								"' data-jenis_transaksi='" + jenis_transaksi + "' data-id_th_ajaran='" + data[i].th_ajaran + "' data-th_ajaran='" + data[i].tahun_ajaran + "' data-nominal='" + data[i].nominal + "' data-waktu_transaksi='" + data[i].tanggal_transaksi + "' data-catatan='" + data[i].catatan +
								"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit</span></a></li>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link delete_transaksi_debet' data-id_transaksi_bersama='" +
								data[i].id_transaksi_bersama + "' data-nomor_rekening_bersama='" + data[i].nomor_rekening_bersama + "' data-nama_tabungan_bersama='" + data[i].nama_tabungan_bersama + "' data-nomor_transaksi_bersama='" + data[i].nomor_transaksi_bersama +
								"' data-jenis_transaksi='" + jenis_transaksi + "' data-nominal='" + data[i].nominal + "'><i class='nav-icon la la-trash text-danger'></i><span class='nav-text text-danger font-weight-bold text-hover-primary'>Hapus</span></a></li>" +
								"</ul>" +
								"</div>" +
								"</div>";
						}
					} else {
						var option = "<div class='dropdown dropdown-inline'>" +
							"<a class='btn btn-xs btn-icon btn-default' data-toggle='dropdown'>" +
							"<i class='la la-remove'></i>" +
							"</a>" +
							"</div>";
					}
					html +=
						"<tr class='" + `${bg_color}` + "'>" +
						"<td>" +
						`${data[i].id_transaksi_bersama}` +
						"</td>" +
						"<td class='font-weight-bolder text-danger'>" +
						`${data[i].nomor_transaksi_bersama}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${data[i].nomor_rekening_bersama}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${data[i].nama_tabungan_bersama.toUpperCase()}` +
						"</td>" +
						"<td>" +
						`${data[i].waktu_transaksi}` +
						"</td>" +
						"<td>" +
						`${data[i].tahun_ajaran}` +
						"</td>" +
						'<td class="">' +
						`${nama_tingkat}` +
						"</td>" +
						"<td><b>" +
						`${jenis_transaksi}` +
						"</b></td>" +
						"<td>" +
						`${data[i].tanggal_transaksi}` +
						"</td>" +
						'<td class="">' +
						`${kredit}` +
						"</td>" +
						'<td class="">' +
						`${debet}` +
						"</td>" +
						'<td class="">' +
						`${saldo}` +
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

	$("#tb_transaksi").on("click", ".delete_transaksi_kredit", function () {
		var id_transaksi = $(this).data("id_transaksi");
		var nis_siswa = $(this).data("nis_siswa");
		var nama_siswa = $(this).data("nama_lengkap");
		var jenis_transaksi = $(this).data("jenis_transaksi");
		var nominal = $(this).data("nominal");

		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		Swal.fire({
			title: "Peringatan!",
			text: "",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Tidak, batal!",
			closeOnConfirm: false,
			closeOnCancel: false,
			html: "Apakah anda yakin ingin menghapus Transaksi (" + jenis_transaksi + ") atas nama '" +
				nama_siswa + "' (" + nis_siswa + ") dengan nominal Kredit (Rp. " + nominal + ") ? <br></br> <div id='recaptcha_delete'></div>",
			didOpen: () => {
				grecaptcha.render('recaptcha_delete', {
					'sitekey': '6LcUwakcAAAAAApKwPCj1lsgVOlmtv-uJzSuxyGG'
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
					url: `${HOST_URL}/finance/savings/delete_credit_transaction`,
					data: {
						id_transaksi: id_transaksi,
						nis: nis_siswa,
						[csrfName]: csrfHash
					},
					dataType: 'JSON',
					success: function (data) {

						$('.txt_csrfname').val(data.token);

						Swal.fire({
							text: data.messages,
							icon: "success",
							buttonsStyling: false,
							confirmButtonText: "Oke!",
							customClass: {
								confirmButton: "btn font-weight-bold btn-success"
							}
						}).then(function () {
							KTUtil.scrollTop();
						});
						$("#table_transcation").DataTable().destroy();
						datatable_init();
					},
					error: function (result) {
						console.log(result);
						Swal.fire("Opsss!", "Koneksi Internet Bermasalah.", "error");
					}
				});

				return false;
			} else {
				Swal.fire("Dibatalkan!", "Penghapusan Transaksi Kredit atas nama '" + nama_siswa + "' (" + nis_siswa + ") batal dihapus.", "error");

				return false;
			}
		});

		return false;
	});

	$("#tb_transaksi").on("click", ".delete_transaksi_debet", function () {
		var id_transaksi = $(this).data("id_transaksi");
		var nis_siswa = $(this).data("nis_siswa");
		var nama_siswa = $(this).data("nama_lengkap");
		var jenis_transaksi = $(this).data("jenis_transaksi");
		var nominal = $(this).data("nominal");

		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		Swal.fire({
			title: "Peringatan!",
			text: "",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Tidak, batal!",
			closeOnConfirm: false,
			closeOnCancel: false,
			html: "Apakah anda yakin ingin menghapus Transaksi (" + jenis_transaksi + ") atas nama '" +
				nama_siswa + "' (" + nis_siswa + ") dengan nominal Debet (Rp. " + nominal + ") ? <br></br> <div id='recaptcha_delete'></div>",
			didOpen: () => {
				grecaptcha.render('recaptcha_delete', {
					'sitekey': '6LcUwakcAAAAAApKwPCj1lsgVOlmtv-uJzSuxyGG'
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
					url: `${HOST_URL}/finance/savings/delete_debet_transaction`,
					data: {
						id_transaksi: id_transaksi,
						nis: nis_siswa,
						[csrfName]: csrfHash
					},
					dataType: 'JSON',
					success: function (data) {

						$('.txt_csrfname').val(data.token);

						Swal.fire({
							text: data.messages,
							icon: "success",
							buttonsStyling: false,
							confirmButtonText: "Oke!",
							customClass: {
								confirmButton: "btn font-weight-bold btn-success"
							}
						}).then(function () {
							KTUtil.scrollTop();
						});
						$("#table_transcation").DataTable().destroy();
						datatable_init();
					},
					error: function (result) {
						console.log(result);
						Swal.fire("Opsss!", "Koneksi Internet Bermasalah.", "error");
					}
				});
				return false;

			} else {
				Swal.fire("Dibatalkan!", "Penghapusan Transaksi Debet atas nama '" + nama_siswa + "' (" + nis_siswa + ") batal dihapus.", "error");

				return false;
			}
		});

	});

});