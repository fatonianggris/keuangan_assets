/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _credit_edit;
		var _debet_edit;

		var _handleCreditFormEdit = function () {
			var validation;
			var form = KTUtil.getById('kt_add_transaction_credit_edit')
			var submitButton = form.querySelector('[type="submit"]');
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						nis_kredit: {
							validators: {
								notEmpty: {
									message: 'NIS/Rekening Siswa diperlukan'
								},
								stringLength: {
									max: 6,
									min: 6,
									message: 'Nomor Rekening harus memiliki 6 karakter'
								}
							}
						},
						nominal_kredit: {
							validators: {
								notEmpty: {
									message: 'Nominal Kredit diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: ''
								},
								greaterThan: {
									message: 'Nominal Setoran harus lebih atau sama dengan Rp. 5.000',
									min: 5000,
								},
							}
						},
						th_ajaran_kredit: {
							validators: {
								notEmpty: {
									message: 'Tahun Ajaran diperlukan'
								},
							}
						},
						waktu_transaksi_kredit: {
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

			_credit_edit.on('submit', function (wizard) {
				if (validation) {
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
			var form = KTUtil.getById('kt_add_transaction_debet_edit')
			var submitButton = form.querySelector('[type="submit"]');
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						nis_debet: {
							validators: {
								notEmpty: {
									message: 'NIS/Rekening Siswa diperlukan'
								},
							}
						},
						nominal_debet: {
							validators: {
								notEmpty: {
									message: 'Nominal Debit diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: ''
								},
								greaterThan: {
									message: 'Nominal Penarikan harus lebih atau sama dengan Rp. 5.000',
									min: 5000,
								},
							}
						},
						th_ajaran_debet: {
							validators: {
								notEmpty: {
									message: 'Tahun Ajaran diperlukan'
								},
							}
						},
						waktu_transaksi_debet: {
							validators: {
								notEmpty: {
									message: 'Tanggal Debit diperlukan'
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

			_debet_edit.on('submit', function (wizard) {
				if (validation) {
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