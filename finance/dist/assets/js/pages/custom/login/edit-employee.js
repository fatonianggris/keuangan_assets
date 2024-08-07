/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _edit_employee;

		var _handleEmployeeForm = function () {
			var validation;
			var form = KTUtil.getById('kt_form_edit_employee')
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						nama_pegawai: {
							validators: {
								notEmpty: {
									message: 'Nama Pegawai diperlukan'
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
						email_nasabah: {
							validators: {
								emailAddress: {
									message: 'Email Anda tidak valid'
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
						nomor_handphone_pegawai: {
							validators: {
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: ''
								},
							}
						},
						jenis_kelamin: {
							validators: {
								notEmpty: {
									message: 'Jenis Kelamin diperlukan'
								},
							}
						},
						th_ajaran: {
							validators: {
								notEmpty: {
									message: 'Tahun Ajaran diperlukan'
								},
							}
						},
						status_pegawai: {
							validators: {
								notEmpty: {
									message: 'Status Pegawai diperlukan'
								},
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

			_edit_employee.on('submit', function (wizard) {
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
				_edit_employee = $('#kt_form_edit_employee');
				_handleEmployeeForm();
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
