$(document).ready(function () {
	var start = moment().subtract(29, 'days');
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
		var csrfHash = $('.txt_csrfname').val(); // CSRF 

		var nis = $("#findNasabahKredit").find(":selected").val();
		var nama = $("#findNasabahKredit").find(":selected").text();

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
			url: `${HOST_URL}/finance/report/export_data_csv_transaction_recap_all`,
			dataType: "JSON",
			data: {
				data_check: rows_selected.join(","),
				date_range: date_range,
				nama_siswa: nama,
				[csrfName]: csrfHash
			},
			success: function (data) {
				// Update CSRF hash
				KTApp.unblockPage();

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
		var nis = $("#findNasabahKredit").find(":selected").val();
		var nama = $("#findNasabahKredit").find(":selected").text();

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
			url: `${HOST_URL}/finance/report/print_data_pdf_transaction_recap_all`,
			data: {
				data_check: rows_selected.join(","),
				date_range: date_range,
				nama_siswa: nama
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


	$(".findNasabahKredit").select2({
		placeholder: "Input NIS Siswa",
		minimumInputLength: 5,
		maximumInputLength: 6,
		allowClear: false,
	});

	$(".findNasabahDebet").select2({
		placeholder: "Input NIS Siswa",
		minimumInputLength: 5,
		maximumInputLength: 6,
		allowClear: false,
	});

	$(".findNasabahKreditEdit").select2({
		placeholder: "Input NIS Siswa",
		minimumInputLength: 5,
		maximumInputLength: 6,
		allowClear: false,
	});

	$(".findNasabahDebetEdit").select2({
		placeholder: "Input NIS Siswa",
		minimumInputLength: 5,
		maximumInputLength: 6,
		allowClear: false,
	});

	$("#tb_transaksi").on("click", ".edit_transaksi_kredit", function () {

		var id_transaksi = $(this).data("id_transaksi");
		var nis_siswa = $(this).data("nis_siswa");
		var nama_lengkap = $(this).data("nama_lengkap");
		var nomor_transaksi = $(this).data("nomor_transaksi");
		var id_th_ajaran = $(this).data("id_th_ajaran");
		var th_ajaran = $(this).data("th_ajaran");
		var id_tingkat = $(this).data("id_tingkat");
		var nominal = $(this).data("nominal");
		var jenis_tabungan = $(this).data("jenis_tabungan");
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
		$('[name="nis_kredit"]').empty(0).append($("<option selected></option>").attr("value", nis_siswa).text(nama_lengkap));
		$('[name="th_ajaran_kredit"] option:selected').remove();
		$('[name="th_ajaran_kredit"]').prepend($("<option selected></option>").attr("value", id_th_ajaran).text(th_ajaran));
		$('[name="tingkat_kredit_edit"] option:selected').remove();
		$('[name="tingkat_kredit_edit"]').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));
		$('[name="nominal_kredit"]').val(nominal);
		$('[name="waktu_transaksi_kredit"]').val(waktu_transaksi)
		$('[name="catatan_kredit"]').val(catatan);

		if (jenis_tabungan == "1") {
			$('[name="jenis_tabungan_kredit"] option:selected').remove();
			$('[name="jenis_tabungan_kredit"]').empty().append($("<option selected></option>").attr("value", jenis_tabungan).text("UMUM"));

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
		} else if (jenis_tabungan == "2") {
			$('[name="jenis_tabungan_kredit"] option:selected').remove();
			$('[name="jenis_tabungan_kredit"]').empty().append($("<option selected></option>").attr("value", jenis_tabungan).text("QURBAN"));

			$.ajax({
				type: "GET",
				url: `${HOST_URL}/finance/savings/get_student_qurban_info/${nis_siswa}`,
				async: false,
				dataType: "JSON",
				success: function (data) {
					if (data['info_siswa']) {
						jumlah_saldo_awal = (Number(data['info_siswa'][0]['saldo_tabungan_qurban']) - Number(data['info_tabungan'][0]['nominal']));
						jumlah_saldo_akhir = data['info_siswa'][0]['saldo_tabungan_qurban'];
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
		} else if (jenis_tabungan == "3") {
			$('[name="jenis_tabungan_kredit"] option:selected').remove();
			$('[name="jenis_tabungan_kredit"]').empty().append($("<option selected></option>").attr("value", jenis_tabungan).text("WISATA"));

			$.ajax({
				type: "GET",
				url: `${HOST_URL}/finance/savings/get_student_tour_info/${nis_siswa}`,
				async: false,
				dataType: "JSON",
				success: function (data) {
					if (data['info_siswa']) {
						jumlah_saldo_awal = (Number(data['info_siswa'][0]['saldo_tabungan_wisata']) - Number(data['info_tabungan'][0]['nominal']));
						jumlah_saldo_akhir = data['info_siswa'][0]['saldo_tabungan_wisata'];
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
		}
		$("#nomorTransaksiKreditEdit").html("(" + nomor_transaksi + ")");

		$("#userNisKreditEdit").html(nis_siswa);
		$("#userNamaKreditEdit").html(nama_lengkap);
		$("#userTingkatKreditEdit").html(nama_tingkat);
		$("#infoTerakhirTransaksiKreditEdit").html(info_waktu_transaksi);
		$("#userJumlahSaldoKreditEdit").html(CurrencyID(jumlah_saldo_awal));
		$("#userJumlahSaldoKreditEditNow").html(CurrencyID(jumlah_saldo_akhir));
	});

	$("#tb_transaksi").on("click", ".edit_transaksi_debet", function () {

		var id_transaksi = $(this).data("id_transaksi");
		var nis_siswa = $(this).data("nis_siswa");
		var nomor_transaksi = $(this).data("nomor_transaksi");
		var nama_lengkap = $(this).data("nama_lengkap");
		var id_th_ajaran = $(this).data("id_th_ajaran");
		var id_tingkat = $(this).data("id_tingkat");
		var th_ajaran = $(this).data("th_ajaran");
		var nominal = $(this).data("nominal");
		var waktu_transaksi = $(this).data("waktu_transaksi");
		var jenis_tabungan = $(this).data("jenis_tabungan");
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
		$('[name="nis_debet"]').empty(0).append($("<option selected></option>").attr("value", nis_siswa).text(nama_lengkap));
		$('[name="th_ajaran_debet"] option:selected').remove();
		$('[name="th_ajaran_debet"]').prepend($("<option selected></option>").attr("value", id_th_ajaran).text(th_ajaran));
		$('[name="tingkat_debet_edit"] option:selected').remove();
		$('[name="tingkat_debet_edit"]').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));
		$('[name="nominal_debet"]').val(nominal);
		$('[name="waktu_transaksi_debet"]').val(waktu_transaksi)
		$('[name="catatan_debet"]').val(catatan);

		if (jenis_tabungan == "1") {
			$('[name="jenis_tabungan_debet"] option:selected').remove();
			$('[name="jenis_tabungan_debet"]').empty().append($("<option selected></option>").attr("value", jenis_tabungan).text("UMUM"));

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
						info_kelas = "-";
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

		}
		else if (jenis_tabungan == "2") {
			$('[name="jenis_tabungan_debet"] option:selected').remove();
			$('[name="jenis_tabungan_debet"]').empty().append($("<option selected></option>").attr("value", jenis_tabungan).text("QURBAN"));

			$.ajax({
				type: "GET",
				url: `${HOST_URL}/finance/savings/get_student_qurban_info/${nis_siswa}`,
				async: false,
				dataType: "JSON",
				success: function (data) {
					if (data['info_siswa']) {
						jumlah_saldo_awal = (Number(data['info_siswa'][0]['saldo_tabungan_qurban']) + Number(data['info_tabungan'][0]['nominal']));
						jumlah_saldo_akhir = data['info_siswa'][0]['saldo_tabungan_qurban'];
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

		}
		else if (jenis_tabungan == "3") {
			$('[name="jenis_tabungan_debet"] option:selected').remove();
			$('[name="jenis_tabungan_debet"]').empty().append($("<option selected></option>").attr("value", jenis_tabungan).text("WISATA"));

			$.ajax({
				type: "GET",
				url: `${HOST_URL}/finance/savings/get_student_tour_info/${nis_siswa}`,
				async: false,
				dataType: "JSON",
				success: function (data) {
					if (data['info_siswa']) {
						jumlah_saldo_awal = (Number(data['info_siswa'][0]['saldo_tabungan_wisata']) + Number(data['info_tabungan'][0]['nominal']));
						jumlah_saldo_akhir = data['info_siswa'][0]['saldo_tabungan_wisata'];
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

		}

		$("#nomorTransaksiDebetEdit").html("(" + nomor_transaksi + ")");

		$("#userNisDebetEdit").html(nis_siswa);
		$("#userNamaDebetEdit").html(nama_lengkap);
		$("#userTingkatDebetEdit").html(nama_tingkat);
		$("#infoTerakhirTransaksiDebetEdit").html(info_waktu_transaksi);
		$("#userJumlahSaldoDebetEdit").html(CurrencyID(jumlah_saldo_awal));
		$("#userJumlahSaldoDebetEditNow").html(CurrencyID(jumlah_saldo_akhir));

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
				if (data['info_siswa']) {
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

		$('#inputTingkatKredit').find(":selected").remove();
		$('#inputTingkatKredit').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));

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
				if (data['info_siswa']) {
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

	function CurrencyID(nominal) {
		var formatter = new Intl.NumberFormat("id-ID", {
			currency: "IDR",
			minimumFractionDigits: 0,
		});
		return formatter.format(nominal);
	}

	$("#btnKredit").on("click", function () {
		$('#inputJenisTabunganKredit').prop('selectedIndex', 0);
		get_student_kredit();
	});

	$("#btnDebet").on("click", function () {
		$('#inputJenisTabunganDebet').prop('selectedIndex', 0);
		get_student_debet();
	});

	$("#btnInputKredit").on("click", function () {

		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		var nis = $('#findNasabahKredit').find(":selected").val();
		var nama = $('#findNasabahKredit').find(":selected").text();
		var nominal = $("#inputNominalKredit").val();
		var tahun_ajaran = $("#inputTahunAjaranKredit").val();
		var catatan = $("#inputCatatanKredit").val();
		var tanggal_transaksi = $("#inputTanggalKredit").val()
		var jenis_tabungan = $('#inputJenisTabunganKredit').find(":selected").val();
		var tingkat = $("#inputTingkatKredit").val();

		nominal = parseInt(nominal.replace(/\./g, ""));

		if (nominal != null && nominal >= 5000 && nominal != "" && nis != null && nis != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "" && jenis_tabungan != "" && jenis_tabungan != null) {

			if (jenis_tabungan == '1') {

				nama_jenis_tabungan = "UMUM";

				Swal.fire({
					title: "Peringatan!",
					text: "Apakah anda yakin ingin Menyetor Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
								catatan_kredit: catatan,
								jenis_tabungan: jenis_tabungan,
								tanggal_transaksi: tanggal_transaksi,
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
						Swal.fire("Dibatalkan!", "Setoran Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") batal diinputkan.", "error");
						return false;
					}
				});

				return false;

			} else if (jenis_tabungan == '2') {
				nama_jenis_tabungan = "QURBAN";

				Swal.fire({
					title: "Peringatan!",
					text: "Apakah anda yakin ingin Menyetor Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
							url: `${HOST_URL}/finance/savings/post_qurban_credit`,
							dataType: "JSON",
							data: {
								nis: nis,
								nominal: nominal,
								tahun_ajaran: tahun_ajaran,
								id_tingkat: tingkat,
								catatan_kredit: catatan,
								jenis_tabungan: jenis_tabungan,
								tanggal_transaksi: tanggal_transaksi,
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
						Swal.fire("Dibatalkan!", "Setoran Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") batal diinputkan.", "error");
						return false;
					}
				});
				return false;

			} else if (jenis_tabungan == '3') {
				nama_jenis_tabungan = "WISATA";

				Swal.fire({
					title: "Peringatan!",
					text: "Apakah anda yakin ingin Menyetor Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
							url: `${HOST_URL}/finance/savings/post_tour_credit`,
							dataType: "JSON",
							data: {
								nis: nis,
								nominal: nominal,
								tahun_ajaran: tahun_ajaran,
								id_tingkat: tingkat,
								catatan_kredit: catatan,
								jenis_tabungan: jenis_tabungan,
								tanggal_transaksi: tanggal_transaksi,
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
						Swal.fire("Dibatalkan!", "Setoran Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") batal diinputkan.", "error");
						return false;
					}
				});
				return false;
			}
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

		var id_transaksi = $('[name="id_transaksi_kredit"]').val();
		var nis = $('[name="nis_kredit"]').find(":selected").val();
		var nama = $('[name="nis_kredit"]').find(":selected").text();
		var nominal = $('[name="nominal_kredit"]').val();
		var jenis_tabungan = $('[name="jenis_tabungan_kredit"]').val();
		var tahun_ajaran = $('[name="th_ajaran_kredit"]').val();
		var catatan = $('[name="catatan_kredit"]').val();
		var tanggal_transaksi = $('[name="waktu_transaksi_kredit"]').val()
		var tingkat = $('[name="tingkat_kredit_edit"]').val()

		nominal = parseInt(nominal.replace(/\./g, ""));

		if (nominal != null && nominal >= 5000 && nominal != "" && nis != null && nis != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "" && jenis_tabungan != null && jenis_tabungan != "") {

			if (jenis_tabungan == "1") {
				nama_jenis_tabungan = "UMUM";

				Swal.fire({
					title: "Peringatan!",
					text: "Apakah anda yakin Update Kredit Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
						Swal.fire("Dibatalkan!", "Edit Setoran Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") batal diubah.", "error");
						return false;
					}
				});
			}
			else if (jenis_tabungan == "2") {
				nama_jenis_tabungan = "QURBAN";

				Swal.fire({
					title: "Peringatan!",
					text: "Apakah anda yakin Update Kredit Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
							url: `${HOST_URL}/finance/savings/update_qurban_credit`,
							dataType: "JSON",
							data: {
								id_transaksi: id_transaksi,
								nis: nis,
								id_tingkat: tingkat,
								nominal: nominal,
								tahun_ajaran: tahun_ajaran,
								catatan_kredit: catatan,
								tanggal_transaksi: tanggal_transaksi,
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
						Swal.fire("Dibatalkan!", "Edit Setoran Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") batal diubah.", "error");
						return false;
					}
				});

			}
			else if (jenis_tabungan == "3") {
				nama_jenis_tabungan = "WISATA";

				Swal.fire({
					title: "Peringatan!",
					text: "Apakah anda yakin Update Kredit Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
							url: `${HOST_URL}/finance/savings/update_tour_credit`,
							dataType: "JSON",
							data: {
								id_transaksi: id_transaksi,
								nis: nis,
								id_tingkat: tingkat,
								nominal: nominal,
								tahun_ajaran: tahun_ajaran,
								catatan_kredit: catatan,
								tanggal_transaksi: tanggal_transaksi,
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
						Swal.fire("Dibatalkan!", "Edit Setoran Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") batal diubah.", "error");
						return false;
					}
				});

			}

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

		var nis = $('#findNasabahDebet').find(":selected").val();
		var nama = $('#findNasabahDebet').find(":selected").text();
		var saldo = document.getElementById("userJumlahSaldoDebet").textContent;
		var nominal = $("#inputNominalDebet").val();
		var catatan = $("#inputCatatanDebet").val();
		var tahun_ajaran = $("#inputTahunAjaranDebet").val();
		var tanggal_transaksi = $("#inputTanggalDebet").val();
		var jenis_tabungan = $('#inputJenisTabunganDebet').find(":selected").val();
		var tingkat = $("#inputTingkatDebet").val();

		nominal = parseInt(nominal.replace(/\./g, ""));
		saldo = parseInt(saldo.replace(/\./g, ""));

		if (nominal <= saldo) {

			if (nominal != null && nominal >= 5000 && nominal != "" && nis != null && nis != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "" && jenis_tabungan != "" && jenis_tabungan != null) {

				if (jenis_tabungan == '1') {
					nama_jenis_tabungan = "UMUM";

					Swal.fire({
						title: "Peringatan!",
						text: "Apakah anda yakin Menarik Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
									jenis_tabungan: jenis_tabungan,
									tanggal_transaksi: tanggal_transaksi,
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
							Swal.fire("Dibatalkan!", "Penarikan Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") batal diubah.", "error");
							return false;
						}
					});

				} else if (jenis_tabungan == "2") {
					nama_jenis_tabungan = "QURBAN";

					Swal.fire({
						title: "Peringatan!",
						text: "Apakah anda yakin Menarik Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
								url: `${HOST_URL}/finance/savings/post_qurban_debet`,
								dataType: "JSON",
								data: {
									nis: nis,
									nominal: nominal,
									id_tingkat: tingkat,
									tahun_ajaran: tahun_ajaran,
									catatan_debet: catatan,
									jenis_tabungan: jenis_tabungan,
									tanggal_transaksi: tanggal_transaksi,
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
							Swal.fire("Dibatalkan!", "Penarikan Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") batal diubah.", "error");
							return false;
						}
					});

				} else if (jenis_tabungan == "3") {
					nama_jenis_tabungan = "WISATA";

					Swal.fire({
						title: "Peringatan!",
						text: "Apakah anda yakin Menarik Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
								url: `${HOST_URL}/finance/savings/post_tour_debet`,
								dataType: "JSON",
								data: {
									nis: nis,
									nominal: nominal,
									id_tingkat: tingkat,
									tahun_ajaran: tahun_ajaran,
									catatan_debet: catatan,
									jenis_tabungan: jenis_tabungan,
									tanggal_transaksi: tanggal_transaksi,
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
							Swal.fire("Dibatalkan!", "Penarikan Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") batal diubah.", "error");
							return false;
						}
					});

				}

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

		var id_transaksi = $('[name="id_transaksi_debet"]').val();
		var nis = $('[name="nis_debet"]').find(":selected").val();
		var nama = $('[name="nis_debet"]').find(":selected").text();
		var nominal = $('[name="nominal_debet"]').val();
		var tahun_ajaran = $('[name="th_ajaran_debet"]').val();
		var jenis_tabungan = $('[name="jenis_tabungan_debet"]').val();
		var catatan = $('[name="catatan_debet"]').val();
		var tanggal_transaksi = $('[name="waktu_transaksi_debet"]').val()
		var tingkat = $('[name="tingkat_debet_edit"]').val()
		var saldo = document.getElementById("userJumlahSaldoDebetEdit").textContent;

		nominal = parseInt(nominal.replace(/\./g, ""));
		saldo = parseInt(saldo.replace(/\./g, ""));

		if (nominal <= saldo) {

			if (nominal != null && nominal >= 5000 && nominal != "" && nis != null && nis != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "" && jenis_tabungan != null && jenis_tabungan != "") {

				if (jenis_tabungan == "1") {
					nama_jenis_tabungan = "UMUM";

					Swal.fire({
						title: "Peringatan!",
						text: "Apakah anda yakin Update Penarikan Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
							Swal.fire("Dibatalkan!", "Edit Penarikan Tabungan" + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") batal diubah.", "error");
							return false;
						}
					});
				}
				else if (jenis_tabungan == "2") {
					nama_jenis_tabungan = "QURBAN";

					Swal.fire({
						title: "Peringatan!",
						text: "Apakah anda yakin Update Penarikan Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
								url: `${HOST_URL}/finance/savings/update_qurban_debet`,
								dataType: "JSON",
								data: {
									id_transaksi: id_transaksi,
									nis: nis,
									id_tingkat: tingkat,
									nominal: nominal,
									tahun_ajaran: tahun_ajaran,
									catatan_debet: catatan,
									tanggal_transaksi: tanggal_transaksi,
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
							Swal.fire("Dibatalkan!", "Edit Penarikan Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") batal diubah.", "error");
							return false;
						}
					});
				}
				else if (jenis_tabungan == "3") {
					nama_jenis_tabungan = "WISATA";

					Swal.fire({
						title: "Peringatan!",
						text: "Apakah anda yakin Update Penarikan Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
								url: `${HOST_URL}/finance/savings/update_tour_debet`,
								dataType: "JSON",
								data: {
									id_transaksi: id_transaksi,
									nis: nis,
									id_tingkat: tingkat,
									nominal: nominal,
									tahun_ajaran: tahun_ajaran,
									catatan_debet: catatan,
									tanggal_transaksi: tanggal_transaksi,
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
							Swal.fire("Dibatalkan!", "Edit Penarikan Tabungan " + nama_jenis_tabungan + " atas nama " + nama + " (" + nis + ") batal diubah.", "error");
							return false;
						}
					});
				}

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
		var nis = $("#nis_siswa").val();

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_student_recap_transaction/${nis}`,
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
						nama_tingkat = "KB";
					} else if (data[i].id_tingkat == "2") {
						nama_tingkat = "TK";
					} else if (data[i].id_tingkat == "3") {
						nama_tingkat = "SD";
					} else if (data[i].id_tingkat == "4") {
						nama_tingkat = "SMP";
					} else if (data[i].id_tingkat == "6") {
						nama_tingkat = "DC";
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
								data[i].id_transaksi + "' data-nis_siswa='" + data[i].nis_siswa + "' data-nama_lengkap='" + data[i].nama_lengkap + "' data-jenis_tabungan='" + data[i].jenis_tabungan + "' data-id_tingkat='" + data[i].id_tingkat + "' data-nomor_transaksi='" + data[i].nomor_transaksi +
								"' data-jenis_transaksi='" + jenis_transaksi + "' data-id_th_ajaran='" + data[i].th_ajaran + "' data-th_ajaran='" + data[i].tahun_ajaran + "' data-nominal='" + data[i].nominal + "' data-waktu_transaksi='" + data[i].tanggal_transaksi + "' data-catatan='" + data[i].catatan +
								"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit</span></a></li>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link delete_transaksi_kredit' data-id_transaksi='" +
								data[i].id_transaksi + "' data-nis_siswa='" + data[i].nis_siswa + "' data-nama_lengkap='" + data[i].nama_lengkap + "' data-jenis_tabungan='" + data[i].jenis_tabungan + "' data-id_tingkat='" + data[i].id_tingkat + "' data-nomor_transaksi='" + data[i].nomor_transaksi +
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
								data[i].id_transaksi + "' data-nis_siswa='" + data[i].nis_siswa + "' data-nama_lengkap='" + data[i].nama_lengkap + "' data-jenis_tabungan='" + data[i].jenis_tabungan + "' data-id_tingkat='" + data[i].id_tingkat + "' data-nomor_transaksi='" + data[i].nomor_transaksi +
								"' data-jenis_transaksi='" + jenis_transaksi + "' data-id_th_ajaran='" + data[i].th_ajaran + "' data-th_ajaran='" + data[i].tahun_ajaran + "' data-nominal='" + data[i].nominal + "' data-waktu_transaksi='" + data[i].tanggal_transaksi + "' data-catatan='" + data[i].catatan +
								"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit</span></a></li>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link delete_transaksi_debet' data-id_transaksi='" +
								data[i].id_transaksi + "' data-nis_siswa='" + data[i].nis_siswa + "' data-nama_lengkap='" + data[i].nama_lengkap + "' data-jenis_tabungan='" + data[i].jenis_tabungan + "' data-id_tingkat='" + data[i].id_tingkat + "' data-nomor_transaksi='" + data[i].nomor_transaksi +
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
						`${data[i].nomor_transaksi}` +
						"</td>" +
						"<td class='font-weight-bolder text-danger'>" +
						`${data[i].nomor_transaksi}` +
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
						"<td>" +
						`${nama_tingkat}` +
						"</td>" +
						"<td class='" + `${color_tabungan}` + "'><b>" +
						`${jenis_tabungan}` +
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

	function get_student_kredit() {

		var nis = $("#findNasabahKredit").find(":selected").val();
		var nama = $("#findNasabahKredit").find(":selected").text();
		// var HOST_URL = "<?php echo base_url('admin/getMemberInfo/'); ?>" + nis;
		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_student_info/${nis}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_siswa']) {
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

				if (data['info_tabungan'].length != 0) {
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
		$('#inputTingkatKredit option:selected').remove();
		$('#inputTingkatKredit').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));
		
		$("#userNisKredit").html(nis);
		$("#userNamaKredit").html(nama);
		$("#userTingkatKredit").html(nama_tingkat);
		
	}

	function get_student_debet() {
		var nis = $("#findNasabahDebet").find(":selected").val();
		var nama = $("#findNasabahDebet").find(":selected").text();
		// var HOST_URL = "<?php echo base_url('admin/getMemberInfo/'); ?>" + nis;
		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_student_info/${nis}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_siswa']) {
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

		$('#inputTingkatDebet option:selected').remove();
		$('#inputTingkatDebet').prepend($("<option selected></option>").attr("value", id_tingkat).text(nama_tingkat));

		$("#userNisDebet").html(nis);
		$("#userNamaDebet").html(nama);
		$("#userTingkatDebet").html(nama_tingkat);
	}

	$("#tb_transaksi").on("click", ".delete_transaksi_kredit", function () {
		var id_transaksi = $(this).data("id_transaksi");
		var nis_siswa = $(this).data("nis_siswa");
		var nama_siswa = $(this).data("nama_lengkap");
		var jenis_transaksi = $(this).data("jenis_transaksi");
		var jenis_tabungan = $(this).data("jenis_tabungan");
		var nominal = $(this).data("nominal");

		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		if (jenis_tabungan == "1") {
			nama_jenis_tabungan = "UMUM";

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
				html: "Apakah anda yakin ingin menghapus Transaksi (" + jenis_transaksi + ") di Tabungan " + nama_jenis_tabungan + " atas nama '" +
					nama_siswa + "' (" + nis_siswa + ") dengan nominal Kredit (Rp. " + nominal + ") ? <br></br> <div id='recaptcha_delete'></div>",
				didOpen: () => {
					grecaptcha.render('recaptcha_delete', {
						'sitekey': CAPTCA_KEY,
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
						type: "POST",
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
					Swal.fire("Dibatalkan!", "Penghapusan Transaksi Kredit di Tabungan " + nama_jenis_tabungan + " atas nama '" + nama_siswa + "' (" + nis_siswa + ") batal dihapus.", "error");

					return false;
				}
			});
		}
		else if (jenis_tabungan == "2") {
			nama_jenis_tabungan = "QURBAN";

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
				html: "Apakah anda yakin ingin menghapus Transaksi (" + jenis_transaksi + ") di Tabungan " + nama_jenis_tabungan + " atas nama '" +
					nama_siswa + "' (" + nis_siswa + ") dengan nominal Kredit (Rp. " + nominal + ") ? <br></br> <div id='recaptcha_delete'></div>",
				didOpen: () => {
					grecaptcha.render('recaptcha_delete', {
						'sitekey': CAPTCA_KEY,
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
						type: "POST",
						url: `${HOST_URL}/finance/savings/delete_qurban_credit_transaction`,
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
					Swal.fire("Dibatalkan!", "Penghapusan Transaksi Kredit di Tabungan " + nama_jenis_tabungan + " atas nama '" + nama_siswa + "' (" + nis_siswa + ") batal dihapus.", "error");

					return false;
				}
			});

		}
		else if (jenis_tabungan == "3") {
			nama_jenis_tabungan = "WISATA";

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
				html: "Apakah anda yakin ingin menghapus Transaksi (" + jenis_transaksi + ") di Tabungan " + nama_jenis_tabungan + " atas nama '" +
					nama_siswa + "' (" + nis_siswa + ") dengan nominal Kredit (Rp. " + nominal + ") ? <br></br> <div id='recaptcha_delete'></div>",
				didOpen: () => {
					grecaptcha.render('recaptcha_delete', {
						'sitekey': CAPTCA_KEY,
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
						type: "POST",
						url: `${HOST_URL}/finance/savings/delete_tour_credit_transaction`,
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
					Swal.fire("Dibatalkan!", "Penghapusan Transaksi Kredit di Tabungan " + nama_jenis_tabungan + " atas nama '" + nama_siswa + "' (" + nis_siswa + ") batal dihapus.", "error");

					return false;
				}
			});

		}

		return false;
	});

	$("#tb_transaksi").on("click", ".delete_transaksi_debet", function () {
		var id_transaksi = $(this).data("id_transaksi");
		var nis_siswa = $(this).data("nis_siswa");
		var nama_siswa = $(this).data("nama_lengkap");
		var jenis_transaksi = $(this).data("jenis_transaksi");
		var jenis_tabungan = $(this).data("jenis_tabungan");
		var nominal = $(this).data("nominal");

		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val();

		if (jenis_tabungan == "1") {
			nama_jenis_tabungan = "UMUM";

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
				html: "Apakah anda yakin ingin menghapus Transaksi (" + jenis_transaksi + ") di Tabungan " + nama_jenis_tabungan + " atas nama '" +
					nama_siswa + "' (" + nis_siswa + ") dengan nominal Debet (Rp. " + nominal + ") ? <br></br> <div id='recaptcha_delete'></div>",
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
						type: "POST",
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
					Swal.fire("Dibatalkan!", "Penghapusan Transaksi Debet di  " + nama_jenis_tabungan + " atas nama '" + nama_siswa + "' (" + nis_siswa + ") batal dihapus.", "error");

					return false;
				}
			});
		}
		else if (jenis_tabungan == "2") {
			nama_jenis_tabungan = "QURBAN";

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
				html: "Apakah anda yakin ingin menghapus Transaksi (" + jenis_transaksi + ") di Tabungan " + nama_jenis_tabungan + " atas nama '" +
					nama_siswa + "' (" + nis_siswa + ") dengan nominal Debet (Rp. " + nominal + ") ? <br></br> <div id='recaptcha_delete'></div>",
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
						type: "POST",
						url: `${HOST_URL}/finance/savings/delete_qurban_debet_transaction`,
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
					Swal.fire("Dibatalkan!", "Penghapusan Transaksi Debet di " + nama_jenis_tabungan + " atas nama '" + nama_siswa + "' (" + nis_siswa + ") batal dihapus.", "error");

					return false;
				}
			});
		}
		else if (jenis_tabungan == "3") {
			nama_jenis_tabungan = "WISATA";

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
				html: "Apakah anda yakin ingin menghapus Transaksi (" + jenis_transaksi + ") di Tabungan " + nama_jenis_tabungan + " atas nama '" +
					nama_siswa + "' (" + nis_siswa + ") dengan nominal Debet (Rp. " + nominal + ") ? <br></br> <div id='recaptcha_delete'></div>",
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
						type: "POST",
						url: `${HOST_URL}/finance/savings/delete_tour_debet_transaction`,
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
					Swal.fire("Dibatalkan!", "Penghapusan Transaksi Debet di " + nama_jenis_tabungan + " atas nama '" + nama_siswa + "' (" + nis_siswa + ") batal dihapus.", "error");

					return false;
				}
			});
		}

		return false;
	});

	$("#inputJenisTabunganKredit").on("change", function () {

		var nis = $("#findNasabahKredit").find(":selected").val();
		var nama = $("#findNasabahKredit").find(":selected").text();
		var jenis_tabungan = $("#inputJenisTabunganKredit").find(":selected").val();

		if (jenis_tabungan == '1') {
			nama_jenis_tabungan = "UMUM";

			$.ajax({
				type: "GET",
				url: `${HOST_URL}/finance/savings/get_student_info/${nis}`,
				async: false,
				dataType: "JSON",
				success: function (data) {

					if (data['info_siswa']) {
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
		} else if (jenis_tabungan == '2') {
			nama_jenis_tabungan = "QURBAN";

			$.ajax({
				type: "GET",
				url: `${HOST_URL}/finance/savings/get_student_qurban_info/${nis}`,
				async: false,
				dataType: "JSON",
				success: function (data) {
					if (data['info_siswa']) {
						jumlah_saldo = data['info_siswa'][0]['saldo_tabungan_qurban'];
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
		} else if (jenis_tabungan == '3') {
			nama_jenis_tabungan = "WISATA";

			$.ajax({
				type: "GET",
				url: `${HOST_URL}/finance/savings/get_student_tour_info/${nis}`,
				async: false,
				dataType: "JSON",
				success: function (data) {
					if (data['info_siswa']) {
						jumlah_saldo = data['info_siswa'][0]['saldo_tabungan_wisata'];
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
		}

		$("#userJenisTabunganKredit").html(nama_jenis_tabungan);
		$("#infoTerakhirTransaksiKredit").html(info_waktu_transaksi);
		$("#userJumlahSaldoKredit").html(CurrencyID(jumlah_saldo));

	});

	$("#inputJenisTabunganDebet").on("change", function () {

		var nis = $("#findNasabahDebet").find(":selected").val();
		var nama = $("#findNasabahDebet").find(":selected").text();
		// var HOST_URL = "<?php echo base_url('admin/getMemberInfo/'); ?>" + nis;
		var jenis_tabungan = $("#inputJenisTabunganDebet").find(":selected").val();

		if (jenis_tabungan == '1') {
			nama_jenis_tabungan = "UMUM";

			$.ajax({
				type: "GET",
				url: `${HOST_URL}/finance/savings/get_student_info/${nis}`,
				async: false,
				dataType: "JSON",
				success: function (data) {

					if (data['info_siswa']) {
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
		} else if (jenis_tabungan == '2') {
			nama_jenis_tabungan = "QURBAN";

			$.ajax({
				type: "GET",
				url: `${HOST_URL}/finance/savings/get_student_qurban_info/${nis}`,
				async: false,
				dataType: "JSON",
				success: function (data) {
					if (data['info_siswa']) {
						jumlah_saldo = data['info_siswa'][0]['saldo_tabungan_qurban'];
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
		} else if (jenis_tabungan == '3') {
			nama_jenis_tabungan = "WISATA";

			$.ajax({
				type: "GET",
				url: `${HOST_URL}/finance/savings/get_student_tour_info/${nis}`,
				async: false,
				dataType: "JSON",
				success: function (data) {
					if (data['info_siswa']) {
						jumlah_saldo = data['info_siswa'][0]['saldo_tabungan_wisata'];
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
		}

		$("#infoTerakhirTransaksiDebet").html(info_waktu_transaksi);
		$("#userJumlahSaldoDebet").html(CurrencyID(jumlah_saldo));
		$("#userJenisTabunganDebet").html(nama_jenis_tabungan);

	});
});



