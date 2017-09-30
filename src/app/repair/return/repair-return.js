$(function() {
	if ($("article").hasClass("repair-return-page")) {
		$("#repair-return-datetime").flatpickr({
			enableTime: true,
			dateFormat: "Y-m-d H:i",
			defaultDate: new Date(),
			locale: "zh"
		});
		// repair-return.js
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

		// get device location options
		ismpems_api_get("device", "extlocq", { "order": "ASC" }, function(json) {
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$.each(json.data, function(key, val) {
						$("#new-device-location-select").append($("<option/>", {
							value: val.loc,
							text: val.loc + " (" + val.freq + ")"
						}));
					});
					$("#new-device-location-select").on("change", function(e) {
						$("#new-device-location").val($(e.target).val());
					});
					break;
				case ISMPEMS_CODE.NO_CONTENT:
					ismpems_alert("沒有設備種類資料");
					break;
				default:
					ismpems_alert("No such API");
			}
		});

		$("#repair-return-device-type-select").on('change', function() {
			$("#repair-return-device-type").val($(this).val());
			$("#repair-return-device-type").change();
		});

		// format device-type
		$("#repair-return-device-type").on("change keyup", function(e) {
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

		$("#repair-return-form-query").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();
			var type = $("#repair-return-device-type").val(),
				num = $("#repair-device-num").val();
			if (type.length === 3 && num.length > 0) {
				ismpems_api_get("device", "repairq", { type: type, num: num }, function(json) {
					ismpems_debug_report("repair-return:query", json);
					switch (json.code) {
						case ISMPEMS_CODE.OK:
							$("#repair-record-id").val(json.data.id);
							$("#repair-datetime").val(json.data.repair_datetime);
							$("#old-device-location").val(json.data.device.location);
							$("#repair-handler").val(json.data.repair_handler.name);
							$("#new-device-location").val(json.data.device.location);
							$("#repair-return-memo").val(json.data.memo);
							$("#editor-last-modified-datetime").html('<em>設備資料最後修改時間：' + json.data.device.last_modified_datetime + '</em>');
							$("#submit-button").prop("disabled", false);
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

		$("#repair-return-form").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();

			var repairReturn = {
				id: $("#repair-record-id").val(),
				type: $("#repair-return-device-type").val(),
				num: $("#repair-device-num").val(),
				new_location: $("#new-device-location").val(),
				datetime: $("#repair-return-datetime").val(),
				handler: $("#system-user-account").val(),
				memo: $("#repair-return-memo").val(),
			};

			ismpems_api_get("device", "return", repairReturn, function(json) {
				ismpems_debug_report("repair-return:return", json);
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
