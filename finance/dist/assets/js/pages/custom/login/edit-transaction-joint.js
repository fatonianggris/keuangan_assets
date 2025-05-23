/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _credit_edit;
		var _debet_edit;

		var _handleCreditFormEdit = function () {
			var validation;
			var edit_button = document.querySelectorAll('.edit_transaksi_kredit');
			var form = KTUtil.getById('kt_add_transaction_credit_edit');
			var submitButton = form.querySelector('[type="submit"]');
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						nomor_rekening_kredit_edit: {
							validators: {
								notEmpty: {
									message: 'Nomor Rekening Tabungan diperlukan'
								},
								stringLength: {
									max: 8,
									min: 6,
									message: 'Nomor Rekening harus memiliki 6-8 karakter'
								}
							}
						},
						nominal_kredit_edit: {
							validators: {
								notEmpty: {
									message: 'Nominal Kredit diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
								},
								greaterThan: {
									message: 'Nominal Saldo harus lebih atau sama dengan Rp. 1.000',
									min: 1000,
								},
							}
						},
						th_ajaran_kredit_edit: {
							validators: {
								notEmpty: {
									message: 'Tahun Ajaran diperlukan'
								},
							}
						},
						waktu_transaksi_kredit_edit: {
							validators: {
								notEmpty: {
									message: 'Tanggal Kredit diperlukan'
								},
							}
						},
						tingkat_kredit_edit: {
							validators: {
								notEmpty: {
									message: 'Tingkat diperlukan'
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

			_credit_edit.on('submit', function (wizard) {
				wizard.preventDefault();
				if (validation && window.bundleObj.getOTPDebetEdit() === true) {
					validation.validate().then(function (status) {
						if (status == 'Valid') {
							form.submit(); // Submit form
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
								KTUtil.scrollTop();
							});
						}
					});
				}
			});
		};

		var _handleDebitFormEdit = function () {
			var validation;
			var edit_button = document.querySelectorAll('.edit_transaksi_debet');
			var form = KTUtil.getById('kt_add_transaction_debet_edit');
			var submitButton = form.querySelector('[type="submit"]');
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						nomor_rekening_debet_edit: {
							validators: {
								notEmpty: {
									message: 'Nomor Rekening Tabungan diperlukan'
								},
								stringLength: {
									max: 8,
									min: 6,
									message: 'Nomor Rekening harus memiliki 6-8 karakter'
								}
							}
						},
						nominal_debet_edit: {
							validators: {
								notEmpty: {
									message: 'Nominal Debet diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
								},
								greaterThan: {
									message: 'Nominal Saldo harus lebih atau sama dengan Rp. 1.000',
									min: 1000,
								},
							}
						},
						th_ajaran_debet_edit: {
							validators: {
								notEmpty: {
									message: 'Tahun Ajaran diperlukan'
								},
							}
						},
						waktu_transaksi_debet_edit: {
							validators: {
								notEmpty: {
									message: 'Tanggal Debet diperlukan'
								},
							}
						},
						tingkat_debet_edit: {
							validators: {
								notEmpty: {
									message: 'Tingkat diperlukan'
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

			_debet_edit.on('submit', function (wizard) {
				wizard.preventDefault();
				if (validation && window.bundleObj.getOTPDebetEdit() === true) {
					validation.validate().then(function (status) {
						if (status == 'Valid') {
							form.submit(); // Submit form
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
				_credit_edit = $('#kt_form_credit_edit');
				_debet_edit = $('#kt_form_debet_edit');
				_handleCreditFormEdit();
				_handleDebitFormEdit();
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
