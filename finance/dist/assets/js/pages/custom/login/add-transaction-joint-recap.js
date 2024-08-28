/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _credit;
		var _debet;

		var _handleCreditForm = function () {
			var validation;
			var form = KTUtil.getById('kt_add_transaction_credit')
			var submitButton = form.querySelector('[type="submit"]');
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						inputCariTabunganKredit: {
							validators: {
								notEmpty: {
									message: 'Nomor Rekening Tabungan diperlukan'
								},
								stringLength: {
									max: 8,
									min: 7,
									message: 'Nomor Rekening harus memiliki 7-8 karakter'
								}
							}
						},
						inputNominalKreditName: {
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
						inputTahunAjaranKredit: {
							validators: {
								notEmpty: {
									message: 'Tahun Ajaran diperlukan'
								},
							}
						},
						inputTanggalKredit: {
							validators: {
								notEmpty: {
									message: 'Tanggal Kredit diperlukan'
								},
							}
						},
						input_tingkat_kredit: {
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

			_credit.on('submit', function (wizard) {
				wizard.preventDefault();
				if (validation && window.bundleObj.getOTPKredit() === true) {
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

		var _handleDebitForm = function () {
			var validation;
			var form = KTUtil.getById('kt_add_transaction_debet')
			var submitButton = form.querySelector('[type="submit"]');
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						inputCariTabunganDebet: {
							validators: {
								notEmpty: {
									message: 'Nomor Rekening Tabungan diperlukan'
								},
								stringLength: {
									max: 8,
									min: 7,
									message: 'Nomor Rekening harus memiliki 7-8 karakter'
								}
							}
						},
						inputNominalDebetName: {
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
						inputTahunAjaranDebet: {
							validators: {
								notEmpty: {
									message: 'Tahun Ajaran diperlukan'
								},
							}
						},
						inputTanggalDebet: {
							validators: {
								notEmpty: {
									message: 'Tanggal Debet diperlukan'
								},
							}
						},
						input_tingkat_debet: {
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

			_debet.on('submit', function (wizard) {
				wizard.preventDefault();
				if (validation && window.bundleObj.getOTPDebet() === true) {
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
				_credit = $('#kt_form_credit');
				_debet = $('#kt_form_debet');

				_handleCreditForm();
				_handleDebitForm();

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
