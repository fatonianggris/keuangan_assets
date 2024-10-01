/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _employee_saving;

		var _handlePersonalForm = function () {
			var validation;
			var form = KTUtil.getById('kt_add_employee_saving')
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						input_nomor_rekening: {
							validators: {
								notEmpty: {
									message: 'Nomor Rekening Nasabah diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
								},
								remote: {
									message: 'Nomor Rekening telah digunakan, inputkan Nomor Rekening lain',
									method: 'POST',
									url: HOST_URL + 'finance/savings/check_number_employee_saving',
								},
								stringLength: {
									max: 8,
									min: 6,
									message: 'Nomor Rekening harus memiliki 6 sampai 8 karakter'
								}
							}
						},
						input_nama_nasabah: {
							validators: {
								notEmpty: {
									message: 'Nama Nasabah diperlukan'
								},
								regexp: {
									regexp: /^[a-zs\s.()-]+$/i,
									message: 'Inputan harus berupa huruf'
								}
							}
						},
						input_email_nasabah: {
							validators: {
								emailAddress: {
									message: 'Email anda tidak valid'
								}
							}
						},
						input_tahun_ajaran: {
							validators: {
								notEmpty: {
									message: 'Tahun Ajaran diperlukan'
								},
							}
						},
						input_tingkat: {
							validators: {
								notEmpty: {
									message: 'Tingkat diperlukan'
								},
							}
						},
						input_saldo_tabungan_umum: {
							validators: {
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: ''
								},
								greaterThan: {
									message: 'Nominal Saldo harus lebih atau sama dengan Rp. 1.000',
									min: 1000,
								},
							}
						},
						input_jenis_kelamin: {
							validators: {
								notEmpty: {
									message: 'Jenis Kelamin diperlukan'
								},
							}
						},
						input_tanggal_transaksi: {
							validators: {
								notEmpty: {
									message: 'Tanggal Transaksi diperlukan'
								},
							}
						},
						input_nomor_hp_pegawai: {
							validators: {
								integer: {
									message: 'Inputan harus Angka',
								},
							}
						},
						input_status_pegawai: {
							validators: {
								notEmpty: {
									message: 'Status Pegawai diperlukan'
								},
							}
						},
						input_jabatan_pegawai: {
							validators: {
								notEmpty: {
									message: 'Jabatan Pegawai diperlukan'
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

			_employee_saving.on('submit', function (wizard) {
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
