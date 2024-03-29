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
				var column_kr = 7;
				var column_de = 8;
				var column_sa = 9;
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
				var pageTotal_sa = api.column(column_sa, {
					page: 'current'
				}).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);
				// Update footer
				$(api.column(column_kr).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_kr
					.toFixed(0)));

				$(api.column(column_de).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_de
					.toFixed(0)));

				$(api.column(column_sa).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_sa
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
			url: `${HOST_URL}/finance/report/export_data_csv_all`,
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
			url: `${HOST_URL}/finance/savings/print_saving_pdf`,
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
		placeholder: "Cari Siswa",
		allowClear: true,
	});

	$(".findNasabahDebet").select2({
		placeholder: "Cari Siswa",
		allowClear: true,
	});

	$(".findNasabahKreditEdit").select2({
		placeholder: "Cari Siswa",
		allowClear: true,
	});

	$(".findNasabahDebetEdit").select2({
		placeholder: "Cari Siswa",
		allowClear: true,
	});

	$(".findRekapNasabah").select2({
		placeholder: "Cari Siswa",
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

		var id_transaksi = $(this).data("id_transaksi");
		var nis_siswa = $(this).data("nis_siswa");
		var nama_lengkap = $(this).data("nama_lengkap");
		var id_th_ajaran = $(this).data("id_th_ajaran");
		var th_ajaran = $(this).data("th_ajaran");
		var nominal = $(this).data("nominal");
		var waktu_transaksi = $(this).data("waktu_transaksi");
		var catatan = $(this).data("catatan");

		$("#modalEditKreditTransaksi").modal("show");

		$('[name="id_transaksi_kredit"]').val(id_transaksi);
		$('[name="nis_kredit"]').empty().append($("<option selected></option>").attr("value", nis_siswa).text(nama_lengkap));
		$('[name="th_ajaran_kredit"] option:selected').remove();
		$('[name="th_ajaran_kredit"]').append($("<option selected></option>").attr("value", id_th_ajaran).text(th_ajaran));
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
					jumlah_saldo_awal = (Number(data['info_siswa'][0]['saldo_tabungan']) - Number(data['info_tabungan'][0]['nominal']));
					jumlah_saldo_akhir = data['info_siswa'][0]['saldo_tabungan'];
					info_kelas = data['info_siswa'][0]['informasi'];
				} else {
					jumlah_saldo_awal = "-";
					jumlah_saldo_akhir = "-";
					info_kelas = "-";
				}
			},
		});

		$("#userNisKreditEdit").html(nis_siswa);
		$("#userNamaKreditEdit").html(nama_lengkap);
		$("#userKelasKreditEdit").html(info_kelas);
		$("#userJumlahSaldoKreditEdit").html(CurrencyID(jumlah_saldo_awal));
		$("#userJumlahSaldoKreditEditNow").html(CurrencyID(jumlah_saldo_akhir));
	});

	$("#tb_transaksi").on("click", ".edit_transaksi_debet", function () {

		var id_transaksi = $(this).data("id_transaksi");
		var nis_siswa = $(this).data("nis_siswa");
		var nama_lengkap = $(this).data("nama_lengkap");
		var id_th_ajaran = $(this).data("id_th_ajaran");
		var th_ajaran = $(this).data("th_ajaran");
		var nominal = $(this).data("nominal");
		var waktu_transaksi = $(this).data("waktu_transaksi");
		var catatan = $(this).data("catatan");

		$("#modalEditDebetTransaksi").modal("show");

		$('[name="id_transaksi_debet"]').val(id_transaksi);
		$('[name="nis_debet"]').empty(0).append($("<option selected></option>").attr("value", nis_siswa).text(nama_lengkap));
		$('[name="th_ajaran_debet"] option:selected').remove();
		$('[name="th_ajaran_debet"]').append($("<option selected></option>").attr("value", id_th_ajaran).text(th_ajaran));
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
					jumlah_saldo_awal = (Number(data['info_siswa'][0]['saldo_tabungan']) + Number(data['info_tabungan'][0]['nominal']));
					jumlah_saldo_akhir = data['info_siswa'][0]['saldo_tabungan'];
					info_kelas = data['info_siswa'][0]['informasi'];
				} else {
					jumlah_saldo_awal = "-";
					jumlah_saldo_akhir = "-";
					info_kelas = "-";
				}
			},
		});

		$("#userNisDebetEdit").html(nis_siswa);
		$("#userNamaDebetEdit").html(nama_lengkap);
		$("#userKelasDebetEdit").html(info_kelas);
		$("#userJumlahSaldoDebetEdit").html(CurrencyID(jumlah_saldo_awal));
		$("#userJumlahSaldoDebetEditNow").html(CurrencyID(jumlah_saldo_akhir));

		var btnDebet = document.getElementById("btnInputDebetEdit");
		if (jumlah_saldo_awal <= 0 || jumlah_saldo_awal < nominal) {
			$(btnDebet).prop("disabled", true);
		} else if (jumlah_saldo_awal > 0) {
			$(btnDebet).prop("disabled", false);
		}

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
					jumlah_saldo = data['info_siswa'][0]['saldo_tabungan'];
					info_kelas = data['info_siswa'][0]['informasi'];
				} else {
					jumlah_saldo = "-";
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

		$('[name="inputNISKredit"]').val(nis);
		$("#userNisKredit").html(nis);
		$("#userNamaKredit").html(nama);
		$("#userKelasKredit").html(info_kelas);
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
					jumlah_saldo = data['info_siswa'][0]['saldo_tabungan'];
					info_kelas = data['info_siswa'][0]['informasi'];
				} else {
					jumlah_saldo = "-";
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

		$("#userNisDebet").html(nis);
		$("#userNamaDebet").html(nama);
		$("#userKelasDebet").html(info_kelas);
		$("#userCatatanDebet").html(info_catatan);
		$("#infoTerakhirTransaksiDebet").html(info_waktu_transaksi);
		$("#userJumlahSaldoDebet").html(CurrencyID(jumlah_saldo));

		var btnDebet = document.getElementById("btnInputDebet");
		if (jumlah_saldo <= 0) {
			$(btnDebet).prop("disabled", true);
		} else if (jumlah_saldo > 0) {
			$(btnDebet).prop("disabled", false);
		}
	});

	$("#findRekapNasabah").on("change", function () {
		var nis = $("#findRekapNasabah").find(":selected").val();
		var nama = $("#findRekapNasabah").find(":selected").text();

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_student_info/${nis}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_siswa']) {
					jumlah_saldo = data['info_siswa'][0]['saldo_tabungan'];
					info_kelas = data['info_siswa'][0]['informasi'];
				} else {
					jumlah_saldo = "-";
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

		$('[name="inputNISRekap"]').val(nis);
		$("#userNisRekap").html(nis);
		$("#userNamaRekap").html(nama);
		$("#userKelasRekap").html(info_kelas);
		$("#userCatatanRekap").html(info_catatan);
		$("#infoTerakhirTransaksiRekap").html(info_waktu_transaksi);
		$("#userJumlahSaldoRekap").html(CurrencyID(jumlah_saldo));
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
						`${data[i].nama_lengkap}` +
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
		var catatan = $("#inputCatatanKredit").val();
		var tanggal_transaksi = $("#inputTanggalKredit").val()

		nominal = parseInt(nominal.replace(/\./g, ""));

		if (nominal != null && nominal > 0 && nominal != "" && nis != null && nis != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "") {

			Swal.fire({
				title: "Peringatan!",
				text: "Apakah anda yakin ingin Menyetor Tabungan atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
					Swal.fire("Dibatalkan!", "Setoran Tabungan atas nama " + nama + " (" + nis + ") batal diinputkan.", "error");
					return false;
				}
			});

			return false;
		} else {
			Swal.fire({
				text: "Opps!, Pastikan Inputan Terisi dengan Benar & Tidak Boleh <= 0, Silahkan input ulang.",
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
		var tanggal_transaksi = $('[name="waktu_transaksi_kredit"]').val()

		nominal = parseInt(nominal.replace(/\./g, ""));

		if (nominal != null && nominal > 0 && nominal != "" && nis != null && nis != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "") {

			Swal.fire({
				title: "Peringatan!",
				text: "Apakah anda yakin Update Kredit Tabungan atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
					Swal.fire("Dibatalkan!", "Edit Setoran Tabungan atas nama " + nama + " (" + nis + ") batal diubah.", "error");
					return false;
				}
			});

			return false;
		} else {
			Swal.fire({
				text: "Opps!, Pastikan Inputan Terisi dengan Benar & Tidak Boleh <= 0 dan Kosong, Silahkan input ulang.",
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

		nominal = parseInt(nominal.replace(/\./g, ""));
		saldo = parseInt(saldo.replace(/\./g, ""));

		if (nominal <= saldo) {
		
			if (nominal != null && nominal > 0 && nominal != "" && nis != null && nis != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "") {

				Swal.fire({
					title: "Peringatan!",
					text: "Apakah anda yakin Menarik Tabungan atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
								$("#table_transcation").DataTable().destroy();
								datatable_init();
							},
						});
					} else {
						Swal.fire("Dibatalkan!", "Penarikan Tabungan atas nama " + nama + " (" + nis + ") batal diubah.", "error");
						return false;
					}
				});

				return false;

			} else {
				Swal.fire({
					text: "Opps!, Pastikan Inputan Terisi dengan Benar & Tidak Boleh <= 0 dan Kosong, Silahkan input ulang.",
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
		var catatan = $('[name="catatan_debet"]').val();
		var tanggal_transaksi = $('[name="waktu_transaksi_debet"]').val()
		var saldo = document.getElementById("userJumlahSaldoDebetEdit").textContent;

		nominal = parseInt(nominal.replace(/\./g, ""));
		saldo = parseInt(saldo.replace(/\./g, ""));

		if (nominal <= saldo) {

			if (nominal != null && nominal > 0 && nominal != "" && nis != null && nis != "" && tahun_ajaran != null && tahun_ajaran != "" && tanggal_transaksi != null && tanggal_transaksi != "") {

				Swal.fire({
					title: "Peringatan!",
					text: "Apakah anda yakin Update Penarikan Tabungan atas nama " + nama + " (" + nis + ") dengan Nominal Rp." + nominal + " ?",
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
						Swal.fire("Dibatalkan!", "Edit Penarikan Tabungan atas nama " + nama + " (" + nis + ") batal diubah.", "error");
						return false;
					}
				});

				return false;

			} else {
				Swal.fire({
					text: "Opps!, Pastikan Inputan Terisi dengan Benar & Tidak Boleh <= 0 dan Kosong, Silahkan input ulang.",
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

					if (data[i].status_edit == 1) {

						if (data[i].status_kredit_debet == "1") {
							var option = "<div class='dropdown dropdown-inline'>" +
								"<a href='javascript:;' class='btn btn-xs  btn-clean btn-icon btn-primary' data-toggle='dropdown'>" +
								"<i class='la la-cog'></i>" +
								"</a>" +
								"<div class='dropdown-menu dropdown-menu-sm dropdown-menu-right'>" +
								"<ul class='nav nav-hover flex-column'>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link edit_transaksi_kredit' data-id_transaksi='" +
								data[i].id_transaksi + "' data-nis_siswa='" + data[i].nis_siswa + "' data-nama_lengkap='" + data[i].nama_lengkap +
								"' data-jenis_transaksi='" + jenis_transaksi + "' data-id_th_ajaran='" + data[i].th_ajaran + "' data-th_ajaran='" + data[i].tahun_ajaran + "' data-nominal='" + data[i].nominal + "' data-waktu_transaksi='" + data[i].tanggal_transaksi + "' data-catatan='" + data[i].catatan +
								"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit</span></a></li>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link delete_transaksi_kredit' data-id_transaksi='" +
								data[i].id_transaksi + "' data-nis_siswa='" + data[i].nis_siswa + "' data-nama_lengkap='" + data[i].nama_lengkap +
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
								data[i].id_transaksi + "' data-nis_siswa='" + data[i].nis_siswa + "' data-nama_lengkap='" + data[i].nama_lengkap +
								"' data-jenis_transaksi='" + jenis_transaksi + "' data-id_th_ajaran='" + data[i].th_ajaran + "' data-th_ajaran='" + data[i].tahun_ajaran + "' data-nominal='" + data[i].nominal + "' data-waktu_transaksi='" + data[i].tanggal_transaksi + "' data-catatan='" + data[i].catatan +
								"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit</span></a></li>" +
								"<li class='nav-item'><a href='javascript:void(0);' class='nav-link delete_transaksi_debet' data-id_transaksi='" +
								data[i].id_transaksi + "' data-nis_siswa='" + data[i].nis_siswa + "' data-nama_lengkap='" + data[i].nama_lengkap +
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
						`${data[i].id_transaksi}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${data[i].nis_siswa}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${data[i].nama_lengkap}` +
						"</td>" +
						"<td>" +
						`${data[i].waktu_transaksi}` +
						"</td>" +
						"<td>" +
						`${data[i].tahun_ajaran}` +
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
