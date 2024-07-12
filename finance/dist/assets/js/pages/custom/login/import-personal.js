/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
	var __webpack_exports__ = {};

	// Class Definition
	var KTLogin = function () {
		var _import_personal;

		var _handlePersonalForm = function () {
			var validation;
			var form = KTUtil.getById('kt_upload_nasabah_personal')
			// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
			validation = FormValidation.formValidation(
				form,
				{
					fields: {
						input_tanggal_transaksi: {
							validators: {
								notEmpty: {
									message: 'Tanggal diperlukan'
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
						file_personal_saving: {
							validators: {
								notEmpty: {
									message: 'File Upload diperlukan'
								},
							}
						},
					},
					plugins: {
						trigger: new FormValidation.plugins.Trigger(),
						// Bootstrap Framework Integration
						bootstrap: new FormValidation.plugins.Bootstrap(),
						// Validate fields when clicking the Submit button
						submitButton: new FormValidation.plugins.SubmitButton()
					}
				}
			);
			_import_personal.on('submit', function (wizard) {

				if (validation) {
					validation.validate().then(function (status) {
						if (status == 'Valid') {
							if (window.bundleObj.getOTP() === false) {
								Swal.fire({
									html: "<b>PIN</b> Anda Salah!.",
									icon: "error",
									buttonsStyling: false,
									confirmButtonText: "Oke!",
									customClass: {
										confirmButton: "btn font-weight-bold btn-primary"
									}
								}).then(function () {
									KTUtil.scrollTop();
								});
							} else {
								grecaptcha.ready(function () {
									if (grecaptcha.getResponse() === "") {

										Swal.fire({
											html: "Google reCAPTCHA wajib dicentang.",
											icon: "error",
											buttonsStyling: false,
											confirmButtonText: "Oke!",
											customClass: {
												confirmButton: "btn font-weight-bold btn-primary"
											}
										}).then(function () {
											KTUtil.scrollTop();
										});
									} else {
										KTApp.blockPage({
											overlayColor: '#FFA800',
											state: 'warning',
											size: 'lg',
											opacity: 0.1,
											message: 'Silahkan Tunggu...'
										});
										form.submit(); // Submit form
									}
								});
							}
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
				_import_personal = $('#kt_upload_nasabah_personal');
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
