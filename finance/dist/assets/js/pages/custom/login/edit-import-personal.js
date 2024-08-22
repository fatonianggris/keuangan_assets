/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _edit_personal;

		var _handlePersonalForm = function () {
			var validation;

			var edit_button = document.querySelectorAll('.edit_nasabah');
			var form = KTUtil.getById('kt_form_edit_personal');
			var submitButton = form.querySelector('[type="submit"]');
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						nis_siswa: {
							validators: {
								notEmpty: {
									message: 'Nomor Rekening Nasabah diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
								},
								remote: {
									url: HOST_URL + 'finance/savings/check_number_import_personal_saving',
									method: 'POST',
									data: function () {
										return {
											old_nis: form.querySelector('[name="old_nis"]').value,
										};
									},
									message: 'Nomor Rekening telah digunakan, inputkan Nomor Rekening lain!',
								},
								stringLength: {
									max: 7,
									min: 5,
									message: 'Nomor Rekening harus memiliki 5 sampai 7 karakter'
								}
							}
						},
						nama_siswa: {
							validators: {
								notEmpty: {
									message: 'Nama Siswa diperlukan'
								},
								regexp: {
									regexp: /^[a-zs\s.()-]+$/i,
									message: 'Inputan harus berupa huruf'
								},
								remote: {
									message: 'Nama Siswa duplikat di file Excel',
									method: 'POST',
									url: HOST_URL + 'finance/savings/check_name_import_personal_saving',
									data: function () {
										return {
											nis_siswa: form.querySelector('[name="nis_siswa"]').value,
											nama: form.querySelector('[name="nama_siswa"]').value,
											old_nama: form.querySelector('[name="old_nama_siswa"]').value,
										};
									},
								},
							}
						},
						level_tingkat: {
							validators: {
								notEmpty: {
									message: 'Tingkat diperlukan'
								},
							}
						},
						email_wali: {
							validators: {
								emailAddress: {
									message: 'Email anda tidak valid'
								}
							}
						},
						nama_wali: {
							validators: {
								regexp: {
									regexp: /^[a-zs\s.()-]+$/i,
									message: 'Inputan harus berupa huruf'
								}
							}
						},
						nomor_handphone_wali: {
							validators: {
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
								},
							}
						},
						saldo_umum: {
							validators: {
								notEmpty: {
									message: 'Nominal Saldo Umum diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: ''
								},
								greaterThan: {
									message: 'Nominal Saldo tidak boleh kurang dari 0',
									min: 0,
								},
							}
						},
						saldo_qurban: {
							validators: {
								notEmpty: {
									message: 'Nominal Saldo Qurban diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: ''
								},
								greaterThan: {
									message: 'Nominal Saldo tidak boleh kurang dari 0',
									min: 0,
								},
							}
						},
						saldo_wisata: {
							validators: {
								notEmpty: {
									message: 'Nominal Saldo Wisata diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: ''
								},
								greaterThan: {
									message: 'Nominal Saldo tidak boleh kurang dari 0',
									min: 0,
								},
							}
						},

					},
					plugins: {
						trigger: new FormValidation.plugins.Trigger(),
						bootstrap: new FormValidation.plugins.Bootstrap(),
						fieldStatus: new FormValidation.plugins.FieldStatus({
							onStatusChanged: function (areFieldsValid) {
								areFieldsValid
									// Enable the submit button
									// so user has a chance to submit the form again
									? submitButton.removeAttribute('disabled')
									// Disable the submit button
									: submitButton.setAttribute('disabled', 'disabled');
							}
						})
					}
				}
			);

			for (let i = 0; i < edit_button.length; i++) {
				edit_button[i].addEventListener('click', function () {
					validation.resetForm(true);
				});
			}

			$("#btnUpdateNasabah").on("click", function () {
				if (validation) {
					validation.validate().then(function (status) {
						if (status == 'Valid') {
							
							var csrfName = $('.txt_csrfname').attr('name');
							var csrfHash = $('.txt_csrfname').val(); // CSRF hash

							var id_nasabah = $('[name="id_nasabah"]').val();
							var nis = $('[name="nis_siswa"]').val();
							var old_nis = $('[name="old_nis"]').val();
							var nama = $('[name="nama_siswa"]').val();
							var old_nama = $('[name="old_nama_siswa"]').val();
							var level_tingkat = $('[name="level_tingkat"]').val();
							var tanggal_transaksi = $('[name="tanggal_transaksi"]').val()
							var nama_wali = $('[name="nama_wali"]').val();
							var email_wali = $('[name="email_wali"]').val()
							var nomor_handphone_wali = $('[name="nomor_handphone_wali"]').val();

							var saldo_umum = $('[name="saldo_umum"]').val();
							var saldo_qurban = $('[name="saldo_qurban"]').val()
							var saldo_wisata = $('[name="saldo_wisata"]').val();

							var th_ajaran = $('[name="th_ajaran"]').val();

							if (saldo_umum >= 0 && saldo_qurban >= 0 && saldo_wisata >= 0) {

								if (nis != null && nis != "" && nama != null && nama != "" && level_tingkat != null && level_tingkat != "" && tanggal_transaksi != null && tanggal_transaksi != "" && th_ajaran != null && th_ajaran != "") {

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

											$("#modalEditImportNasabah").modal("hide");
											KTApp.blockPage({
												overlayColor: '#FFA800',
												state: 'warning',
												size: 'lg',
												opacity: 0.1,
												message: 'Silahkan Tunggu...'
											});

											$.ajax({
												type: "POST",
												url: `${HOST_URL}/finance/savings/update_import_personal_saving`,
												dataType: "JSON",
												data: {
													id_nasabah: id_nasabah,
													nis: nis,
													old_nis: old_nis,
													nama_nasabah: nama,
													old_nama_nasabah: old_nama,
													tanggal_transaksi: tanggal_transaksi,
													tahun_ajaran: th_ajaran,
													tingkat: level_tingkat,
													nama_wali: nama_wali,
													nomor_hp_wali: nomor_handphone_wali,
													email_nasabah: email_wali,
													saldo_umum: saldo_umum,
													saldo_qurban: saldo_qurban,
													saldo_wisata: saldo_wisata,
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
							} else {
								Swal.fire({
									html: "Opps!, Pastikan Inputan Terisi dengan Benar & Nominal Tidak Boleh kurang dari 0 dan Kosong, Silahkan input ulang.",
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
						} else {
							Swal.fire({
								text: "Mohon Maaf, kemungkinan terjadi kesalahan pada pengisian Anda, Mohon menginputkan dengan benar.",
								icon: "error",
								buttonsStyling: false,
								confirmButtonText: "Oke!",
								customClass: {
									confirmButton: "btn font-weight-bold btn-primary"
								}
							}).then(function () {

							});
						}
					});
				}

				return false;
			});
		};

		// Public Functions
		return {
			// public functions
			init: function () {
				_handlePersonalForm();
			}
		};
	}();

	// Class Initialization
	jQuery(document).ready(function () {
		KTLogin.init();
	});

	/******/
})()
	;
//# sourceMappingURL=login-general.js.map
