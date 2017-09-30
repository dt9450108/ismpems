$(function() {
	if ($("article").hasClass("repair-adder-page")) {
		$("#repair-datetime").flatpickr({
			enableTime: true,
			dateFormat: "Y-m-d H:i",
			defaultDate: new Date(),
			locale: "zh"
		});
		// lend-adder.js
		// get device types options
		ismpems_api_get("device", "types", { "order": "ASC" }, function(json) {
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$.each(json.data, function(key, val) {
						$("#repair-adder-device-type-select").append($("<option/>", {
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

		$("#repair-adder-device-type-select").on('change', function() {
			$("#repair-adder-device-type").val($(this).val());
			$("#repair-adder-device-type").change();
		});

		// format device-type
		$("#repair-adder-device-type").on("change keyup", function(e) {
			$(this).val($(this).val().toUpperCase());
		});

		// format device num
		$("#repair-device-num").on("blur", function() {
			var check = Number.isInteger(parseInt($(this).val()));
			if (check) {
				$(this).val(pad_left($(this).val(), 4));
			} else {
				$(this).val("");
			}
		});
		$("#submit-button").prop("disabled", true);

		$("#repair-adder-form-query").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();
			var type = $("#repair-adder-device-type").val(),
				num = $("#repair-device-num").val();
			if (type.length === 3 && num.length > 0) {
				ismpems_api_get("device", "query", { type: type, num: num }, function(json) {
					ismpems_debug_report("repair-adder:query", json);
					switch (json.code) {
						case ISMPEMS_CODE.OK:
							$("#repair-device-location").val(json.data.location);
							$("#repair-device-status").val(json.data.status_text);
							$("#editor-last-modified-datetime").html('<em>設備資料最後修改時間：' + json.data.last_modified_datetime + '</em>');
							if (json.data.status == 2) {
								ismpems_alert(type + "-" + pad_left(num, 4) + " 設備已被其他人借走");
								$("#submit-button").prop("disabled", true);
							} else if (json.data.status == 1) {
								$("#submit-button").prop("disabled", false);
							}
							break;
						case ISMPEMS_CODE.BAD_REQUEST:
							ismpems_alert(json.detail);
							$("#submit-button").prop("disabled", true);
							break;
						case ISMPEMS_CODE.NO_CONTENT:
							ismpems_alert(json.detail);
							$("#submit-button").prop("disabled", true);
							break;
						default:
							ismpems_alert("No such API");
							$("#submit-button").prop("disabled", true);
					}
				});
			}
			return false;
		});

		$("#repair-adder-form").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();

			var repair = {
				type: $("#repair-adder-device-type").val(),
				num: $("#repair-device-num").val(),
				datetime: $("#repair-datetime").val(),
				handler: $("#system-user-account").val(),
				memo: $("#repair-memo").val(),
			};

			ismpems_api_get("device", "repair", repair, function(json) {
				ismpems_debug_report("repair-adder:repair", json);
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
