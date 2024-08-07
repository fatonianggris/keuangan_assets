/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _login;

		var _handleSignInForm = function () {
			var validation;
			var edit_button = document.querySelectorAll('.edit_income_transition_du');
			var form = KTUtil.getById('kt_edit_income_du_transaction');
			var submitButton = form.querySelector('[type="submit"]');
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						id_invoice: {
							validators: {
								notEmpty: {
									message: 'ID Invoice Tagihan diperlukan'
								},
								remote: {
									message: 'ID Invoice telah digunakan',
									method: 'POST',
									url: HOST_URL + 'finance/income/income/check_invoice_number_du_transition',
									data: function () {
										return {
											nomor_invoice: form.querySelector('[name="id_invoice"]').value,
											old_nomor_invoice: form.querySelector('[name="old_id_invoice"]').value,
										};
									},
								},
							}
						},
						nomor_bayar: {
							validators: {
								notEmpty: {
									message: 'Nomor Bayar diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: '',
									decimalSeparator: ''
								},
								remote: {
									message: 'Nomor Pembayaran duplikat di file Excel',
									method: 'POST',
									url: HOST_URL + 'finance/income/income/check_payment_number_du_transition',
									data: function () {
										return {
											nomor_pembayaran: form.querySelector('[name="nomor_bayar"]').value,
											old_nomor_pembayaran: form.querySelector('[name="old_nomor_bayar"]').value,
										};
									},
								},
							}
						},
						nominal_tagihan: {
							validators: {
								notEmpty: {
									message: 'Total Nominal diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: '',
								},
							}
						},
						nama: {
							validators: {
								notEmpty: {
									message: 'Nama Tertagih diperlukan'
								},
								regexp: {
									regexp: /^[a-zs\s.()-]+$/i,
									message: 'Inputan harus berupa huruf'
								},
								remote: {
									message: 'Nama Tertagih duplikat di file Excel',
									method: 'POST',
									url: HOST_URL + 'finance/income/income/check_name_du_transition',
									data: function () {
										return {
											nama: form.querySelector('[name="nama"]').value,
											old_nama: form.querySelector('[name="old_nama"]').value,
										};
									},
								},
							},

						},
						tanggal_invoice: {
							validators: {
								notEmpty: {
									message: 'Tanggal Invoice diperlukan'
								}
							}
						},
						tahun_ajaran: {
							validators: {
								notEmpty: {
									message: 'Tahun Ajaran diperlukan'
								},
							}
						},
						level_tingkat: {
							validators: {
								notEmpty: {
									message: 'Tingkt diperlukan'
								},
							}
						},
						email: {
							validators: {
								emailAddress: {
									message: 'Email anda tidak valid'
								}
							}
						},
						nomor_hp: {
							validators: {
								integer: {
									message: 'Inputan harus Angka',
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

			_login.on('submit', function (wizard) {
				if (validation) {
					validation.validate().then(function (status) {
						if (status == 'Valid') {
							Swal.fire({
								title: "Peringatan!",
								html: "Apakah anda yakin ingin <b>MENYETUJUI</b> Update Data Tagihan DU ini?",
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
								confirmButtonColor: "#1BC5BD",
								confirmButtonText: "Ya, Setuju!",
								cancelButtonText: "Tidak, Nanti saja!",
								showLoaderOnConfirm: true,
								closeOnConfirm: false,
								closeOnCancel: true,
								preConfirm: (text) => {
									return $.ajax({
										type: "post",
										url: `${HOST_URL}/finance/income/income/confirm_update_income`,
										data: { password: text },
										dataType: 'html',
										success: function (result) {
											if (result == 1) {
												Swal.fire("Berhasil!", "Persetujuan Update Data Tagihan DU telah dilakukan.", "success");
												setTimeout(function () {
													KTApp.blockPage({
														overlayColor: '#FFA800',
														state: 'warning',
														size: 'lg',
														opacity: 0.1,
														message: 'Silahkan Tunggu...'
													});
													form.submit(); // Submit form
												}, 1000);
											} else {
												Swal.fire("Opsss!", "Password Anda Salah. Ulangi kembali", "error");
											}
										},
										error: function (result) {
											console.log(result);
											Swal.fire("Opsss!", "Koneksi Internet Bermasalah.", "error");
										}
									});
								},
								allowOutsideClick: () => !Swal.isLoading()
							}).then(function (result) {
								if (!result.isConfirm) {
									Swal.fire("Dibatalkan!", "Persetujuan Update Data Tagihan DU telah dibatalkan.", "error");
								}
							});

						} else {
							Swal.fire({
								html: "Mohon Maaf, kemungkinan terjadi kesalahan pada pengisian Anda, Mohon menginputkan dengan benar.",
								icon: "error",
								buttonsStyling: false,
								confirmButtonText: "Oke!",
								customClass: {
									confirmButton: "btn font-weight-bold btn-primary"
								}
							}).then(function () {
								KTUtil.scrollTop();
							});
						}
					});
				}
			});
		};

		// Public Functions
		return {
			// public functions
			init: function () {
				_login = $('#kt_form');
				_handleSignInForm();
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
