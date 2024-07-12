/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _edit_personal;

		var _handlePersonalForm = function () {
			var validation;

			var edit_button = document.querySelectorAll('.edit_nasabah');
			var form = KTUtil.getById('kt_form_edit_import_personal')
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
									data: {
										old_nis: form.querySelector('[name="old_nis"]').value
									},
									message: 'Nomor Rekening telah digunakan, inputkan Nomor Rekening lain!',
									method: 'POST',
									url: HOST_URL + 'finance/savings/check_number_import_personal_saving',
								},
								stringLength: {
									max: 6,
									min: 5,
									message: 'Nomor Rekening harus memiliki 5 sampai 6 karakter'
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
								}
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

			_edit_personal.on('submit', function (wizard) {
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
				_edit_personal = $('#kt_form_edit_import_personal');
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
