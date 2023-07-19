$(document).ready(function () {

	$(".findNasabahKredit").select2({
		placeholder: "Cari Siswa",
		allowClear: true,
	});

	$(".findNasabahDebet").select2({
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
		$("#userJumlahSaldo").html(0);
	});

	$("#modalDebet").on("hidden.bs.modal", function () {
		$("#inputNominalDebet").val("");
		$("#userDebet").html("username");
		$("#inputNISDebet").val("");
		$("#inputNIPDebet").val("");
		$("#cekSaldo").val("");
		$("#userJumlahSaldo2").html(0);
	});

	$("#modalRekap").on("hidden.bs.modal", function () {
		$("#inputNISRekap").val("");
		$("#userRekap").html("username");
	});


	$("#findNasabahKredit").on("change", function () {
		var nis = $("#findNasabahKredit").find(":selected").val();
		var nama = $("#findNasabahKredit").find(":selected").text();
		// var HOST_URL = "<?php echo base_url('admin/getMemberInfo/'); ?>" + nis;
		$.ajax({
			type: "ajax",
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
			type: "ajax",
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
			type: "ajax",
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
			type: "ajax",
			url: `${HOST_URL}finance/savings/savings/get_all_student`,
			dataType: "JSON",
			async: false,
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
		nominal = nominal.replace(/\./g, "");

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
							setTimeout(function() {
								location.reload();
							}, 1000);
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

	$("#btnInputDebet").on("click", function () {
		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		var nis = $('#findNasabahDebet').find(":selected").val();
		var nama = $('#findNasabahDebet').find(":selected").text();
		var saldo = document.getElementById("userJumlahSaldoDebet").textContent;
		var nominal = $("#inputNominalDebet").val();
		var catatan = $("#inputCatatanDebet").val();
		var tahun_ajaran = $("#inputTahunAjaranDebet").val()
		var tanggal_transaksi = $("#inputTanggalDebet").val()
		nominal = nominal.replace(/\./g, "");
		saldo = saldo.replace(/\./g, "");

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
								setTimeout(function() {
									location.reload();
								}, 1000);
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


});
