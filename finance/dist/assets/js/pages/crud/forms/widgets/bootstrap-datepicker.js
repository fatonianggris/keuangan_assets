/******/ (() => { // webpackBootstrap
	var __webpack_exports__ = {};
	/*!************************************************************************!*\
	 !*** ../demo1/src/js/pages/crud/forms/widgets/bootstrap-datepicker.js ***!
	 \************************************************************************/
	// Class definition

	var KTBootstrapDatepicker = function () {

		var arrows;
		if (KTUtil.isRTL()) {
			arrows = {
				leftArrow: '<i class="la la-angle-right"></i>',
				rightArrow: '<i class="la la-angle-left"></i>'
			}
		} else {
			arrows = {
				leftArrow: '<i class="la la-angle-left"></i>',
				rightArrow: '<i class="la la-angle-right"></i>'
			}
		}

		// Private functions
		var demos = function () {
			// minimum setup
			$('#kt_datepicker_1').datepicker({
				rtl: KTUtil.isRTL(),
				todayHighlight: true,
				orientation: "bottom left",
				templates: arrows,
				format: 'dd/mm/yyyy'
			});

			// range picker
			$('#kt_datepicker_income').datepicker({
				rtl: KTUtil.isRTL(),
				todayHighlight: true,
				orientation: "bottom left",
				templates: arrows,
				format: 'dd/mm/yyyy'
			});

			$('#kt_datepicker_invoice').datepicker({
				rtl: KTUtil.isRTL(),
				todayHighlight: true,
				orientation: "bottom left",
				templates: arrows,
				format: 'dd/mm/yyyy'
			});
			$('#kt_datepicker_transaksi').datepicker({
				rtl: KTUtil.isRTL(),
				todayHighlight: true,
				orientation: "bottom left",
				templates: arrows,
				format: 'dd/mm/yyyy'
			});
			$('#kt_datepicker_ayah').datepicker({
				rtl: KTUtil.isRTL(),
				todayHighlight: true,
				orientation: "bottom left",
				templates: arrows,
				format: 'dd/mm/yyyy'
			});

			$('#kt_datepicker_ibu').datepicker({
				rtl: KTUtil.isRTL(),
				todayHighlight: true,
				orientation: "bottom left",
				templates: arrows,
				format: 'dd/mm/yyyy'
			});

			$('#kt_datepicker_wali').datepicker({
				rtl: KTUtil.isRTL(),
				todayHighlight: true,
				orientation: "bottom left",
				templates: arrows,
				format: 'dd/mm/yyyy'
			});

			// range picker
			$('#kt_datepicker_5').datepicker({
				rtl: KTUtil.isRTL(),
				todayHighlight: true,
				templates: arrows,
				startDate: '-0d',
				format: 'dd/mm/yyyy'
			});

			$("#kt_datepicker_waktu").datepicker({
				format: "mm/yyyy",
				viewMode: "months",
				minViewMode: "months",
				orientation: "bottom",
			});

			$("#kt_datepicker_akhir").datepicker({
				format: "yyyy",
				viewMode: "years",
				minViewMode: "years"
			});

			$('.kt_datepicker_kredit').datepicker({
				rtl: KTUtil.isRTL(),
				todayHighlight: true,
				orientation: "bottom left",
				templates: arrows,
				format: 'dd/mm/yyyy'
			});
			$('.kt_datepicker_debet').datepicker({
				rtl: KTUtil.isRTL(),
				todayHighlight: true,
				orientation: "bottom left",
				templates: arrows,
				format: 'dd/mm/yyyy'
			});
			$('.kt_datepicker_kredit_edit').datepicker({
				rtl: KTUtil.isRTL(),
				orientation: "bottom left",
				templates: arrows,
				format: 'dd/mm/yyyy'
			});
			$('.kt_datepicker_debet_edit').datepicker({
				rtl: KTUtil.isRTL(),
				orientation: "bottom left",
				templates: arrows,
				format: 'dd/mm/yyyy'
			});
		};

		return {
			// public functions
			init: function () {
				demos();
			}
		};
	}();

	jQuery(document).ready(function () {
		KTBootstrapDatepicker.init();
	});
	/******/
})()
	;
//# sourceMappingURL=bootstrap-datepicker.js.map
