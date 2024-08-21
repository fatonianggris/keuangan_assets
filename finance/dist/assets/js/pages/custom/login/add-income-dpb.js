/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _login;

		var _handleSignInForm = function () {
			var validation;
			var status = true;
			var form = KTUtil.getById('kt_add_income_dpb_form');
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						nomor_invoice: {
							validators: {
								notEmpty: {
									message: 'Nomor Invoice Tagihan diperlukan'
								},
								remote: {
									message: 'Nomor Invoice telah digunakan',
									method: 'POST',
									url: HOST_URL + 'finance/income/income/check_invoice_number_dpb_add',
									data: function () {
										return {
											nomor_invoice: form.querySelector('[name="nomor_invoice"]').value
										};
									},
								},
							}
						},
						nomor_pembayaran: {
							validators: {
								notEmpty: {
									message: 'Nomor Pembayaran diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: '',
									decimalSeparator: ''
								},
								remote: {
									message: 'Nomor Pembayaran telah digunakan',
									method: 'POST',
									url: HOST_URL + 'finance/income/income/check_payment_number_dpb_add',
									data: function () {
										return {
											nama: form.querySelector('[name="nama_siswa"]').value
										};
									}
								}
							}
						},
						nominal_tagihan: {
							validators: {
								notEmpty: {
									message: 'Total Nominal diperlukan'
								},
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: '',
									decimalSeparator: ''
								},
							}
						},
						tahun_ajaran: {
							validators: {
								notEmpty: {
									message: 'Tahun Ajaran diperlukan'
								},
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
							},
						},
						nis: {
							validators: {
								notEmpty: {
									message: 'NIS Siswa diperlukan'
								},
							}
						},
						email: {
							validators: {
								emailAddress: {
									message: 'Email anda tidak valid'
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
						nomor_hp: {
							validators: {
								integer: {
									message: 'Inputan harus Angka',
									// The default separators
									thousandsSeparator: ''
								},
							}
						},
						tanggal_invoice: {
							validators: {
								notEmpty: {
									message: 'Tanggal Invoice diperlukan'
								}
							}
						},
					},
					plugins: {
						trigger: new FormValidation.plugins.Trigger(),
						submitButton: new FormValidation.plugins.SubmitButton(),
						bootstrap: new FormValidation.plugins.Bootstrap()
					}
				}
			);

			validation.on('core.validator.validated', function (data) {

				if (data.field === 'nomor_invoice' && (data.validator === 'notEmpty' || data.validator === 'regexp')) {
					if (data.result.valid === true) {
						setTimeout(function() {
							//your code to be executed after 1 second
							validation.validateField('nomor_pembayaran');
						  }, 1000);
					}
				}

				if (data.field === 'nama_siswa' && (data.validator === 'notEmpty' || data.validator === 'regexp')) {
					if (data.result.valid === true) {
						validation.validateField('nomor_pembayaran');
					}
				}

				if (data.field === 'nomor_pembayaran' && data.validator === 'integer') {
					if (data.result.valid === false) {
						status = false;
					} else {
						status = true;
					}
				}

				if (data.field === 'nomor_pembayaran' && data.validator === 'remote') {
					if (data.result.valid === false) {

						if (data.result.meta.status === false) {
							if (status == true) {
								validation
									// Update the message option
									.updateValidatorOption('nomor_pembayaran', 'remote', 'message', data.result.message);
							}

						} else if (data.result.meta.status === true) {
							if (status == true) {
								validation
									// Update the message option
									.updateValidatorOption('nomor_pembayaran', 'remote', 'message', data.result.message)
									// Set the field as invalid
									.updateFieldStatus('nomor_pembayaran', 'Invalid', 'remote');
							}

						}

					}
				}
			})


			_login.on('submit', function (wizard) {
				if (validation) {
					validation.validate().then(function (status) {
						if (status == 'Valid') {
							KTApp.blockPage({
								overlayColor: '#FFA800',
								state: 'warning',
								size: 'lg',
								opacity: 0.1,
								message: 'Silahkan Tunggu...'
							});
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
				_login = $('#kt_form');
				_handleSignInForm();
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

