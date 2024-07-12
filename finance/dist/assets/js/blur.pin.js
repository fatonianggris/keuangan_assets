(function (global) {
	OTPInput()
	var status = false;
	function OTPInput() {
		var csrfName = $('.txt_csrfname').attr('name');
		var csrfHash = $('.txt_csrfname').val(); // CSRF hash

		let otpValue = [];
		const ysp = new YouShallPass("●", 50);
		const inputs = document.querySelectorAll("#otp > *[id]");

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
					$('[name="pin_verification"]').val('');
					$.ajax({
						type: "POST",
						url: `${HOST_URL}/finance/savings/check_pin_number`,
						data: {
							pin_number: otpValue.join(''),
							[csrfName]: csrfHash
						},
						async: false,
						dataType: 'JSON',
						success: function (data) {

							$('.txt_csrfname').val(data.token);

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
								$('[name="pin_verification"]').val(otpValue.join(''));
							}
						}
					});
				}
			});
			inputs[i].addEventListener('keydown', ysp.keyboardInputHandle.bind(ysp));
		}
		return status;
	}

	global.bundleObj = {
		getOTP: OTPInput
	}

})(window)
