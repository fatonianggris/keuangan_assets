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
									max: 7,
									min: 7,
									message: 'Nomor Rekening harus memiliki 7 karakter'
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
						id_siswa_penanggung_jawab: {
							validators: {
								notEmpty: {
									message: 'Siswa Penanggung Jawab diperlukan'
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

			_edit_joint.on('submit', function (wizard) {
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
