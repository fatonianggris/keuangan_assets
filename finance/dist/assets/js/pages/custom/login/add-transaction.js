/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _credit;
		var _debet;
		var _recap;

		var _handleCreditForm = function () {
			var validation;
			var form = KTUtil.getById('kt_add_transaction_credit')
			var submitButton = form.querySelector('[type="submit"]');
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						inputCariSiswaKredit: {
							validators: {
								notEmpty: {
									message: 'NIS/Rekening Siswa diperlukan'
								},
								stringLength: {
									max: 7,
									min: 5,
									message: 'Nomor Rekening harus memiliki 5 sampai 7 karakter'
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
									// The default separators
									thousandsSeparator: ''
								},
								greaterThan: {
									message: 'Nominal Setoran harus lebih atau sama dengan Rp. 1.000',
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
						inputJenisTabungan: {
							validators: {
								notEmpty: {
									message: 'Jenis Tabungan diperlukan'
								},
							}
						},
						inputTingkatKredit: {
							validators: {
								notEmpty: {
									message: 'Tingkat diperlukan'
								},
							}
						},
						nama_nasabah: {
							validators: {
								regexp: {
									regexp: /^[a-zs\s.()-]+$/i,
									message: 'Inputan harus berupa huruf'
								}
							}
						},
						nama_orangtua: {
							validators: {
								regexp: {
									regexp: /^[a-zs\s.()-]+$/i,
									message: 'Inputan harus berupa huruf'
								}
							}
						},
						nomor_hp_aktif: {
							validators: {
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: ''
								},
							}
						},
						email_orangtua: {
							validators: {
								emailAddress: {
									message: 'Email anda tidak valid'
								}
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
						inputCariSiswaDebet: {
							validators: {
								notEmpty: {
									message: 'NIS/Rekening Siswa diperlukan'
								},
								stringLength: {
									max: 7,
									min: 5,
									message: 'Nomor Rekening harus memiliki 5 sampai 7 karakter'
								}
							}
						},
						inputNominalDebetName: {
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
									message: 'Nominal Penarikan harus lebih atau sama dengan Rp. 1.000',
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
									message: 'Tanggal Debit diperlukan'
								},
							}
						},
						inputTingkatDebet: {
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

		var _handleRecapForm = function () {
			var validation;
			var form = KTUtil.getById('kt_add_transaction_recap')
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						nis_siswa: {
							validators: {
								notEmpty: {
									message: 'NIS Siswa diperlukan'
								},
								stringLength: {
									max: 7,
									min: 5,
									message: 'Nomor Rekening harus memiliki 5 sampai 7 karakter'
								}
							}
						},
					},
					plugins: {
						trigger: new FormValidation.plugins.Trigger(),
						submitButton: new FormValidation.plugins.SubmitButton(),
						defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
						bootstrap: new FormValidation.plugins.Bootstrap()
					}
				}
			);

			_recap.on('submit', function (wizard) {
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
				_credit = $('#kt_form_credit');
				_debet = $('#kt_form_debet');
				_recap = $('#kt_form_recap');
				_handleCreditForm();
				_handleDebitForm();
				_handleRecapForm();
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
