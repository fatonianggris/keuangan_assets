/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _personalsaving;

		var _handlePersonalForm = function () {
			var validation;
			var form = KTUtil.getById('kt_add_personal_saving')
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
									url: HOST_URL + 'finance/savings/check_number_personal_saving',
								},
								stringLength: {
									max: 6,
									min: 5,
									message: 'Nomor Rekening harus memiliki 5 sampai 6 karakter'
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
									message: 'Nominal Saldo harus lebih atau sama dengan Rp. 2.000',
									min: 2000,
								},
								callback: {
									message: 'Wajib Mengisi Salah Satu Saldo Tabungan',
									callback: function (value, validator, field) {
										var umum = document.getElementById('input_saldo_tabungan_umum');
										var qurban = document.getElementById('input_saldo_tabungan_qurban');
										var wisata = document.getElementById('input_saldo_tabungan_wisata');
										var nilai_qurban_old = qurban.value;
										var nilai_wisata_old = wisata.value;

										if (umum.value || qurban.value || wisata.value) {
											validation.resetField('input_saldo_tabungan_qurban', true);
											validation.resetField('input_saldo_tabungan_wisata', true);
											qurban.value = nilai_qurban_old;
											wisata.value = nilai_wisata_old;
											return true;
										}
										return false;
									}
								}
							}
						},
						input_saldo_tabungan_qurban: {
							validators: {
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: ''
								},
								greaterThan: {
									message: 'Nominal Saldo harus lebih atau sama dengan dari Rp. 2.000',
									min: 2000,
								},
								callback: {
									message: 'Wajib Mengisi Salah Satu Saldo Tabungan',
									callback: function (value, validator, field) {
										var umum = document.getElementById('input_saldo_tabungan_umum');
										var qurban = document.getElementById('input_saldo_tabungan_qurban');
										var wisata = document.getElementById('input_saldo_tabungan_wisata');
										var nilai_umum_old = umum.value;
										var nilai_wisata_old = wisata.value;

										if (umum.value || qurban.value || wisata.value) {
											validation.resetField('input_saldo_tabungan_umum', true);
											validation.resetField('input_saldo_tabungan_wisata', true);
											umum.value = nilai_umum_old;
											wisata.value = nilai_wisata_old;
											return true;
										}
										return false;
									}
								}
							}
						},
						input_saldo_tabungan_wisata: {
							validators: {
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: ''
								},
								greaterThan: {
									message: 'Nominal Saldo harus lebih atau sama dengan dari Rp. 2.000',
									min: 2000,
								},
								callback: {
									message: 'Wajib Mengisi Salah Satu Saldo Tabungan',
									callback: function (value, validator, field) {
										var umum = document.getElementById('input_saldo_tabungan_umum');
										var qurban = document.getElementById('input_saldo_tabungan_qurban');
										var wisata = document.getElementById('input_saldo_tabungan_wisata');
										var nilai_umum_old = umum.value;
										var nilai_qurban_old = qurban.value;

										if (umum.value || qurban.value || wisata.value) {
											validation.resetField('input_saldo_tabungan_umum', true);
											validation.resetField('input_saldo_tabungan_qurban', true);
											umum.value = nilai_umum_old;
											qurban.value = nilai_qurban_old;
											return true;
										}
										return false;
									}

								}
							}
						},
						input_nama_wali: {
							validators: {
								regexp: {
									regexp: /^[a-zs\s.()-]+$/i,
									message: 'Inputan harus berupa huruf'
								}
							}
						},
						input_tanggal_transaksi: {
							validators: {
								notEmpty: {
									message: 'Tanggal Transaksi diperlukan'
								},
							}
						},
						input_nomor_hp_wali: {
							validators: {
								integer: {
									message: 'Inputan harus Angka',
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

			_personalsaving.on('submit', function (wizard) {
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
