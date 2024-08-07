$(document).ready(function () {

	$("#kt_datatable_income_du_invoice_success").on("click", ".edit_income_transition_du", function () {

		$("#modal_du").html("");

		var id_tagihan = $(this).data("id_tagihan");
		var id_invoice = $(this).data("id_invoice");
		var id_tahun_ajaran = $(this).data("id_tahun_ajaran");
		var nomor_bayar = $(this).data("nomor_bayar");
		var nama = $(this).data("nama");
		var level_tingkat = $(this).data("level_tingkat");
		var tanggal_invoice = $(this).data("tanggal_invoice");
		var informasi = $(this).data("informasi");
		var rincian = $(this).data("rincian");
		var nominal_tagihan = $(this).data("nominal_tagihan");
		var email = $(this).data("email");
		var nomor_hp = $(this).data("nomor_hp");
		var catatan = $(this).data("catatan");
		var tahun_ajaran = $(this).data("tahun_ajaran");

		var status_nomor_terdaftar = $(this).data("status_nomor_terdaftar");
		var status_nama_duplikat = $(this).data("status_nama_duplikat");
		var status_invoice_duplikat = $(this).data("status_invoice_duplikat");

		if (level_tingkat == "1") {
			var nama_tingkat = "KB";
		} else if (level_tingkat == "2") {
			var nama_tingkat = "TK";
		} else if (level_tingkat == "3") {
			var nama_tingkat = "SD";
		} else if (level_tingkat == "4") {
			var nama_tingkat = "SMP";
		} else if (level_tingkat == "6") {
			var nama_tingkat = "DC";
		}

		if (status_nomor_terdaftar == "1") {
			var nomor_terdaftar = "<p class='font-weight-boldest display-4 text-success text-center'>TERDAFTAR</p>";
		} else if (status_nomor_terdaftar == "2") {
			var nomor_terdaftar = "<p class='font-weight-boldest display-4 text-warning text-center'>TIDAK TERDAFTAR</p>";
		} else {
			var nomor_terdaftar = "<p class='font-weight-boldest display-4 text-danger text-center'>DUPLIKAT</p>";
		}

		if (status_nama_duplikat == "1") {
			var nama_duplikat = "<p class='font-weight-boldest display-4 text-success text-center'>MIRIP</p>";
		} else if (status_nama_duplikat == "2") {
			var nama_duplikat = "<p class='font-weight-boldest display-4 text-warning text-center'>TIDAK TERDAFTAR</p>";
		} else {
			var nama_duplikat = "<p class='font-weight-boldest display-4 text-danger text-center'>DUPLIKAT</p>";
		}

		if (status_invoice_duplikat == "1") {
			var invoice_duplikat = "<p class='font-weight-boldest display-4 text-success text-center'>TIDAK DUPLIKAT</p>";
		} else {
			var invoice_duplikat = "<p class='font-weight-boldest display-4 text-danger text-center'>DUPLIKAT</p>";
		}

		$.ajax({
			type: "GET",
			url: `${HOST_URL}/finance/income/get_name_similliar/${nama.replace(/'/g, '')}`,
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
							`${data.data[i].nomor_pembayaran_dpb}` +
							"</td>" +
							"<td class='font-weight-bolder text-danger'>" +
							`${data.data[i].nomor_pembayaran_du}` +
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
							`${data.data[i].tahun_ajaran}` +
							"</td>" +
							"<td class='font-weight-bolder text-danger'>" +
							`${data.data[i].score}` +
							"</td>" +
							"</tr>";
					}

					$("#modal_du").html("<div class='alert alert-danger text-center font-weight-bold' role='alert'>"
						+ `${String(data.messages)}`
						+ "</div>"
						+ "<table class='table table-separate table-hover table-light-dark table-checkable'>"
						+ "<thead>"
						+ "<tr>"
						+ "<th>Nomor DPB</th>"
						+ "<th>Nomor DU</th>"
						+ "<th>Nama</th>"
						+ "<th>Tingkat</th>"
						+ "<th>Email</th>"
						+ "<th>Nomor HP</th>"
						+ "<th>Tahun Ajaran</th>"
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
						+ "</tr>"
						+ "</tfoot>"
						+ "</table>");
				} else {

				}
			},
		});

		$('[name="id_tagihan"]').val(id_tagihan);
		$('[name="id_invoice"]').val(id_invoice);
		$('[name="old_id_invoice"]').val(id_invoice);
		$('[name="nomor_bayar"]').val(nomor_bayar);
		$('[name="old_nomor_bayar"]').val(nomor_bayar);
		$('[name="nama"]').val(nama);
		$('[name="old_nama"]').val(nama);
		$('[name="tanggal_invoice"]').val(tanggal_invoice);
		$('[name="informasi"]').text(informasi);
		$('[name="rincian"]').text(rincian);
		$('[name="nominal_tagihan"]').val(nominal_tagihan);
		$('[name="email"]').val(email);
		$('[name="nomor_hp"]').val(nomor_hp);
		$('[name="catatan"]').text(catatan);
		$('[name="tahun_ajaran"] option:selected').remove();
		$('[name="tahun_ajaran"]').prepend($("<option selected></option>").attr("value", id_tahun_ajaran).text(tahun_ajaran));
		$('[name="level_tingkat"] option:selected').remove();
		$('[name="level_tingkat"]').prepend($("<option selected></option>").attr("value", level_tingkat).text(nama_tingkat));

		$("#nomorInvoiceTagihanEdit").html("(" + id_invoice + ")");
		$("#status_nomor_bayar").html(nomor_terdaftar);
		$("#status_nama").html(nama_duplikat);
		$("#status_nomor_invoice").html(invoice_duplikat);

		$('#kt_edit_income_du_transaction').attr('action', `${HOST_URL}finance/income/update_income_du_transition/` + id_tagihan);

		$("#modalEditDUTransition").modal("show");

	});


	$("#kt_datatable_income_du_invoice_success").on("click", ".delete_income_transition_du", function () {
		var id_tagihan = $(this).data("id_tagihan");
		var id_invoice = $(this).data("id_invoice");
		var nomor_bayar = $(this).data("nomor_bayar");
		var nama = $(this).data("nama");
		var nominal_tagihan = $(this).data("nominal_tagihan");

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
			html: "Apakah anda yakin ingin menghapus Tagihan DU <b>" + id_invoice + "</b> atas nama <b>'" +
				nama.toUpperCase() + "' (" + nomor_bayar + ")</b> dengan nominal Tagihan (Rp. " + CurrencyID(nominal_tagihan) + ") ? <br></br> <div id='recaptcha_delete'></div>",
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
					url: `${HOST_URL}/finance/income/delete_income_du_transition`,
					data: {
						id_tagihan: id_tagihan,
						id_invoice: id_invoice,
						nomor_bayar: nomor_bayar,
						nama: nama,
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
				Swal.fire("Dibatalkan!", "Penghapusan Transaksi Umum <b>" + nomor_transaksi + "</b> (" + jenis_transaksi + ")  atas nama <b>'" + nama_siswa.toUpperCase() + "'</b> (" + nis_siswa + ") batal dihapus.", "error");
				return false;
			}
		});
		return false;
	});

	function CurrencyID(nominal) {
		var formatter = new Intl.NumberFormat("id-ID", {
			currency: "IDR",
			minimumFractionDigits: 0,
		});
		return formatter.format(nominal);
	}

});





