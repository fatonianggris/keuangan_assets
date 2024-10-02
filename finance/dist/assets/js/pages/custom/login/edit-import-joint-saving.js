/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _edit_joint;

		var _handleJointForm = function () {
			var validation;

			var edit_button = document.querySelectorAll('.edit_joint');
			var form = KTUtil.getById('kt_form_edit_joint');
			var submitButton = form.querySelector('[type="submit"]');
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						nomor_rekening_bersama: {
							validators: {
								notEmpty: {
									message: 'Nomor Rekening Bersama diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
								},
								remote: {
									url: HOST_URL + 'finance/savings/check_number_import_joint_saving',
									method: 'POST',
									data: function () {
										return {
											old_nomor_rekening_bersama: form.querySelector('[name="old_nomor_rekening_bersama"]').value,
										};
									},
									message: 'Nomor Rekening telah digunakan, inputkan Nomor Rekening lain!',
								},
								stringLength: {
									max: 8,
									min: 6,
									message: 'Nomor Rekening harus memiliki 6-8 karakter'
								}
							}
						},
						nama_tabungan_bersama: {
							validators: {
								notEmpty: {
									message: 'Nama Tabungan Bersama diperlukan'
								},
							}
						},
						id_penanggung_jawab: {
							validators: {
								notEmpty: {
									message: 'Nama Penanggung Jawab diperlukan'
								},
							}
						},
						id_tingkat: {
							validators: {
								notEmpty: {
									message: 'Tingkat diperlukan'
								},
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
									thousandsSeparator: ''
								},
							}
						},
						id_th_ajaran: {
							validators: {
								notEmpty: {
									message: 'Tahun Ajaran diperlukan'
								},
							}
						},
						saldo_bersama: {
							validators: {
								notEmpty: {
									message: 'Nominal Saldo Bersama diperlukan'
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

			$("#btnUpdateTabungan").on("click", function () {
				if (validation) {
					validation.validate().then(function (status) {
						if (status == 'Valid') {
							var csrfName = $('.txt_csrfname').attr('name');
							var csrfHash = $('.txt_csrfname').val(); // CSRF hash

							var id_tabungan = $('[name="id_nasabah_bersama"]').val();
							var nomor_rekening = $('[name="nomor_rekening_bersama"]').val();
							var old_nomor_rekening = $('[name="old_nomor_rekening_bersama"]').val();
							var nama_tabungan = $('[name="nama_tabungan_bersama"]').val();
							var id_pj = $('[name="id_penanggung_jawab"]').val();
							var id_tingkat = $('[name="id_tingkat"]').val();
							var id_ta = $('[name="id_th_ajaran"]').val();
							var nama_wali = $('[name="nama_wali"]').val();
							var tanggal_transaksi = $('[name="tanggal_transaksi"]').val();
							var nomor_hp = $('[name="nomor_handphone_wali"]').val()
							var saldo_bersama = $('[name="saldo_bersama"]').val()

							if (saldo_bersama >= 0) {

								if (id_tabungan != null && id_tabungan != "" && nomor_rekening != null && nomor_rekening != "" && nama_tabungan != null && nama_tabungan != "" && id_pj != null && id_pj != "" && id_pj != "0" && id_tingkat != null && id_tingkat != "" && tanggal_transaksi != null && tanggal_transaksi != "") {

									Swal.fire({
										title: "Peringatan!",
										html: "Apakah anda yakin Mengupdate Nasabah Bersama atas nama <b>" + nama_tabungan.toUpperCase() + " (" + nomor_rekening + ")</b> ?",
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
												url: `${HOST_URL}/finance/savings/update_import_joint_saving`,
												dataType: "JSON",
												data: {
													id_nasabah_bersama: id_tabungan,
													nomor_rekening_bersama: nomor_rekening,
													old_nomor_rekening_bersama: old_nomor_rekening,
													nama_tabungan_bersama: nama_tabungan,
													id_penanggung_jawab: id_pj,
													id_tingkat: id_tingkat,
													id_th_ajaran: id_ta,
													nama_wali: nama_wali,
													nomor_handphone: nomor_hp,
													saldo_bersama: saldo_bersama,
													tanggal_transaksi: tanggal_transaksi,
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
											Swal.fire("Dibatalkan!", "Edit Nasabah Bersama atas nama <b>" + nama_tabungan.toUpperCase() + " (" + nomor_rekening + ")</b> batal diubah.", "error");
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
				_handleJointForm();
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
