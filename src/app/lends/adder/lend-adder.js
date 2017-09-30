$(function() {
	if ($("article").hasClass("lend-adder-page")) {
		// check the page is redirect
		if ($("#lend-adder-redirect").val() === "1") {
			setTimeout(function() { $("#lend-add-form-query").submit(); }, 50);
		}

		$("#lend-lend-datetime").flatpickr({
			enableTime: true,
			dateFormat: "Y-m-d H:i",
			defaultDate: new Date(),
			locale: "zh"
		});
		$("#submit-button").prop("disabled", true);
		// lend-adder.js
		// get device types options
		ismpems_api_get("device", "types", { "order": "ASC" }, function(json) {
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$.each(json.data, function(key, val) {
						$("#lend-adder-device-type-select").append($("<option/>", {
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

		$("#lend-adder-device-type-select").on('change', function() {
			$("#lend-adder-device-type").val($(this).val());
			$("#lend-adder-device-type").change();
		});

		// format device-type
		$("#lend-adder-device-type").on("change keyup", function(e) {
			$(this).val($(this).val().toUpperCase());
		});

		// get members
		ismpems_api_get("member", "all", { "order": "ASC", activation: 1 }, function(json) {
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$.each(json.data, function(key, val) {
						$("#lend-member-select").append($("<option/>", {
							value: val.id,
							text: (key + 1) + ". " + val.name
						}));
					});
					break;
				case ISMPEMS_CODE.NO_CONTENT:
					ismpems_alert("沒有借用人資料");
					break;
				default:
					ismpems_alert("No such API");
			}
		});

		// format device num
		$("#lend-device-num").on("blur", function() {
			var check = Number.isInteger(parseInt($(this).val()));
			if (check) {
				$(this).val(pad_left($(this).val(), 4));
			} else {
				$(this).val("");
			}
		});

		$("#lend-add-form-query").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();
			var type = $("#lend-adder-device-type").val(),
				num = $("#lend-device-num").val();
			if (type.length === 3 && num.length > 0) {
				ismpems_api_get("device", "query", { type: type, num: num }, function(json) {
					ismpems_debug_report("lend-adder:query", json);
					switch (json.code) {
						case ISMPEMS_CODE.OK:
							$("#lend-device-location").val(json.data.location);
							$("#lend-device-status").val(json.data.status_text);
							$("#lend-member-select").val("");
							var device_info = json.data.name + " " +
								(json.data.brand == null ? "" : json.data.brand) + " " +
								(json.data.ncku_property_num == null ? "" : json.data.ncku_property_num) + " " +
								(json.data.ncku_num == null ? "" : json.data.ncku_num) + " " +
								(json.data.ncku_serial_num == null ? "" : json.data.ncku_serial_num) + " " +
								(json.data.ncku_price_name == null ? "" : json.data.ncku_price_name);
							$("#lend-device-information").val(device_info.trim());
							$("#editor-last-modified-datetime").html('<em>設備資料最後修改時間：' + json.data.last_modified_datetime + '</em>');
							if (json.data.status == 2) {

								$("#")
								ismpems_alert(type + "-" + pad_left(num, 4) + " 設備已被其他人借走");
								$("#submit-button").prop("disabled", true);
							} else if (json.data.status == 1) {
								$("#submit-button").prop("disabled", false);
							} else {
								ismpems_alert(type + "-" + pad_left(num, 4) + " 設備不可借出");
								$("#submit-button").prop("disabled", true);
							}
							break;
						case ISMPEMS_CODE.BAD_REQUEST:
							ismpems_alert(json.detail);
							break;
						case ISMPEMS_CODE.NO_CONTENT:
							ismpems_alert(json.detail);
							break;
						default:
							ismpems_alert("No such API");
					}
				});
			}
			return false;
		});

		$("#lend-add-form").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();

			var lend = {
				type: $("#lend-adder-device-type").val(),
				num: $("#lend-device-num").val(),
				member: $("#lend-member-select").val(),
				location: $("#lend-device-location").val(),
				datetime: $("#lend-lend-datetime").val(),
				handler: $("#system-user-account").val(),
				memo: $("#lend-memo").val(),
			};

			ismpems_api_get("member", "lend", lend, function(json) {
				ismpems_debug_report("lend-adder:add", json);
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
	}
})
