(function (global) {
	
	var status = false;
	
	OTPInputKredit();
	OTPInputKreditEdit();

	function OTPInputKredit() {

		let otpValue = [];
		const ysp = new YouShallPass("●", 50);
		const inputs = document.querySelectorAll("#otp_kredit > *[id]");

		for (let i = 0; i < inputs.length; i++) {
			inputs[i].addEventListener("keydown", function (event) {
				if (event.key === "Backspace") {
					inputs[0].value = "";
					inputs[1].value = "";
					inputs[2].value = "";
					inputs[3].value = "";
					inputs[4].value = "";
					otpValue = [];
					if (i !== 0) inputs[0].focus();
				} else {
					if (i === inputs.length - 1 && inputs[i].value !== "") {
						return true;
					} else if (event.keyCode > 47 && event.keyCode < 58) {
						inputs[i].value = event.key;
						if (i !== inputs.length - 1) inputs[i + 1].focus();
						event.preventDefault();
					} else if (event.keyCode > 64 && event.keyCode < 91) {
						inputs[i].value = String.fromCharCode(event.keyCode);
						if (i !== inputs.length - 1) inputs[i + 1].focus();
						event.preventDefault();
					}
					otpValue.push(inputs[i].value);
				}

				if (i == 4 && otpValue.length > 4) {
					$('[name="pin_verification_kredit"]').val('');
					$.ajax({
						type: "POST",
						url: `${HOST_URL}/finance/savings/check_pin_number`,
						data: {
							pin_number: otpValue.join('')
						},
						async: false,
						dataType: 'JSON',
						success: function (data) {

							if (data.status == false) {
								status = false;
								Swal.fire({
									html: data.messages,
									icon: "error",
									buttonsStyling: false,
									confirmButtonText: "Oke!",
									customClass: {
										confirmButton: "btn font-weight-bold btn-danger"
									}
								}).then(function () {
									KTUtil.scrollTop();
								});
							} else {
								status = true;
								Swal.fire({
									html: data.messages,
									icon: "success",
									buttonsStyling: false,
									confirmButtonText: "Oke!",
									customClass: {
										confirmButton: "btn font-weight-bold btn-success"
									}
								}).then(function () {
									KTUtil.scrollTop();
								});
								$('[name="pin_verification_kredit"]').val(otpValue.join(''));
							}
						}
					});
				}
			});
			inputs[i].addEventListener('keydown', ysp.keyboardInputHandle.bind(ysp));
		}
		return status;
	}

	function OTPclearKredit() {
		status = false;
		document.querySelectorAll("#otp_kredit > *[id]").forEach(x => x.value = '');
	}

	function OTPInputKreditEdit() {

		let otpValue = [];
		const ysp = new YouShallPass("●", 50);
		const inputs = document.querySelectorAll("#otp_kredit_edit > *[id]");

		for (let i = 0; i < inputs.length; i++) {
			inputs[i].addEventListener("keydown", function (event) {
				if (event.key === "Backspace") {
					inputs[0].value = "";
					inputs[1].value = "";
					inputs[2].value = "";
					inputs[3].value = "";
					inputs[4].value = "";
					otpValue = [];
					if (i !== 0) inputs[0].focus();
				} else {
					if (i === inputs.length - 1 && inputs[i].value !== "") {
						return true;
					} else if (event.keyCode > 47 && event.keyCode < 58) {
						inputs[i].value = event.key;
						if (i !== inputs.length - 1) inputs[i + 1].focus();
						event.preventDefault();
					} else if (event.keyCode > 64 && event.keyCode < 91) {
						inputs[i].value = String.fromCharCode(event.keyCode);
						if (i !== inputs.length - 1) inputs[i + 1].focus();
						event.preventDefault();
					}
					otpValue.push(inputs[i].value);
				}

				if (i == 4 && otpValue.length > 4) {
					$('[name="pin_verification_kredit_edit"]').val('');
					$.ajax({
						type: "POST",
						url: `${HOST_URL}/finance/savings/check_pin_number`,
						data: {
							pin_number: otpValue.join('')
						},
						async: false,
						dataType: 'JSON',
						success: function (data) {

							if (data.status == false) {
								status = false;
								Swal.fire({
									html: data.messages,
									icon: "error",
									buttonsStyling: false,
									confirmButtonText: "Oke!",
									customClass: {
										confirmButton: "btn font-weight-bold btn-danger"
									}
								}).then(function () {
									KTUtil.scrollTop();
								});
							} else {
								status = true;
								Swal.fire({
									html: data.messages,
									icon: "success",
									buttonsStyling: false,
									confirmButtonText: "Oke!",
									customClass: {
										confirmButton: "btn font-weight-bold btn-success"
									}
								}).then(function () {
									KTUtil.scrollTop();
								});
								$('[name="pin_verification_kredit_edit"]').val(otpValue.join(''));
							}
						}
					});
				}
			});
			inputs[i].addEventListener('keydown', ysp.keyboardInputHandle.bind(ysp));
		}
		return status;
	}

	function OTPclearKreditEdit() {
		status = false;
		document.querySelectorAll("#otp_kredit_edit > *[id]").forEach(x => x.value = '');
	}

	OTPInputDebet();
	OTPInputDebetEdit();
	
	function OTPInputDebet() {

		let otpValue = [];
		const ysp = new YouShallPass("●", 50);
		const inputs = document.querySelectorAll("#otp_debet > *[id]");

		for (let i = 0; i < inputs.length; i++) {
			inputs[i].addEventListener("keydown", function (event) {
				if (event.key === "Backspace") {
					inputs[0].value = "";
					inputs[1].value = "";
					inputs[2].value = "";
					inputs[3].value = "";
					inputs[4].value = "";
					otpValue = [];
					if (i !== 0) inputs[0].focus();
				} else {
					if (i === inputs.length - 1 && inputs[i].value !== "") {
						return true;
					} else if (event.keyCode > 47 && event.keyCode < 58) {
						inputs[i].value = event.key;
						if (i !== inputs.length - 1) inputs[i + 1].focus();
						event.preventDefault();
					} else if (event.keyCode > 64 && event.keyCode < 91) {
						inputs[i].value = String.fromCharCode(event.keyCode);
						if (i !== inputs.length - 1) inputs[i + 1].focus();
						event.preventDefault();
					}
					otpValue.push(inputs[i].value);
				}

				if (i == 4 && otpValue.length > 4) {
					$('[name="pin_verification_debet"]').val('');
					$.ajax({
						type: "POST",
						url: `${HOST_URL}/finance/savings/check_pin_number`,
						data: {
							pin_number: otpValue.join('')
						},
						async: false,
						dataType: 'JSON',
						success: function (data) {

							if (data.status == false) {
								status = false;
								Swal.fire({
									html: data.messages,
									icon: "error",
									buttonsStyling: false,
									confirmButtonText: "Oke!",
									customClass: {
										confirmButton: "btn font-weight-bold btn-danger"
									}
								}).then(function () {
									KTUtil.scrollTop();
								});
							} else {
								status = true;
								Swal.fire({
									html: data.messages,
									icon: "success",
									buttonsStyling: false,
									confirmButtonText: "Oke!",
									customClass: {
										confirmButton: "btn font-weight-bold btn-success"
									}
								}).then(function () {
									KTUtil.scrollTop();
								});
								$('[name="pin_verification_debet"]').val(otpValue.join(''));
							}
						}
					});
				}
			});
			inputs[i].addEventListener('keydown', ysp.keyboardInputHandle.bind(ysp));
		}
		return status;
	}

	function OTPclearDebet() {
		status = false;
		document.querySelectorAll("#otp_debet > *[id]").forEach(x => x.value = '');
	}

	function OTPInputDebetEdit() {

		let otpValue = [];
		const ysp = new YouShallPass("●", 50);
		const inputs = document.querySelectorAll("#otp_debet_edit > *[id]");

		for (let i = 0; i < inputs.length; i++) {
			inputs[i].addEventListener("keydown", function (event) {
				if (event.key === "Backspace") {
					inputs[0].value = "";
					inputs[1].value = "";
					inputs[2].value = "";
					inputs[3].value = "";
					inputs[4].value = "";
					otpValue = [];
					if (i !== 0) inputs[0].focus();
				} else {
					if (i === inputs.length - 1 && inputs[i].value !== "") {
						return true;
					} else if (event.keyCode > 47 && event.keyCode < 58) {
						inputs[i].value = event.key;
						if (i !== inputs.length - 1) inputs[i + 1].focus();
						event.preventDefault();
					} else if (event.keyCode > 64 && event.keyCode < 91) {
						inputs[i].value = String.fromCharCode(event.keyCode);
						if (i !== inputs.length - 1) inputs[i + 1].focus();
						event.preventDefault();
					}
					otpValue.push(inputs[i].value);
				}

				if (i == 4 && otpValue.length > 4) {
					$('[name="pin_verification_debet_edit"]').val('');
					$.ajax({
						type: "POST",
						url: `${HOST_URL}/finance/savings/check_pin_number`,
						data: {
							pin_number: otpValue.join('')
						},
						async: false,
						dataType: 'JSON',
						success: function (data) {

							if (data.status == false) {
								status = false;
								Swal.fire({
									html: data.messages,
									icon: "error",
									buttonsStyling: false,
									confirmButtonText: "Oke!",
									customClass: {
										confirmButton: "btn font-weight-bold btn-danger"
									}
								}).then(function () {
									KTUtil.scrollTop();
								});
							} else {
								status = true;
								Swal.fire({
									html: data.messages,
									icon: "success",
									buttonsStyling: false,
									confirmButtonText: "Oke!",
									customClass: {
										confirmButton: "btn font-weight-bold btn-success"
									}
								}).then(function () {
									KTUtil.scrollTop();
								});
								$('[name="pin_verification_debet_edit"]').val(otpValue.join(''));
							}
						}
					});
				}
			});
			inputs[i].addEventListener('keydown', ysp.keyboardInputHandle.bind(ysp));
		}
		return status;
	}

	function OTPclearDebetEdit() {
		status = false;
		document.querySelectorAll("#otp_debet_edit > *[id]").forEach(x => x.value = '');
	}

	global.bundleObj = {

		getOTPKredit: OTPInputKredit,
		resetOTPKredit: OTPclearKredit,
		getOTPKreditEdit: OTPInputKreditEdit,
		resetOTPKreditEdit: OTPclearKreditEdit,

		getOTPDebet: OTPInputDebet,
		resetOTPDebet: OTPclearDebet,
		getOTPDebetEdit: OTPInputDebetEdit,
		resetOTPDebetEdit: OTPclearDebetEdit,

	}

})(window)
