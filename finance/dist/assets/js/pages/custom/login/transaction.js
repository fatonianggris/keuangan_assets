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
			url: `${HOST_URL}/finance/report/export_data_csv_transaction_general_all`,
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
			url: `${HOST_URL}/finance/report/print_data_pdf_transaction_general_all`,
			data: {
				data_check: rows_selected.join(","),
				date_range: date_range
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

					  // If no filename is found, give a default name
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

	$(".findNasabahKredit").select2({
		placeholder: "Input NIS Siswa",
		allowClear: true,
		minimumInputLength: 6,
		maximumInputLength: 7,
		tags: true
	}).on("change", function (e) {
		//var isNew = e.params.data;
		var isNew = $(".findNasabahKredit option:selected").text();
		if (isNew.length == 7 || isNew.length == 6) {
			if (stat_close == true) {
				Swal.fire({
					title: "Peringatan!",
					html: "Data Tidak Ditemukan, Tambah Data Untuk Mengisi Biodata Nasabah",
					icon: "warning",
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Ya, Tambahkan!",
					allowEnterKey: false,
				});
				show_nasabah_div();
				stat_close = false;
			}
		}
	});

	$('.findNasabahKredit').on('select2:unselecting', function (e) {
		stat_close = true;
	});

	$(".findNasabahDebet").select2({
		placeholder: "Input NIS Siswa",
		minimumInputLength: 6,
		maximumInputLength: 7,
		allowClear: true,
	});

	$(".findNasabahKreditEdit").select2({
		placeholder: "Input NIS Siswa",
		minimumInputLength: 6,
		maximumInputLength: 7,
		allowClear: false,
	});

	$(".findNasabahDebetEdit").select2({
		placeholder: "Input NIS Siswa",
		minimumInputLength: 6,
		maximumInputLength: 7,
		allowClear: false,
	});

	$(".findRekapNasabah").select2({
		placeholder: "Input NIS Siswa",
		minimumInputLength: 6,
		maximumInputLength: 7,
		allowClear: true,
	});

	$("#modalKredit").on("hidden.bs.modal", function () {
		window.bundleObj.resetOTPKredit();
		$("#inputNominalKredit").val("");
		$("#userKredit").html("username");
		$("#inputNISKredit").val("");
		$("#inputNIPKredit").val("");
		$("#inputCatatanKredit").val("");
		$("#userJumlahSaldo").html(0);
	});

	$("#modalDebet").on("hidden.bs.modal", function () {
		window.bundleObj.resetOTPDebet();
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
		window.bundleObj.resetOTPKreditEdit();

		var id_transaksi = $(this).data("id_transaksi");
		var nomor_transaksi = $(this).data("nomor_transaksi");
		var nis_siswa = $(this).data("nis_siswa");
		var nama_lengkap = $(this).data("nama_lengkap");
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

		$('[name="id_transaksi_kredit"]').val(id_transaksi);
		$('[name="nis_kredit"]').empty(0).append($("<option selected></option>").attr("value", nis_siswa).text("(" + nis_siswa + ") " + nama_lengkap));
		$('[name="th_ajaran_kredit"] option:selected').remove();
		$('[name="th_ajaran_kredit"]').prepend($("<option selected></option>").attr("value", id_th_ajaran).text(th_ajaran));
		$('[name="tingkat_kredit_edit"] option:selected').remove();
		$('[name="tingkat_kredit_edit"]').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));
		$('[name="nominal_kredit"]').val(nominal);
		$('[name="waktu_transaksi_kredit"]').val(waktu_transaksi)
		$('[name="catatan_kredit"]').val(catatan);

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_student_info/${nis_siswa}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_siswa']) {
					jumlah_saldo_awal = (Number(data['info_siswa'][0]['saldo_tabungan_umum']) - Number(data['info_tabungan'][0]['nominal']));
					jumlah_saldo_akhir = data['info_siswa'][0]['saldo_tabungan_umum'];
					id_tingkat = data['info_siswa'][0]['id_tingkat'];

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
					jumlah_saldo_awal = "-";
					jumlah_saldo_akhir = "-";
					nama_tingkat = "-";
				}

				if (data['info_tabungan'].length !== 0) {

					if (data['info_tabungan'][0]['catatan'] == "" || data['info_tabungan'][0]['catatan'] == null) {
						info_catatan = "-"
					} else {
						info_catatan = data['info_tabungan'][0]['catatan'];
					}
					info_waktu_transaksi = data['info_tabungan'][0]['waktu_transaksi'];
				} else {
					info_catatan = "-";
					info_waktu_transaksi = "-";
				}
			},
		});
		$("#nomorTransaksiKreditEdit").html("(" + nomor_transaksi + ")");

		$("#userNisKreditEdit").html(nis_siswa);
		$("#userNamaKreditEdit").html(nama_lengkap);
		$("#userTingkatKreditEdit").html(nama_tingkat);
		$("#infoTerakhirTransaksKreditEdit").html(info_waktu_transaksi);
		$("#userJumlahSaldoKreditEdit").html(CurrencyID(jumlah_saldo_awal));
		$("#userJumlahSaldoKreditEditNow").html(CurrencyID(jumlah_saldo_akhir));
	});

	$("#tb_transaksi").on("click", ".edit_transaksi_debet", function () {
		window.bundleObj.resetOTPDebetEdit();

		var id_transaksi = $(this).data("id_transaksi");
		var nis_siswa = $(this).data("nis_siswa");
		var nomor_transaksi = $(this).data("nomor_transaksi");
		var nama_lengkap = $(this).data("nama_lengkap");
		var id_tingkat = $(this).data("id_tingkat");
		var id_th_ajaran = $(this).data("id_th_ajaran");
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

		$('[name="id_transaksi_debet"]').val(id_transaksi);
		$('[name="nis_debet"]').empty(0).append($("<option selected></option>").attr("value", nis_siswa).text("(" + nis_siswa + ") " + nama_lengkap));
		$('[name="th_ajaran_debet"] option:selected').remove();
		$('[name="th_ajaran_debet"]').prepend($("<option selected></option>").attr("value", id_th_ajaran).text(th_ajaran));
		$('[name="tingkat_debet_edit"] option:selected').remove();
		$('[name="tingkat_debet_edit"]').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));
		$('[name="nominal_debet"]').val(nominal);
		$('[name="waktu_transaksi_debet"]').val(waktu_transaksi)
		$('[name="catatan_debet"]').val(catatan);

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_student_info/${nis_siswa}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_siswa']) {
					jumlah_saldo_awal = (Number(data['info_siswa'][0]['saldo_tabungan_umum']) + Number(data['info_tabungan'][0]['nominal']));
					jumlah_saldo_akhir = data['info_siswa'][0]['saldo_tabungan_umum'];
					id_tingkat = data['info_siswa'][0]['id_tingkat'];

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
					jumlah_saldo_awal = "-";
					jumlah_saldo_akhir = "-";
					nama_tingkat = "-";
				}

				if (data['info_tabungan'].length !== 0) {

					if (data['info_tabungan'][0]['catatan'] == "" || data['info_tabungan'][0]['catatan'] == null) {
						info_catatan = "-"
					} else {
						info_catatan = data['info_tabungan'][0]['catatan'];
					}
					info_waktu_transaksi = data['info_tabungan'][0]['waktu_transaksi'];
				} else {
					info_catatan = "-";
					info_waktu_transaksi = "-";
				}

			},
		});
		$("#nomorTransaksiDebetEdit").html("(" + nomor_transaksi + ")");

		$("#userNisDebetEdit").html(nis_siswa);
		$("#userNamaDebetEdit").html(nama_lengkap);
		$("#userTingkatDebetEdit").html(nama_tingkat);
		$("#infoTerakhirTransaksiDebetEdit").html(info_waktu_transaksi);
		$("#userJumlahSaldoDebetEdit").html(CurrencyID(jumlah_saldo_awal));
		$("#userJumlahSaldoDebetEditNow").html(CurrencyID(jumlah_saldo_akhir));

	});

	$("#tb_transaksi").on("click", ".cetak_transaksi_kredit", function () {

		var nomor_transaksi = $(this).data("nomor_transaksi");
		var nis_siswa = $(this).data("nis_siswa");
		var nama = $(this).data("nama_lengkap").toUpperCase();
		var jenjang = $(this).data("tingkat");
		var nominal = $(this).data("nominal").toString();
		var jenis_transaksi = $(this).data("jenis_transaksi");
		var waktu_transaksi = $(this).data("waktu_transaksi");
		var saldo_akhir = $(this).data("saldo").toString();
		var saldo_awal = (parseInt(saldo_akhir.replace(/\./g, "")) - parseInt(nominal.replace(/\./g, "")));

		window.bundle.getPrint("RUMAH AMANAH - SEKOLAH UTSMAN", HOST_URL + "uploads/data/rumah_amanah.png",
			"Jln. Lakarsantri Selatan 31-35", "Surabaya, Jawa Timur", "031-99424800", nis_siswa,
			nomor_transaksi, "UMUM", jenis_transaksi, waktu_transaksi, nominal, CurrencyID(saldo_awal.toString()), saldo_akhir, "SIMPAN STRUK INI", "UNTUK BUKTI TRANSAKSI", nama, jenjang, 'www.sekolahutsman.sch.id');

	});

	$("#tb_transaksi").on("click", ".cetak_transaksi_debet", function () {

		var nomor_transaksi = $(this).data("nomor_transaksi");
		var nis_siswa = $(this).data("nis_siswa");
		var nama = $(this).data("nama_lengkap").toUpperCase();
		var jenjang = $(this).data("tingkat");
		var nominal = $(this).data("nominal").toString();
		var jenis_transaksi = $(this).data("jenis_transaksi");
		var waktu_transaksi = $(this).data("waktu_transaksi");
		var saldo_akhir = $(this).data("saldo").toString();
		var saldo_awal = (parseInt(saldo_akhir.replace(/\./g, "")) + parseInt(nominal.replace(/\./g, "")));

		window.bundle.getPrint("RUMAH AMANAH - SEKOLAH UTSMAN", HOST_URL + "uploads/data/rumah_amanah.png",
			"Jln. Lakarsantri Selatan 31-35", "Surabaya, Jawa Timur", "031-99424800", nis_siswa,
			nomor_transaksi, "UMUM", jenis_transaksi, waktu_transaksi, nominal, CurrencyID(saldo_awal.toString()), saldo_akhir, "SIMPAN STRUK INI", "UNTUK BUKTI TRANSAKSI", nama, jenjang, 'www.sekolahutsman.sch.id');

	});

	$("#findNasabahKredit").on("change", function () {
		var nis = $("#findNasabahKredit").find(":selected").val();
		var nama = $("#findNasabahKredit").find(":selected").text();
		// var HOST_URL = "<?php echo base_url('admin/getMemberInfo/'); ?>" + nis;
		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_student_info/${nis}`,
			async: false,
			dataType: "JSON",
			success: function (data) {

				if (data['info_siswa'][0]) {

					jumlah_saldo = data['info_siswa'][0]['saldo_tabungan_umum'];
					id_tingkat = data['info_siswa'][0]['id_tingkat'];

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
					show_info_nasabah();
					hide_nasabah_div();

					$('#inputTingkatKredit').find(":selected").remove();
					$('#inputTingkatKredit').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));

				} else {
					jumlah_saldo = "-";
					nama_tingkat = "-";
				}

				if (data['info_tabungan'].length !== 0) {

					if (data['info_tabungan'][0]['catatan'] == "" || data['info_tabungan'][0]['catatan'] == null) {
						info_catatan = "-"
					} else {
						info_catatan = data['info_tabungan'][0]['catatan'];
					}
					info_waktu_transaksi = data['info_tabungan'][0]['waktu_transaksi'];
				} else {
					info_catatan = "-";
					info_waktu_transaksi = "-";
				}

			},
		});

		$("#userNisKredit").html(nis);
		$("#userNamaKredit").html(nama);
		$("#userTingkatKredit").html(nama_tingkat);
		$("#userCatatanKredit").html(info_catatan);
		$("#infoTerakhirTransaksiKredit").html(info_waktu_transaksi);
		$("#userJumlahSaldoKredit").html(CurrencyID(jumlah_saldo));
	});

	$("#findNasabahDebet").on("change", function () {
		var nis = $("#findNasabahDebet").find(":selected").val();
		var nama = $("#findNasabahDebet").find(":selected").text();
		// var HOST_URL = "<?php echo base_url('admin/getMemberInfo/'); ?>" + nis;
		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_student_info/${nis}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_siswa'][0]) {
					jumlah_saldo = data['info_siswa'][0]['saldo_tabungan_umum'];
					id_tingkat = data['info_siswa'][0]['id_tingkat'];

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
					jumlah_saldo = "-";
					nama_tingkat = "-";
				}
				if (data['info_tabungan'].length !== 0) {
					if (data['info_tabungan'][0]['catatan'] == "" || data['info_tabungan'][0]['catatan'] == null) {
						info_catatan = "-"
					} else {
						info_catatan = data['info_tabungan'][0]['catatan'];
					}
					info_waktu_transaksi = data['info_tabungan'][0]['waktu_transaksi'];
				} else {
					info_catatan = "-";
					info_waktu_transaksi = "-";
				}
			},
		});

		$('#inputTingkatDebet').find(":selected").remove();
		$('#inputTingkatDebet').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));

		$("#userNisDebet").html(nis);
		$("#userNamaDebet").html(nama);
		$("#userTingkatDebet").html(nama_tingkat);
		$("#userCatatanDebet").html(info_catatan);
		$("#infoTerakhirTransaksiDebet").html(info_waktu_transaksi);
		$("#userJumlahSaldoDebet").html(CurrencyID(jumlah_saldo));
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
					id_tingkat = data['info_siswa'][0]['id_tingkat'];

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
					jumlah_saldo_umum = "-";
					jumlah_saldo_qurban = "-";
					jumlah_saldo_wisata = "-";
					nama_tingkat = "-";
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

		$('[name="inputNISRekap"]').val(nis);
		$("#userNisRekap").html(nis);
		$("#userNamaRekap").html(nama[1].slice(0, -1));
		$("#userTingkatRekap").html(nama_tingkat);

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

	$("#btnKredit").on("click", function () {
		list_student();
	});

	$("#btnDebet").on("click", function () {
		list_student();
	});

	$("#btnRekap").on("click", function () {
		list_student();
	});

	$("#btnInputKredit").on("click", function () {
		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		var nis = $('#findNasabahKredit').find(":selected").val();
		var nama = $('#findNasabahKredit').find(":selected").text();
		var nominal = $("#inputNominalKredit").val();
		var tahun_ajaran = $("#inputTahunAjaranKredit").val();
		var jenis_tabungan = $("#inputJenisTabungan").val();
		var catatan = $("#inputCatatanKredit").val();
		var tanggal_transaksi = $("#inputTanggalKredit").val()
		var tingkat = $("#inputTingkatKredit").val();

		if (tingkat == "1") {
			var nama_tingkat = "KB";
		} else if (tingkat == "2") {
			var nama_tingkat = "TK";
		} else if (tingkat == "3") {
			var nama_tingkat = "SD";
		} else if (tingkat == "4") {
			var nama_tingkat = "SMP";
		} else if (tingkat == "6") {
			var nama_tingkat = "DC";
		}

		nominal = parseInt(nominal.replace(/\./g, ""));

		if (nominal != null && nominal >= 2000 && nominal != "" && nis != null && nis != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "" && jenis_tabungan != null && jenis_tabungan != "" && tingkat != null && tingkat != "") {

			if (window.bundleObj.getOTPKredit() === false) {
				Swal.fire({
					html: "<b>PIN</b> Anda Salah!.",
					icon: "error",
					buttonsStyling: false,
					confirmButtonText: "Oke!",
					customClass: {
						confirmButton: "btn font-weight-bold btn-primary"
					}
				}).then(function () {
					KTUtil.scrollTop();
				});
			} else {

				if (stat_close == true) {

					Swal.fire({
						title: "Peringatan!",
						html: "Apakah anda yakin ingin Menyetor Tabungan Umum atas nama <b>" + nama.toUpperCase() + "</b> dengan Nominal Rp." + nominal + " ?",
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
								url: `${HOST_URL}/finance/savings/post_credit`,
								dataType: "JSON",
								data: {
									nis: nis,
									nominal: nominal,
									tahun_ajaran: tahun_ajaran,
									id_tingkat: tingkat,
									jenis_tabungan: jenis_tabungan,
									catatan_kredit: catatan,
									tanggal_transaksi: tanggal_transaksi,
									pin_verification_kredit: $('[name="pin_verification_kredit"]').val(),
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
											showCancelButton: true,
											confirmButtonText: "Cetak Struk?",
											cancelButtonText: "Oke!",
											customClass: {
												confirmButton: "btn font-weight-bold btn-success mr-10",
												cancelButton: "btn btn-danger font-weight-bold"
											}
										}).then(function (result) {
											if (result.isConfirmed) {
												var saldo_awal = (parseInt(data.saldo_akhir) - parseInt(nominal));
												var only_name = $('#findNasabahKredit').find(":selected").text().split('(');

												window.bundle.getPrint("RUMAH AMANAH - SEKOLAH UTSMAN", HOST_URL + "uploads/data/rumah_amanah.png",
													"Jln. Lakarsantri Selatan 31-35", "Surabaya, Jawa Timur", "031-99424800", nis,
													data.nomor_transaksi, "UMUM", "KREDIT", data.waktu_transaksi, CurrencyID(nominal.toString()), CurrencyID(saldo_awal.toString()),
													CurrencyID(data.saldo_akhir.toString()), "SIMPAN STRUK INI", "UNTUK BUKTI TRANSAKSI", only_name[1].slice(0, -1), nama_tingkat, 'www.sekolahutsman.sch.id');
											}
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
							Swal.fire("Dibatalkan!", "Setoran Tabungan Umum atas nama <b>" + nama.toUpperCase() + "</b> batal diinputkan.", "error");
							return false;
						}
					});
				} else if (stat_close == false) {


					var nama_nasabah = $('#nama_nasabah').val();
					var nama_orangtua = $("#nama_orangtua").val();
					var nomor_hp_aktif = $("#nomor_hp_aktif").val();
					var email_orangtua = $("#email_orangtua").val();

					if (nama_nasabah != null && nama_nasabah != "" && jenis_tabungan != null && jenis_tabungan != "" && tingkat != null && tingkat != "") {

						Swal.fire({
							title: "Peringatan!",
							html: "Apakah anda yakin ingin MENYETOR TABUNGAN UMUM & MENAMBAH NASABAH BARU atas nama <b>" + nama_nasabah.toUpperCase() + " (" + nis + ")</b> dengan Nominal Rp." + nominal + " ?",
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
									url: `${HOST_URL}/finance/savings/post_credit_new_client`,
									dataType: "JSON",
									data: {
										nis: nis,
										nominal: nominal,
										id_tingkat: tingkat,
										tahun_ajaran: tahun_ajaran,
										jenis_tabungan: jenis_tabungan,
										catatan_kredit: catatan,
										tanggal_transaksi: tanggal_transaksi,
										nama_nasabah: nama_nasabah,
										nama_orangtua: nama_orangtua,
										nomor_hp_aktif: nomor_hp_aktif,
										email_orangtua: email_orangtua,
										pin_verification_kredit: $('[name="pin_verification_kredit"]').val(),
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
												showCancelButton: true,
												confirmButtonText: "Cetak Struk?",
												cancelButtonText: "Oke!",
												customClass: {
													confirmButton: "btn font-weight-bold btn-success mr-10",
													cancelButton: "btn btn-danger font-weight-bold"
												}
											}).then(function (result) {
												if (result.isConfirmed) {
													var saldo_awal = (parseInt(data.saldo_akhir) - parseInt(nominal));
													var only_name = $('#findNasabahKredit').find(":selected").text().split('(');

													window.bundle.getPrint("RUMAH AMANAH - SEKOLAH UTSMAN", HOST_URL + "uploads/data/rumah_amanah.png",
														"Jln. Lakarsantri Selatan 31-35", "Surabaya, Jawa Timur", "031-99424800", nis,
														data.nomor_transaksi, "UMUM", "KREDIT", data.waktu_transaksi, CurrencyID(nominal.toString()), CurrencyID(saldo_awal.toString()),
														CurrencyID(data.saldo_akhir.toString()), "SIMPAN STRUK INI", "UNTUK BUKTI TRANSAKSI", only_name[1].slice(0, -1), nama_tingkat, 'www.sekolahutsman.sch.id');
												}
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
								Swal.fire("Dibatalkan!", "Setoran Tabungan Umum & Tambah Nasabah Baru atas nama <b>" + nama.toUpperCase() + " (" + nis + ")</b> batal diinputkan.", "error");
								return false;
							}
						});
					} else {
						Swal.fire({
							html: "Opps!, Pastikan Semua Inputan Terisi dengan Benar, Silahkan input ulang.",
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

				}
				return false;
			}
		} else {
			Swal.fire({
				html: "Opps!, Pastikan Semua Inputan Terisi dengan Benar & Nominal Tidak Boleh < 2000, Silahkan input ulang.",
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

		var id_transaksi = $('[name="id_transaksi_kredit"]').val();
		var nis = $('[name="nis_kredit"]').find(":selected").val();
		var nama = $('[name="nis_kredit"]').find(":selected").text();
		var nominal = $('[name="nominal_kredit"]').val();
		var tahun_ajaran = $('[name="th_ajaran_kredit"]').val();
		var catatan = $('[name="catatan_kredit"]').val();
		var tanggal_transaksi = $('[name="waktu_transaksi_kredit"]').val();
		var tingkat = $('[name="tingkat_kredit_edit"]').val();

		if (tingkat == "1") {
			var nama_tingkat = "KB";
		} else if (tingkat == "2") {
			var nama_tingkat = "TK";
		} else if (tingkat == "3") {
			var nama_tingkat = "SD";
		} else if (tingkat == "4") {
			var nama_tingkat = "SMP";
		} else if (tingkat == "6") {
			var nama_tingkat = "DC";
		}

		nominal = parseInt(nominal.replace(/\./g, ""));

		if (nominal != null && nominal >= 2000 && nominal != "" && nis != null && nis != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "" && tingkat != null && tingkat != "") {

			if (window.bundleObj.getOTPKreditEdit() === false) {
				Swal.fire({
					html: "<b>PIN</b> Anda Salah!.",
					icon: "error",
					buttonsStyling: false,
					confirmButtonText: "Oke!",
					customClass: {
						confirmButton: "btn font-weight-bold btn-primary"
					}
				}).then(function () {
					KTUtil.scrollTop();
				});

			} else {

				Swal.fire({
					title: "Peringatan!",
					html: "Apakah anda yakin Update Kredit Tabungan Umum atas nama <b>" + nama.toUpperCase() + "</b> dengan Nominal Rp." + nominal + " ?",
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
							url: `${HOST_URL}/finance/savings/update_credit`,
							dataType: "JSON",
							data: {
								id_transaksi: id_transaksi,
								nis: nis,
								id_tingkat: tingkat,
								nominal: nominal,
								tahun_ajaran: tahun_ajaran,
								catatan_kredit: catatan,
								tanggal_transaksi: tanggal_transaksi,
								pin_verification_kredit_edit: $('[name="pin_verification_kredit_edit"]').val(),
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
										showCancelButton: true,
										confirmButtonText: "Cetak Struk?",
										cancelButtonText: "Oke!",
										customClass: {
											confirmButton: "btn font-weight-bold btn-success mr-10",
											cancelButton: "btn btn-danger font-weight-bold"
										}
									}).then(function (result) {
										if (result.isConfirmed) {
											var saldo_awal = (parseInt(data.saldo_akhir) - parseInt(nominal));
											var only_name = $('[name="nis_kredit"]').find(":selected").text().split(')');

											window.bundle.getPrint("RUMAH AMANAH - SEKOLAH UTSMAN", HOST_URL + "uploads/data/rumah_amanah.png",
												"Jln. Lakarsantri Selatan 31-35", "Surabaya, Jawa Timur", "031-99424800", nis,
												data.nomor_transaksi, "UMUM", "KREDIT", data.waktu_transaksi, CurrencyID(nominal.toString()), CurrencyID(saldo_awal.toString()),
												CurrencyID(data.saldo_akhir.toString()), "SIMPAN STRUK INI", "UNTUK BUKTI TRANSAKSI", only_name[1].slice(1), nama_tingkat, 'www.sekolahutsman.sch.id');
										}
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
						Swal.fire("Dibatalkan!", "Edit Setoran Tabungan Umum atas nama <b>" + nama.toUpperCase() + "</b> batal diubah.", "error");
						return false;
					}
				});
				return false;
			}
		} else {
			Swal.fire({
				html: "Opps!, Pastikan Inputan Terisi dengan Benar &  Nominal Tidak Boleh < 2000 dan Kosong, Silahkan input ulang.",
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

		var nis = $('#findNasabahDebet').find(":selected").val();
		var nama = $('#findNasabahDebet').find(":selected").text();
		var saldo = document.getElementById("userJumlahSaldoDebet").textContent;
		var nominal = $("#inputNominalDebet").val();
		var catatan = $("#inputCatatanDebet").val();
		var tahun_ajaran = $("#inputTahunAjaranDebet").val();
		var tanggal_transaksi = $("#inputTanggalDebet").val();
		var tingkat = $("#inputTingkatDebet").val();

		if (tingkat == "1") {
			var nama_tingkat = "KB";
		} else if (tingkat == "2") {
			var nama_tingkat = "TK";
		} else if (tingkat == "3") {
			var nama_tingkat = "SD";
		} else if (tingkat == "4") {
			var nama_tingkat = "SMP";
		} else if (tingkat == "6") {
			var nama_tingkat = "DC";
		}

		nominal = parseInt(nominal.replace(/\./g, ""));
		saldo = parseInt(saldo.replace(/\./g, ""));

		if (nominal <= saldo) {

			if (nominal != null && nominal >= 2000 && nominal != "" && nis != null && nis != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "" && tingkat != null && tingkat != "") {

				if (window.bundleObj.getOTPDebet() === false) {
					Swal.fire({
						html: "<b>PIN</b> Anda Salah!.",
						icon: "error",
						buttonsStyling: false,
						confirmButtonText: "Oke!",
						customClass: {
							confirmButton: "btn font-weight-bold btn-primary"
						}
					}).then(function () {
						KTUtil.scrollTop();
					});

				} else {

					Swal.fire({
						title: "Peringatan!",
						html: "Apakah anda yakin Menarik Tabungan Umum atas nama <b>" + nama.toUpperCase() + "</b> dengan Nominal Rp." + nominal + " ?",
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
								url: `${HOST_URL}/finance/savings/post_debet`,
								dataType: "JSON",
								data: {
									nis: nis,
									nominal: nominal,
									id_tingkat: tingkat,
									tahun_ajaran: tahun_ajaran,
									catatan_debet: catatan,
									tanggal_transaksi: tanggal_transaksi,
									pin_verification_debet: $('[name="pin_verification_debet"]').val(),
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
											showCancelButton: true,
											confirmButtonText: "Cetak Struk?",
											cancelButtonText: "Oke!",
											customClass: {
												confirmButton: "btn font-weight-bold btn-success mr-10",
												cancelButton: "btn btn-danger font-weight-bold"
											}
										}).then(function (result) {
											if (result.isConfirmed) {
												var saldo_awal = (parseInt(data.saldo_akhir) + parseInt(nominal));
												var only_name = $('#findNasabahDebet').find(":selected").text().split('(');

												window.bundle.getPrint("RUMAH AMANAH - SEKOLAH UTSMAN", HOST_URL + "uploads/data/rumah_amanah.png",
													"Jln. Lakarsantri Selatan 31-35", "Surabaya, Jawa Timur", "031-99424800", nis,
													data.nomor_transaksi, "UMUM", "DEBET", data.waktu_transaksi, CurrencyID(nominal.toString()), CurrencyID(saldo_awal.toString()),
													CurrencyID(data.saldo_akhir.toString()), "SIMPAN STRUK INI", "UNTUK BUKTI TRANSAKSI", only_name[1].slice(0, -1), nama_tingkat, 'www.sekolahutsman.sch.id');
											}
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
							Swal.fire("Dibatalkan!", "Penarikan Tabungan Umum atas nama <b>" + nama.toUpperCase() + "</b> batal diubah.", "error");
							return false;
						}
					});

					return false;
				}
			} else {
				Swal.fire({
					html: "Opps!, Pastikan Inputan Terisi dengan Benar & Nominal Tidak Boleh < 2000 dan Kosong, Silahkan input ulang.",
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
				html: "Opps!, Pastikan Nominal Penarikan Tidak Boleh Lebih dari Saldo Tabungan, Silahkan input ulang.",
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

		var id_transaksi = $('[name="id_transaksi_debet"]').val();
		var nis = $('[name="nis_debet"]').find(":selected").val();
		var nama = $('[name="nis_debet"]').find(":selected").text();
		var nominal = $('[name="nominal_debet"]').val();
		var tahun_ajaran = $('[name="th_ajaran_debet"]').val();
		var catatan = $('[name="catatan_debet"]').val();
		var tanggal_transaksi = $('[name="waktu_transaksi_debet"]').val()
		var tingkat = $('[name="tingkat_debet_edit"]').val()
		var saldo = document.getElementById("userJumlahSaldoDebetEdit").textContent;

		if (tingkat == "1") {
			var nama_tingkat = "KB";
		} else if (tingkat == "2") {
			var nama_tingkat = "TK";
		} else if (tingkat == "3") {
			var nama_tingkat = "SD";
		} else if (tingkat == "4") {
			var nama_tingkat = "SMP";
		} else if (tingkat == "6") {
			var nama_tingkat = "DC";
		}

		nominal = parseInt(nominal.replace(/\./g, ""));
		saldo = parseInt(saldo.replace(/\./g, ""));

		if (nominal <= saldo) {

			if (nominal != null && nominal >= 2000 && nominal != "" && nis != null && nis != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "" && tingkat != null && tingkat != "") {

				if (window.bundleObj.getOTPDebetEdit() === false) {
					Swal.fire({
						html: "<b>PIN</b> Anda Salah!.",
						icon: "error",
						buttonsStyling: false,
						confirmButtonText: "Oke!",
						customClass: {
							confirmButton: "btn font-weight-bold btn-primary"
						}
					}).then(function () {
						KTUtil.scrollTop();
					});

				} else {

					Swal.fire({
						title: "Peringatan!",
						html: "Apakah anda yakin Update Penarikan Tabungan Umum atas nama <b>" + nama.toUpperCase() + "</b> dengan Nominal Rp." + nominal + " ?",
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
								url: `${HOST_URL}/finance/savings/update_debet`,
								dataType: "JSON",
								data: {
									id_transaksi: id_transaksi,
									nis: nis,
									id_tingkat: tingkat,
									nominal: nominal,
									tahun_ajaran: tahun_ajaran,
									catatan_debet: catatan,
									tanggal_transaksi: tanggal_transaksi,
									pin_verification_debet_edit: $('[name="pin_verification_debet_edit"]').val(),
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
											showCancelButton: true,
											confirmButtonText: "Cetak Struk?",
											cancelButtonText: "Oke!",
											customClass: {
												confirmButton: "btn font-weight-bold btn-success mr-10",
												cancelButton: "btn btn-danger font-weight-bold"
											}
										}).then(function (result) {
											if (result.isConfirmed) {
												var saldo_awal = (parseInt(data.saldo_akhir) + parseInt(nominal));
												var only_name = $('[name="nis_debet"]').find(":selected").text().split(')');

												window.bundle.getPrint("RUMAH AMANAH - SEKOLAH UTSMAN", HOST_URL + "uploads/data/rumah_amanah.png",
													"Jln. Lakarsantri Selatan 31-35", "Surabaya, Jawa Timur", "031-99424800", nis,
													data.nomor_transaksi, "UMUM", "DEBET", data.waktu_transaksi, CurrencyID(nominal.toString()), CurrencyID(saldo_awal.toString()),
													CurrencyID(data.saldo_akhir.toString()), "SIMPAN STRUK INI", "UNTUK BUKTI TRANSAKSI", only_name[1].slice(1), nama_tingkat, 'www.sekolahutsman.sch.id');
											}
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
									show_transaksi(); $("#table_transcation").DataTable().destroy();
									datatable_init();
								},
							});
						} else {
							Swal.fire("Dibatalkan!", "Edit Penarikan Tabungan Umum atas nama <b>" + nama.toUpperCase() + "</b> batal diubah.", "error");
							return false;
						}
					});

					return false;
				}
			} else {
				Swal.fire({
					html: "Opps!, Pastikan Inputan Terisi dengan Benar & Nominal Tidak Boleh < 2000 dan Kosong, Silahkan input ulang.",
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
				html: "Opps!, Pastikan Nominal Penarikan Tidak Boleh Lebih dari Saldo Tabungan, Silahkan input ulang.",
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
			url: `${HOST_URL}/finance/savings/get_all_transaction`,
			async: false,
			data: {
				start_date: lstart,
				end_date: lend,
			},
			dataType: "JSON",
			success: function (data) {
				var html = "";

				for (var i = 0; i < data.length; i++) {

					if (data[i].jenis_tabungan == "1") {
						var color_tabungan = "text-success";
						var jenis_tabungan = "UMUM"
					} else if (data[i].jenis_tabungan == "2") {
						var color_tabungan = "text-warning";
						var jenis_tabungan = "QURBAN"
					} else if (data[i].jenis_tabungan == "3") {
						var color_tabungan = "text-danger";
						var jenis_tabungan = "WISATA"
					}

					if (data[i].status_kredit_debet == "1") {
						var bg_color = "bg-light-success";
						var jenis_transaksi = "KREDIT"
						var debet = "0";
						var kredit = CurrencyID(data[i].nominal);
					}
					else if (data[i].status_kredit_debet == "2") {
						var bg_color = "bg-light-danger";
						var jenis_transaksi = "DEBET"
						var debet = CurrencyID(data[i].nominal);
						var kredit = "0";
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

					if (data[i].saldo != null) {
						var saldo = CurrencyID(data[i].saldo);
					} else if (data[i].saldo == null) {
						var saldo = CurrencyID(0);
					}

					if (data[i].status_edit == 1) {

						if (data[i].status_kredit_debet == "1") {
							var option = "<div class='dropdown dropdown-inline'>" +
								"<a href='javascript:;' class='btn btn-xs  btn-clean btn-icon btn-primary' data-toggle='dropdown'>" +
								"<i class='la la-cog'></i>" +
								"</a>" +
								"<div class='dropdown-menu dropdown-menu-sm dropdown-menu-right'>" +
								"<ul class='nav nav-hover flex-column'>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link edit_transaksi_kredit' data-id_transaksi='" +
								data[i].id_transaksi_umum + "' data-nis_siswa='" + data[i].nis_siswa + "' data-nama_lengkap='" + data[i].nama_lengkap + "' data-id_tingkat='" + data[i].id_tingkat + "' data-nomor_transaksi='" + data[i].nomor_transaksi_umum +
								"' data-jenis_transaksi='" + jenis_transaksi + "' data-id_th_ajaran='" + data[i].th_ajaran + "' data-th_ajaran='" + data[i].tahun_ajaran + "' data-nominal='" + data[i].nominal + "' data-waktu_transaksi='" + data[i].tanggal_transaksi + "' data-catatan='" + data[i].catatan +
								"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit</span></a></li>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link cetak_transaksi_kredit'" +
								"' data-nis_siswa='" + data[i].nis_siswa + "' data-nomor_transaksi='" + data[i].nomor_transaksi_umum + "' data-nama_lengkap='" + data[i].nama_lengkap + "' data-tingkat='" + nama_tingkat +
								"' data-jenis_transaksi='" + jenis_transaksi + "' data-saldo='" + saldo + "' data-nominal='" + CurrencyID(data[i].nominal) + "' data-waktu_transaksi='" + data[i].waktu_transaksi +
								"' href='javascript:void(0);'><i class='nav-icon la la-print text-success'></i><span class='nav-text text-success font-weight-bold text-hover-primary'>Cetak</span></a></li>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link delete_transaksi_kredit' data-id_transaksi='" +
								data[i].id_transaksi_umum + "' data-nis_siswa='" + data[i].nis_siswa + "' data-nama_lengkap='" + data[i].nama_lengkap + "' data-id_tingkat='" + data[i].id_tingkat + "' data-nomor_transaksi='" + data[i].nomor_transaksi_umum +
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
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link edit_transaksi_debet' data-id_transaksi='" +
								data[i].id_transaksi_umum + "' data-nis_siswa='" + data[i].nis_siswa + "' data-nama_lengkap='" + data[i].nama_lengkap + "' data-id_tingkat='" + data[i].id_tingkat + "' data-nomor_transaksi='" + data[i].nomor_transaksi_umum +
								"' data-jenis_transaksi='" + jenis_transaksi + "' data-id_th_ajaran='" + data[i].th_ajaran + "' data-th_ajaran='" + data[i].tahun_ajaran + "' data-nominal='" + data[i].nominal + "' data-waktu_transaksi='" + data[i].tanggal_transaksi + "' data-catatan='" + data[i].catatan +
								"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit</span></a></li>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link cetak_transaksi_debet'" +
								"' data-nis_siswa='" + data[i].nis_siswa + "' data-nomor_transaksi='" + data[i].nomor_transaksi_umum + "' data-nama_lengkap='" + data[i].nama_lengkap + "' data-tingkat='" + nama_tingkat +
								"' data-jenis_transaksi='" + jenis_transaksi + "' data-saldo='" + saldo + "' data-nominal='" + CurrencyID(data[i].nominal) + "' data-waktu_transaksi='" + data[i].waktu_transaksi +
								"' href='javascript:void(0);'><i class='nav-icon la la-print text-success'></i><span class='nav-text text-success font-weight-bold text-hover-primary'>Cetak</span></a></li>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link delete_transaksi_debet' data-id_transaksi='" +
								data[i].id_transaksi_umum + "' data-nis_siswa='" + data[i].nis_siswa + "' data-nama_lengkap='" + data[i].nama_lengkap + "' data-id_tingkat='" + data[i].id_tingkat + "' data-nomor_transaksi='" + data[i].nomor_transaksi_umum +
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
						`${data[i].id_transaksi_umum}` +
						"</td>" +
						"<td class='font-weight-bolder text-danger'>" +
						`${data[i].nomor_transaksi_umum}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${data[i].nis_siswa}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${data[i].nama_lengkap.toUpperCase()}` +
						"</td>" +
						"<td>" +
						`${data[i].waktu_transaksi}` +
						"</td>" +
						"<td>" +
						`${data[i].tahun_ajaran}` +
						"</td>" +
						"<td class=''><b>" +
						`${nama_tingkat}` +
						"</b></td>" +
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
		var nomor_transaksi = $(this).data("nomor_transaksi");
		var nominal = $(this).data("nominal");

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
			html: "Apakah anda yakin ingin menghapus Transaksi Umum <b>" + nomor_transaksi + "</b> (" + jenis_transaksi + ") atas nama <b>'" +
				nama_siswa.toUpperCase() + "'</b> (" + nis_siswa + ") dengan nominal Kredit (Rp. " + nominal + ") ? <br></br> <div id='recaptcha_delete'></div>",
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
					url: `${HOST_URL}/finance/savings/delete_credit_transaction`,
					data: {
						id_transaksi: id_transaksi,
						nomor_transaksi: nomor_transaksi,
						nis: nis_siswa,
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
								KTUtil.scrollTop();
							});

							$("#table_transcation").DataTable().destroy();
							datatable_init();
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
				Swal.fire("Dibatalkan!", "Penghapusan Transaksi Umum <b>" + nomor_transaksi + "</b> (" + jenis_transaksi + ")  atas nama <b>'" + nama_siswa.toUpperCase() + "'</b> (" + nis_siswa + ") batal dihapus.", "error");
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
		var nomor_transaksi = $(this).data("nomor_transaksi");
		var nominal = $(this).data("nominal");

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
			html: "Apakah anda yakin ingin menghapus Transaksi Umum <b>" + nomor_transaksi + "</b> (" + jenis_transaksi + ") atas nama <b>'" +
				nama_siswa.toUpperCase() + "'</b> (" + nis_siswa + ") dengan nominal Debet (Rp. " + nominal + ") ? <br></br> <div id='recaptcha_delete'></div>",
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
					url: `${HOST_URL}/finance/savings/delete_debet_transaction`,
					data: {
						id_transaksi: id_transaksi,
						nomor_transaksi: nomor_transaksi,
						nis: nis_siswa,
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
								KTUtil.scrollTop();
							});

							$("#table_transcation").DataTable().destroy();
							datatable_init();
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
				Swal.fire("Dibatalkan!", "Penghapusan Transaksi Umum <b>" + nomor_transaksi + "</b> (" + jenis_transaksi + ") atas nama <b>'" + nama_siswa.toUpperCase() + "'</b> (" + nis_siswa + ") batal dihapus.", "error");

				return false;
			}
		});

	});


});

function show_nasabah_div() {
	var x = document.getElementById("add_new_nasabah");
	x.style.display = "block";
	hide_info_nasabah();
}

function hide_nasabah_div() {
	var x = document.getElementById("add_new_nasabah");
	x.style.display = "none";
}

function show_info_nasabah() {
	var x = document.getElementById("info_nasabah");
	x.style.display = "block";
}

function hide_info_nasabah() {
	var x = document.getElementById("info_nasabah");
	x.style.display = "none";
}




