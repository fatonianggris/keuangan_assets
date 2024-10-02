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

		show_joint_saving();

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
				var column_debit = 8;
				var column_kredit = 9;
				var column_saldo = 10;

				var api = this.api(),
					data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return typeof i === 'string' ? i.replace(/[\$,.]/g, '') * 1 : typeof i ===
						'number' ? i : 0;
				};
				// Total over this page
				var pageTotal_kr = api.column(column_kredit, {
					page: 'current'
				}).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);
				var pageTotal_de = api.column(column_debit, {
					page: 'current'
				}).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);
				var pageTotal_sal = api.column(column_saldo, {
					page: 'current'
				}).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);

				// Update footer
				$(api.column(column_kredit).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_kr
					.toFixed(0)));

				$(api.column(column_debit).footer()).html('Rp. ' + KTUtil.numberString(pageTotal_de
					.toFixed(0)));

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
			url: `${HOST_URL}/finance/report/export_data_joint_saving_csv_all`,
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
			url: `${HOST_URL}/finance/report/print_data_joint_saving_pdf_all`,
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

	$(".findRekapTabungan").select2({
		placeholder: "Input No Rekening Tabungan Bersama",
		minimumInputLength: 7,
		maximumInputLength: 8,
		allowClear: true,
	});

	$('#id_penanggung_jawab').select2({
		placeholder: "Pilih Penanggung Jawab",
	});

	$("#id_penanggung_jawab").on("change", function () {

		var jenis_tabungan = $("#jenis_tabungan").find(":selected").val();
		var number = $("#id_penanggung_jawab").find(":selected").val();

		if (jenis_tabungan == '2') {
			$.ajax({
				type: "GET",
				url: `${HOST_URL}/finance/savings/get_employee_by_nip/${number}`,
				async: false,
				dataType: "JSON",
				success: function (data) {
					if (data['data_pegawai'][0]) {
						nip = data['data_pegawai'][0]['nip'];
						nama_lengkap = data['data_pegawai'][0]['nama_lengkap'];
						nomor_handphone = data['data_pegawai'][0]['nomor_hp'];
						email = data['data_pegawai'][0]['email'];
					} else {
						nip = "";
						nama_lengkap = "";
						nomor_handphone = "";
						email = "";
					}

					$('[name="nama_wali"]').attr("disabled", true);
					$('[name="nomor_handphone_wali"]').attr("disabled", true);
				}
			});

		} else {
			$.ajax({
				type: "GET",
				url: `${HOST_URL}/finance/savings/get_student_by_nis/${number}`,
				async: false,
				dataType: "JSON",
				success: function (data) {
					if (data['data_siswa'][0]) {
						nis = data['data_siswa'][0]['nis'] || "";
						nama_lengkap = data['data_siswa'][0]['nama_lengkap'] || "";
						nama_wali = data['data_siswa'][0]['nama_wali'] || "";
						nomor_handphone = data['data_siswa'][0]['nomor_handphone'] || "";
						email = data['data_siswa'][0]['email'] || "";
					} else {
						nis = "";
						nama_lengkap = "";
						nama_wali = "";
						nomor_handphone = "";
						email = "";
					}

					$('[name="nama_wali"]').attr("disabled", false);
					$('[name="nomor_handphone_wali"]').attr("disabled", false);

					if (nama_wali == null || nama_wali == "") {
						$('[name="nama_wali"]').val('');
					} else {
						$('[name="nama_wali"]').val(nama_wali.toUpperCase());
					}

					if (nomor_handphone == null || nomor_handphone == "") {
						$('[name="nomor_handphone_wali"]').val('');
					} else {
						$('[name="nomor_handphone_wali"]').val(nomor_handphone);
					}
				}
			});
		}

	});

	$("#jenis_tabungan").on("change", function () {

		var jenis_tabungan = $("#jenis_tabungan").find(":selected").val();

		if (jenis_tabungan == "2") {
			$('[name="nama_wali"]').attr("disabled", true);
			$('[name="nomor_handphone_wali"]').attr("disabled", true);
			$('[name="nama_wali"]').val("");
			$('[name="nomor_handphone_wali"]').val("");
		} else {
			$('[name="nama_wali"]').attr("disabled", false);
			$('[name="nomor_handphone_wali"]').attr("disabled", false);
		}

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/savings/get_all_student_or_employee/`,
			contentType: 'application/json; charset=utf-8',
			data: {
				jenis_tabungan: jenis_tabungan,
			},
			dataType: 'json',
			success: function (data) {
				$('[name="id_penanggung_jawab"]').empty();
				for (var i = 0; i < data.length; i++) {
					$('[name="id_penanggung_jawab"]').append($("<option></option>").attr("value", data[i].number).text(`${data[i].nama_lengkap.toUpperCase()} ` + `(${data[i].number})`));
				}
			},
		});

	});

	$("#tb_transaksi").on("click", ".edit_joint", function () {

		$('[name="id_nasabah_bersama"]').val('');
		$('[name="id_penanggung_jawab"]').val('');
		$('[name="nomor_rekening_bersama"]').val('');
		$('[name="nama_lengkap"]').val('');
		$('[name="nama_tabungan_bersama"]').val('');
		$('[name="nama_th_ajaran"]').val('');
		$('[name="tanggal_transaksi"]').val('');
		$('[name="nomor_handphone_wali"]').val('');
		$('[name="nama_th_ajaran"]').val('');
		$('[name="nama_wali"]').val('');
		$('[name="saldo_bersama"]').val('');
		$('[name="id_penanggung_jawab"]').empty();
		$('[name="keterangan_tabungan_bersama"]').text("");

		var id_tabungan = $(this).data("id_tabungan_bersama") || "";
		var id_pj = $(this).data("id_penanggung_jawab") || "";
		var id_tingkat = $(this).data("id_tingkat") || "";
		var id_th_ajaran = $(this).data("id_th_ajaran") || "";
		var nomor_rekening = $(this).data("nomor_rekening_bersama") || "";
		var nama = $(this).data("nama_lengkap") || "";
		var nama_tabungan = $(this).data("nama_tabungan_bersama") || "";
		var nama_wali = $(this).data("nama_wali") || "";
		var jenis_tabungan = $(this).data("jenis_tabungan") || "";
		var nomor_handphone = $(this).data("nomor_handphone") || "";
		var keterangan_tabungan = $(this).data("keterangan_tabungan_bersama") || "";

		$('[name="id_tabungan_bersama"]').val(id_tabungan);
		$('[name="nomor_rekening_bersama"]').val(nomor_rekening);
		$('[name="nama_tabungan_bersama"]').val(nama_tabungan.toUpperCase());
		$('[name="nomor_handphone_wali"]').val(nomor_handphone);
		$('[name="nama_wali"]').val(nama_wali.toUpperCase());
		$('[name="keterangan_tabungan_bersama"]').text(keterangan_tabungan);

		$('[name="id_tingkat"]').find('option[value="' + id_tingkat + '"]').prop('selected', true);
		$('[name="id_th_ajaran"]').find('option[value="' + id_th_ajaran + '"]').prop('selected', true);
		$('[name="jenis_tabungan"]').find('option[value="' + jenis_tabungan + '"]').prop('selected', true);

		if (jenis_tabungan == "2") {
			$('[name="nama_wali"]').attr("disabled", true);
			$('[name="nomor_handphone_wali"]').attr("disabled", true);
			$('[name="nama_wali"]').val("");
			$('[name="nomor_handphone_wali"]').val("");
		} else {
			$('[name="nama_wali"]').attr("disabled", false);
			$('[name="nomor_handphone_wali"]').attr("disabled", false);
			$('[name="nama_wali"]').val(nama_wali.toUpperCase());
			$('[name="nomor_handphone_wali"]').val(nomor_handphone);
		}

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/savings/get_all_student_or_employee/`,
			contentType: 'application/json; charset=utf-8',
			data: {
				jenis_tabungan: jenis_tabungan,
			},
			dataType: 'json',
			success: function (data) {
				var i;
				for (i = 0; i < data.length; i++) {
					$('[name="id_penanggung_jawab"]').append($("<option></option>").attr("value", data[i].number).text(`${data[i].nama_lengkap.toUpperCase()} ` + `(${data[i].number})`));
				}
				if (nama != null && nama != "") {
					$('[name="id_penanggung_jawab"]').find('option[value="' + id_pj + '"]').prop('selected', true);
				} else {
					var nama_lengkap = "TIDAK TERDAFTAR";
					$('[name="id_penanggung_jawab"]').prepend($("<option value='0' selected ></option>").text(`${nama_lengkap}`));
				}
			},
		});

		$("#modalEditJoint").modal("show");
	});

	$("#findRekapTabungan").on("change", function () {
		var norek = $("#findRekapTabungan").find(":selected").val();

		var nama_tingkat = "";

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_joint_saving_info_recap/${norek}`,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data['info_tabungan']) {
					nomor_rekening_bersama = data['info_tabungan'][0]['nomor_rekening_bersama'] || "";
					nama_tabungan_bersama = data['info_tabungan'][0]['nama_tabungan_bersama'] || "";
					jumlah_saldo_bersama = data['info_tabungan'][0]['saldo_tabungan_bersama'] || "";
					id_tingkat = data['info_tabungan'][0]['id_tingkat'] || "";

					number = data['info_tabungan'][0]['number'] || "";
					nama_wali = data['info_tabungan'][0]['nama_wali'] || "";
					nama_siswa_pj = data['info_tabungan'][0]['nama_lengkap'] || "";
					email_wali = data['info_tabungan'][0]['email'] || "";
					nomor_handphone = data['info_tabungan'][0]['nomor_handphone'] || "";

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
					number = "-";
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

		$("#infoNamaTabunganRekap").html(nama_tabungan_bersama.toUpperCase() + " (" + nomor_rekening_bersama + ")");
		$("#infoPenanggungJawabRekap").html(nama_siswa_pj.toUpperCase() + " (" + number + ")");
		$("#infoTingkatRekap").html(nama_tingkat);

		$("#userCatatanRekap").html(info_catatan_bersama);
		$("#infoTerakhirTransaksiRekap").html(info_waktu_transaksi_bersama);
		$("#infoSaldoRekap").html(CurrencyID(jumlah_saldo_bersama));
	});

	function CurrencyID(nominal) {
		var formatter = new Intl.NumberFormat("id-ID", {
			currency: "IDR",
			minimumFractionDigits: 0,
		});
		return formatter.format(nominal);
	}

	function list_joint_saving() {
		$.ajax({
			type: "GET",
			url: `${HOST_URL}finance/savings/savings/get_all_joint_saving`,
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
						`${data[i].nomor_rekening_bersama}` + ` (${data[i].nama_tabungan_bersama})` +
						"</option>";
				}
				$("#findRekapTabungan").html(option + html);
			},
		});
	}

	$("#btnRekap").on("click", function () {
		list_joint_saving();
	});

	$("#btnUpdateTabungan").on("click", function () {
		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		var id_tabungan = $('[name="id_tabungan_bersama"]').val() || "";
		var nomor_rekening = $('[name="nomor_rekening_bersama"]').val() || "";
		var nama_tabungan = $('[name="nama_tabungan_bersama"]').val() || "";
		var id_pj = $('[name="id_penanggung_jawab"]').val() || "";
		var id_tingkat = $('[name="id_tingkat"]').val() || "";
		var id_ta = $('[name="id_th_ajaran"]').val() || "";
		var nama_wali = $('[name="nama_wali"]').val() || "";
		var nomor_hp = $('[name="nomor_handphone_wali"]').val() || "";
		var keterangan_tabungan = $('[name="keterangan_tabungan_bersama"]').val() || "";

		if (id_tabungan != null && id_tabungan != "" && nomor_rekening != null && nomor_rekening != "" && nama_tabungan != null && nama_tabungan != "" && id_pj != null && id_pj != "" && id_tingkat != null && id_tingkat != "") {

			Swal.fire({
				title: "Peringatan!",
				html: "Apakah anda yakin Mengupdate Tabungan Bersama atas nama <b>" + nama_tabungan.toUpperCase() + " (" + nomor_rekening + ")</b> ?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Ya, Simpan!",
				cancelButtonText: "Tidak, Batal!",
				closeOnConfirm: false,
				closeOnCancel: false
			}).then(function (result) {
				if (result.value) {

					$("#modalEditJoint").modal("hide");
					KTApp.blockPage({
						overlayColor: '#FFA800',
						state: 'warning',
						size: 'lg',
						opacity: 0.1,
						message: 'Silahkan Tunggu...'
					});

					$.ajax({
						type: "POST",
						url: `${HOST_URL}/finance/savings/update_joint_saving`,
						dataType: "JSON",
						data: {
							id_tabungan_bersama: id_tabungan,
							nomor_rekening_bersama: nomor_rekening,
							nama_tabungan_bersama: nama_tabungan,
							id_penanggung_jawab: id_pj,
							id_tingkat: id_tingkat,
							id_th_ajaran: id_ta,
							nama_wali: nama_wali,
							nomor_handphone: nomor_hp,
							keterangan_tabungan_bersama: keterangan_tabungan,
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
					Swal.fire("Dibatalkan!", "Edit Tabungan Bersama atas nama <b>" + nama_tabungan.toUpperCase() + " (" + nomor_rekening + ")</b> batal diubah.", "error");
					return false;
				}
			});

			return false;
		} else {
			Swal.fire({
				html: "Opps!, Pastikan Inputan Terisi dengan Benar & Tidak Boleh Kosong, Silahkan input ulang.",
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

	function show_joint_saving() {
		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/savings/get_all_joint_customer`,
			async: false,
			data: {
				start_date: lstart,
				end_date: lend,
			},
			dataType: "JSON",
			success: function (data) {
				var html = "";

				for (var i = 0; i < data.length; i++) {

					if (data[i].kredit_bersama != null) {
						var kredit = CurrencyID(data[i].kredit_bersama);
					} else if (data[i].kredit_bersama == null) {
						var kredit = CurrencyID(0);
					}

					if (data[i].debet_bersama != null) {
						var debet = CurrencyID(data[i].debet_bersama);
					} else if (data[i].debet_bersama == null) {
						var debet = CurrencyID(0);
					}

					if (data[i].saldo_bersama != null) {
						var saldo = CurrencyID(data[i].saldo_bersama);
					} else if (data[i].saldo_bersama == null) {
						var saldo = CurrencyID(0);
					}

					if (data[i].jenis_tabungan == "1") {
						var jenis_tabungan = "KOMITE";
						var color_nama_tab = "text-warning";
					} else if (data[i].jenis_tabungan == "2") {
						var jenis_tabungan = "KELAS";
						var color_nama_tab = "text-success";
					}

					if (data[i].nama_lengkap != null) {
						var nama_lengkap = data[i].nama_lengkap.toUpperCase();
						var color = "text-dark";
					} else if (data[i].nama_lengkap == null || data[i].nama_lengkap == "") {
						var nama_lengkap = "TIDAK TERDAFTAR";
						var color = "text-danger";
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

					var option = "<div class='dropdown dropdown-inline'>" +
						"<a href='javascript:;' class='btn btn-xs  btn-clean btn-icon btn-primary' data-toggle='dropdown'>" +
						"<i class='la la-cog'></i>" +
						"</a>" +
						"<div class='dropdown-menu dropdown-menu-sm dropdown-menu-right'>" +
						"<ul class='nav nav-hover flex-column'>" +
						"<li class='nav-item'><a href='javascript:void(0);' class='nav-link edit_joint' data-id_tabungan_bersama='" + data[i].id_tabungan_bersama + "' data-id_penanggung_jawab='" + data[i].id_penanggung_jawab +
						"' data-nomor_rekening_bersama='" + data[i].nomor_rekening_bersama + "' data-nama_tabungan_bersama='" + data[i].nama_tabungan_bersama + "' data-id_tingkat='" + data[i].id_tingkat +
						"' data-nomor_handphone='" + data[i].nomor_handphone + "' data-id_th_ajaran='" + data[i].id_th_ajaran + "' data-nama_th_ajaran='" + data[i].tahun_ajaran + "' data-keterangan_tabungan_bersama='" + data[i].keterangan_tabungan_bersama +
						"' data-nama_lengkap='" + data[i].nama_lengkap + "' data-nama_wali='" + data[i].nama_wali + "' data-nama_wali='" + data[i].nama_wali + "' data-nomor_handphone='" + data[i].nomor_handphone + "' data-jenis_tabungan='" + data[i].jenis_tabungan +
						"' href='javascript:void(0);'><i class='nav-icon la la-pencil-ruler text-warning'></i><span class='nav-text text-warning font-weight-bold text-hover-primary'>Edit Tabungan</span></a></li>" +
						"</ul>" +
						"</div>" +
						"</div>";

					html +=
						"<tr>" +
						"<td>" +
						`${data[i].id_tabungan_bersama}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${data[i].nomor_rekening_bersama}` +
						"</td>" +
						"<td class='font-weight-bolder'>" +
						`${data[i].nama_tabungan_bersama.toUpperCase()}` +
						"</td>" +
						"<td class='font-weight-bolder " + color + "' >" +
						`${nama_lengkap}` +
						"</td>" +
						"<td>" +
						`${data[i].nomor_handphone}` +
						"</td>" +
						"<td>" +
						`${data[i].email}` +
						"</td>" +
						'<td class="">' +
						`${data[i].tahun_ajaran}` +
						"</td>" +
						'<td class="font-weight-bolder">' +
						`${nama_tingkat}` +
						"</td>" +
						"<td>" +
						`${kredit}` +
						"</td>" +
						'<td class="">' +
						`${debet}` +
						"</td>" +
						'<td class="">' +
						`${saldo}` +
						"</td>" +
						'<td class="font-weight-bolder ' + color_nama_tab + '">' +
						`${jenis_tabungan}` +
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


