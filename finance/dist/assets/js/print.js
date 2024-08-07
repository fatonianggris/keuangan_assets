
(function (global) {
	print_connection();

	var printer

	function buatBaris3Kolom(kolom1, kolom2, kolom3) {
		const lebarKolom1 = 9;
		const lebarKolom2 = 11;
		const lebarKolom3 = 10;

		const wrapText = (text, width) => {
			let result = [];
			let start = 0;
			while (start < text.length) {
				result.push(text.substring(start, start + width));
				start += width;
			}
			return result.join('\n');
		};

		kolom1 = wrapText(kolom1, lebarKolom1);
		kolom2 = wrapText(kolom2, lebarKolom2);
		kolom3 = wrapText(kolom3, lebarKolom3);

		const kolom1Array = kolom1.split('\n');
		const kolom2Array = kolom2.split('\n');
		const kolom3Array = kolom3.split('\n');

		const jmlBarisTerbanyak = Math.max(kolom1Array.length, kolom2Array.length, kolom3Array.length);

		const hasilBaris = [];

		for (let i = 0; i < jmlBarisTerbanyak; i++) {
			const hasilKolom1 = str_pad((kolom1Array[i] || ''), lebarKolom1, ' ');
			const hasilKolom2 = str_pad((kolom2Array[i] || ''), lebarKolom2, ' ');
			const hasilKolom3 = str_pad((kolom3Array[i] || ''), lebarKolom3, ' ', true);

			hasilBaris.push(`${hasilKolom1} ${hasilKolom2} ${hasilKolom3}`);
		}

		return hasilBaris.join('\n');
	}

	function str_pad(input, length, padString, padLeft) {
		let output = String(input);
		while (output.length < length) {
			output = padLeft ? padString + output : output + padString;
		}
		return output;
	}

	function print_transaction(name_header = "", image = "", address1 = "", address2 = "", telephone = "", number_account = "", no_transaction = "", type_saving = "", type_transaction = "", time = "", nominal_transaction = "", main_balance = "", sum_saldo = "", footer1 = "", footer2 = "", name_account = "", class_account = "", link = "") {
		// Initial printer with key and port from form input
		printer = new Recta(PRINT_KEY, PRINT_PORT)

		var ops = "";
		if (type_transaction == "KREDIT") {
			ops = "+";
		} else {
			ops = "-";
		}
		// Opening printer
		printer.open().then(() => {
			printer.open()
				.then(() => printer.align('CENTER'))
				.then(() => printer.image(image, 150))
				.then(() => printer.bold(true))
				.then(() => printer.text(name_header))
				.then(() => printer.bold(false))
				.then(() => printer.text(address1))
				.then(() => printer.text(address2))
				.then(() => printer.text(telephone))
				.then(() => printer.text('***'))
				.then(() => printer.bold(true))
				.then(() => printer.text('No Rekening:' + number_account))
				.then(() => printer.text('No Trans:' + no_transaction))
				.then(() => printer.text(name_account + "(" + class_account + ")"))
				.then(() => printer.bold(false))
				.then(() => printer.text('------------------------------'))
				.then(() => printer.text(buatBaris3Kolom("Tabungan", "Waktu", "Nominal")))
				.then(() => printer.text('------------------------------'))
				.then(() => printer.text(buatBaris3Kolom(type_saving, time, ops + nominal_transaction)))
				.then(() => printer.text('------------------------------'))
				.then(() => printer.text(buatBaris3Kolom("", "SALDO AWAL", main_balance)))
				.then(() => printer.text(buatBaris3Kolom("", type_transaction, ops + nominal_transaction)))
				.then(() => printer.text(buatBaris3Kolom("", "SALDO AKHIR", sum_saldo)))
				.then(() => printer.feed(1))
				.then(() => printer.bold(true))
				.then(() => printer.text(footer1))
				.then(() => printer.text(footer2))
				.then(() => printer.bold(false))
				.then(() => printer.text(link))
				.then(() => printer.text('***'))
				.then(() => printer.feed(2))
				.then(() => printer.print())
				.then(() => printer.flush())
				.then(() => printer.close())

		}).catch((e) => {
			Swal.fire({
				html: "Gagal Mencetak!, Cek koneksi printer Anda! (" + e + ")",
				icon: "error",
				buttonsStyling: false,
				confirmButtonText: "Oke!",
				customClass: {
					confirmButton: "btn font-weight-bold btn-danger"
				}
			}).then(function () {
				KTUtil.scrollTop();
			});
		})

	}

	function print_transaction_bulk(name_header = "", image = "", address1 = "", address2 = "", telephone = "", trans_msg_json, footer1 = "", footer2 = "", link = "") {
		// Assuming trans_msg_json is passed to your JavaScript code as a JSON string
		const trans_msg = trans_msg_json;
		// Accessing the transactions array
		const transactions = trans_msg.array_transaction;

		var nama_tingkat = "";
		if (trans_msg.tingkat == 1) {
			nama_tingkat = "KB";
		} else if (trans_msg.tingkat == 2) {
			nama_tingkat = "TK";
		} else if (trans_msg.tingkat == 3) {
			nama_tingkat = "SD";
		} else if (trans_msg.tingkat == 4) {
			nama_tingkat = "SMP";
		} else if (trans_msg.tingkat == 6) {
			nama_tingkat = "DC";
		}
		// Initial printer with key and port from form input
		printer = new Recta(PRINT_KEY, PRINT_PORT)
		// Opening printer
		printer.open().then(() => {
			printer.open()
				.then(() => printer.align('CENTER'))
				.then(() => printer.image(image, 150))
				.then(() => printer.bold(true))
				.then(() => printer.text(name_header))
				.then(() => printer.bold(false))
				.then(() => printer.text(address1))
				.then(() => printer.text(address2))
				.then(() => printer.text(telephone))
				.then(() => printer.text('***'))
				.then(() => printer.bold(true))
				.then(() => printer.text('No Rekening:' + trans_msg.nomor_rekening))
				.then(() => printer.text('Waktu:' + trans_msg.waktu_transaksi))
				.then(() => printer.text(trans_msg.nama_nasabah.toUpperCase() + "(" + nama_tingkat + ")"))
				.then(() => printer.bold(false))
				.then(() => printer.text('------------------------------'))
				.then(() => printer.text(buatBaris3Kolom("Tabungan", "No Trans.", "Nominal")))
				.then(() => printer.text('------------------------------'))
				.then(() => {
					// Loop through transactions and print each one
					const transactionPromises = transactions.map(transaction => {
						var saldo_akhir = (parseInt(transaction.saldo.replace(/\./g, "")));
						if (saldo_akhir >= 2000) {
							return printer.text(buatBaris3Kolom(transaction.jenis_tabungan, transaction.nomor_transaksi, "+" + transaction.saldo));
						}
					});
					return Promise.all(transactionPromises);
				})
				.then(() => printer.text('------------------------------'))
				.then(() => {
					// Loop through transactions and print each one
					const transactionPromises = transactions.map(transaction => {
						var saldo_akhir = (parseInt(transaction.saldo.replace(/\./g, "")));
						if (saldo_akhir >= 2000) {
							return printer.text(buatBaris3Kolom("", "SAL. " + transaction.jenis_tabungan, transaction.saldo));
						}
					});
					return Promise.all(transactionPromises);
				})
				.then(() => printer.feed(1))
				.then(() => printer.bold(true))
				.then(() => printer.text(footer1))
				.then(() => printer.text(footer2))
				.then(() => printer.bold(false))
				.then(() => printer.text(link))
				.then(() => printer.text('***'))
				.then(() => printer.feed(2))
				.then(() => printer.print())
				.then(() => printer.flush())
				.then(() => printer.close())

		}).catch((e) => {
			Swal.fire({
				html: "Gagal Mencetak!, Cek koneksi printer Anda! (" + e + ")",
				icon: "error",
				buttonsStyling: false,
				confirmButtonText: "Oke!",
				customClass: {
					confirmButton: "btn font-weight-bold btn-danger"
				}
			}).then(function () {
				KTUtil.scrollTop();
			});
		})

	}
	function print_connection() {
		// Initialize status values from sessionStorage or set default values
		if (sessionStorage.getItem('status_success') === null) {
			sessionStorage.setItem('status_success', 'true');
		}
		if (sessionStorage.getItem('status_error') === null) {
			sessionStorage.setItem('status_error', 'true');
		}

		var status_success = (sessionStorage.getItem('status_success') === 'true');
		var status_error = (sessionStorage.getItem('status_error') === 'true');

		printer = new Recta(PRINT_KEY, PRINT_PORT);

		setInterval(function () {
			printer.open().then(() => {
				if (status_success) {
					Swal.fire({
						html: "<b>Printer Berhasil Terkoneksi!</b>",
						icon: "success",
						buttonsStyling: false,
						confirmButtonText: "Oke!",
						customClass: {
							confirmButton: "btn font-weight-bold btn-success"
						}
					}).then(function () {
						// You can add further actions here if needed
					});
					sessionStorage.setItem('status_error', 'true');
					sessionStorage.setItem('status_success', 'false');
					status_error = true;
					status_success = false;
				}
				$('#error_print_connection').html("<b class='blink_print text-success'>Connected</b>");
			}).catch((e) => {
				if (status_error) {
					Swal.fire({
						html: "<b>Printer Gagal Terkoneksi!</b>, Cek Kondisi Printer Anda.<br>(" + e + ")",
						icon: "error",
						buttonsStyling: false,
						confirmButtonText: "Oke!",
						customClass: {
							confirmButton: "btn font-weight-bold btn-danger"
						}
					}).then(function () {
						// You can add further actions here if needed
					});
					sessionStorage.setItem('status_success', 'true');
					sessionStorage.setItem('status_error', 'false');
					status_success = true;
					status_error = false;
				}
				$('#error_print_connection').html("<b class='blink_print text-danger'>Disconnected</b>");
			});
		}, 3000);
	}

	global.bundle = {
		getPrint: print_transaction,
		getPrintBulk: print_transaction_bulk
	}

})(window)
