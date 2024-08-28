/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _jointsave;

		var _handleJointForm = function () {
			var validation;
			var form = KTUtil.getById('kt_add_joint_saving')
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						input_nomor_rekening_bersama: {
							validators: {
								notEmpty: {
									message: 'Nomor Rekening Bersama diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
								},
								remote: {
									message: 'Nomor Rekening telah digunakan, inputkan Nomor Rekening lain',
									method: 'POST',
									url: HOST_URL + 'finance/savings/check_number_joint_saving',
								},
								stringLength: {
									max: 8,
									min: 7,
									message: 'Nomor Rekening harus memiliki 7-8 karakter'
								}
							}
						},
						input_nama_tabungan_bersama: {
							validators: {
								notEmpty: {
									message: 'Nama Tabungan Bersama diperlukan'
								},
							}
						},
						input_nominal_saldo: {
							validators: {
								notEmpty: {
									message: 'Nominal Saldo Awal diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: ''
								},
								greaterThan: {
									message: 'Nominal Saldo harus lebih dari Rp. 1.000',
									min: 1000,
								},
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
						input_nama_wali: {
							validators: {
								notEmpty: {
									message: 'Nama Wali Penanggung Jawab diperlukan'
								},
								regexp: {
									regexp: /^[a-zs\s.()-]+$/i,
									message: 'Inputan harus berupa huruf'
								}
							}
						},
						input_nomor_hp_wali: {
							validators: {
								notEmpty: {
									message: 'Nomor Wali Penanggung Jawab diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
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
						input_nama_siswa_penanggungjawab: {
							validators: {
								notEmpty: {
									message: 'Nama Siswa Penanggung Jawab diperlukan'
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

			_jointsave.on('submit', function (wizard) {
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
