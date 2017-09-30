$(function() {
	if ($("article").hasClass("item-editor-page")) {
		// check the page is redirect
		if ($("#device-editor-redirect").val() === "1") {
			setTimeout(function() { $("#device-query").submit(); }, 50);
		}
		// item-editor.js
		$("#submit-button").prop("disabled", true);
		// get device types options
		ismpems_api_get("device", "types", { "order": "ASC" }, function(json) {
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$.each(json.data, function(key, val) {
						$("#edit-device-type-select").append($("<option/>", {
							value: val.code,
							text: val.code + " - " + val.text
						}));
					});
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
					});
					break;
				case ISMPEMS_CODE.NO_CONTENT:
					ismpems_alert("沒有設備種類資料");
					break;
				default:
					ismpems_alert("No such API");
			}
		});

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

		$("#edit-device-type-select").on('change', function() {
			$("#edit-device-type").val($(this).val());
			$("#edit-device-type").change();
		});

		// format device-type
		$("#edit-device-type").on("change keyup", function(e) {
			$(this).val($(this).val().toUpperCase());
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

		// btn for query data
		$("#device-query").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();

			var device_query = {
				type: $("#edit-device-type").val(),
				num: $("#device-num").val(),
			};

			ismpems_api_get("device", "query", device_query, function(json) {
				ismpems_debug_report("item-editor:edit", json);
				switch (json.code) {
					case ISMPEMS_CODE.OK:
						$("#device-name").val(json.data.name);
						$("#device-location").val(json.data.location);
						$("#device-location-select").val(json.data.location);
						$("#device-status-select").val(json.data.status);
						$("#device-ncku-property-num").val(json.data.ncku_property_num);
						$("#device-ncku-num").val(json.data.ncku_num);
						$("#device-ncku-serial-num").val(json.data.ncku_serial_num);
						$("#device-ncku-price-name").val(json.data.ncku_price_name);
						$("#device-brand").val(json.data.brand);
						$("#device-serial-num").val(json.data.serial_num);
						$("#device-duration").val(json.data.duration);
						$("#device-buy-from").val(json.data.buy_from);
						var buy_date = (json.data.buy_date == null) ? new Date() : json.data.buy_date;
						$("#device-buy-date").flatpickr({
							enableTime: false,
							dateFormat: "Y-m-d",
							defaultDate: buy_date,
							locale: "zh"
						});
						// $("#device-buy-date").val(json.data.buy_date);
						$("#device-price").val(json.data.price);
						$("#device-spec").val(json.data.spec);
						$("#device-memo").val(json.data.memo);
						$("#editor-last-modified-datetime").html('<em>最後修改時間：' + json.data.last_modified_datetime + '</em>');
						$("#submit-button").prop("disabled", false);
						break;
					case ISMPEMS_CODE.BAD_REQUEST:
						clear_form();
						$("#submit-button").prop("disabled", true);
						ismpems_alert(json.detail);
						break;
					case ISMPEMS_CODE.NO_CONTENT:
						clear_form();
						$("#submit-button").prop("disabled", true);
						ismpems_alert(json.detail);
						break;
					default:
						clear_form();
						$("#submit-button").prop("disabled", true);
						ismpems_alert("No such API");
				}
			});
			return false;
		});

		// btn for update data
		$("#device-editor").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();

			var device = {
				type: $("#edit-device-type").val(),
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

			ismpems_api_get("device", "update", device, function(json) {
				ismpems_debug_report("item-editor:edit", json);
				switch (json.code) {
					case ISMPEMS_CODE.OK:
						ismpems_alert(json.detail, function() { window.location.href = window.location.href; });
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

		function clear_form() {
			$("#device-name").val("");
			$("#device-location").val("");
			$("#device-status-select").val("");
			$("#device-ncku-property-num").val("");
			$("#device-ncku-num").val("");
			$("#device-ncku-serial-num").val("");
			$("#device-ncku-price-name").val("");
			$("#device-brand").val("");
			$("#device-serial-num").val("");
			$("#device-duration").val("");
			$("#device-buy-from").val("");
			$("#device-buy-date").flatpickr({
				enableTime: false,
				dateFormat: "Y-m-d",
				defaultDate: new Date(),
				locale: "zh"
			});
			$("#device-price").val("");
			$("#device-spec").val("");
			$("#device-memo").val("");
			$("#editor-last-modified-datetime").html('<em>最後修改時間：</em>');

		}
		// page function end
	}
})
