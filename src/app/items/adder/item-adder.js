$(function() {
	if ($("article").hasClass("item-adder-page")) {
		$("#device-buy-date").flatpickr({
			enableTime: false,
			dateFormat: "Y-m-d",
			defaultDate: new Date(),
			locale: "zh"
		});

		// item-adder.js
		// get device types options
		ismpems_api_get("device", "types", { "order": "ASC" }, function(json) {
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$.each(json.data, function(key, val) {
						$("#device-type-select").append($("<option/>", {
							value: val.code,
							text: val.code + " - " + val.text
						}));
					});
					$("#device-type-select").change(device_type_change);
					break;
				case ISMPEMS_CODE.NO_CONTENT:
					ismpems_alert("沒有設備種類資料");
					break;
				default:
					ismpems_alert("No such API");
			}
		});

		// get device status options
		ismpems_api_get("device", "status", { "order": "ASC" }, function(json) {
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$.each(json.data, function(key, val) {
						$("#device-status-select").append($("<option/>", {
							value: val.code,
							text: val.text
						}));
						$("#device-status-select").val(1);
					});
					break;
				case ISMPEMS_CODE.NO_CONTENT:
					ismpems_alert("沒有設備種類資料");
					break;
				default:
					ismpems_alert("No such API");
			}
		});

		// format device num
		$("#device-num").on("blur", function() {
			var check = Number.isInteger(parseInt($(this).val()));
			if (check) {
				$(this).val(pad_left($(this).val(), 4));
			} else {
				$(this).val("");
			}
		});

		// get the number of this type of device
		function device_type_change(e) {
			var type = $(e.target).val();
			if (type.length > 0) {
				ismpems_api_get("device", "getnum", { "type": type }, function(json) {
					switch (json.code) {
						case ISMPEMS_CODE.OK:
							$("#device-num-help").html('範例：0001，預設為該種類最後一個編號+1<br><span style="color: #F44336">' + type + ' 種類最後一個編號為 ' + pad_left(json.data.last, 4) + "</span>");
							$("#device-num").val(pad_left(json.data.next, 4));
							break;
						default:
							ismpems_alert("No such API");
					}
				});
			} else {
				$("#device-num-help").html("範例：0001，預設為該種類最後一個編號+1");
				$("#device-num").val("");
			}
		}

		// get device location options
		ismpems_api_get("device", "extlocq", { "order": "ASC" }, function(json) {
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$.each(json.data, function(key, val) {
						$("#device-location-select").append($("<option/>", {
							value: val.loc,
							text: val.loc + " (" + val.freq + ")"
						}));
					});
					$("#device-location-select").on("change", function(e) {
						$("#device-location").val($(e.target).val());
					});
					break;
				case ISMPEMS_CODE.NO_CONTENT:
					ismpems_alert("沒有設備種類資料");
					break;
				default:
					ismpems_alert("No such API");
			}
		});

		// btn for add new data
		$("#device-adder-form").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();

			var device = {
				type: $("#device-type-select").val(),
				num: $("#device-num").val(),
				name: $("#device-name").val(),
				location: $("#device-location").val(),
				status: $("#device-status-select").val(),
				ncku_property_num: $("#device-ncku-property-num").val(),
				ncku_num: $("#device-ncku-num").val(),
				ncku_serial_num: $("#device-ncku-serial-num").val(),
				ncku_price_name: $("#device-ncku-price-name").val(),
				brand: $("#device-brand").val(),
				serial_num: $("#device-serial-num").val(),
				duration: $("#device-duration").val(),
				buy_from: $("#device-buy-from").val(),
				buy_date: $("#device-buy-date").val(),
				price: $("#device-price").val(),
				spec: $("#device-spec").val(),
				memo: $("#device-memo").val(),
			};

			ismpems_api_get("device", "add", device, function(json) {
				ismpems_debug_report("item-adder:add", json);
				switch (json.code) {
					case ISMPEMS_CODE.OK:
						ismpems_alert(json.detail, function() { location.reload(); });
						break;
					case ISMPEMS_CODE.BAD_REQUEST:
						ismpems_alert(json.detail);
						break;
					case ISMPEMS_CODE.SERVER_ERROR:
						ismpems_alert(json.detail);
						break;
					default:
						ismpems_alert("No such API");
				}
			});
			return false;
		});
	}
})
