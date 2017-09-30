$(function() {
	if ($("article").hasClass("lend-return-page")) {
		// check the page is redirect
		if ($("#lend-editor-redirect").val() === "1") {
			setTimeout(function() { $("#lend-return-query").submit(); }, 50);
		}

		$("#lend-return-datetime").flatpickr({
			enableTime: true,
			dateFormat: "Y-m-d H:i",
			defaultDate: new Date(),
			locale: "zh"
		});
		$("#submit-button").prop("disabled", true);
		// lend-return.js
		// get device types options
		ismpems_api_get("device", "types", { "order": "ASC" }, function(json) {
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$.each(json.data, function(key, val) {
						$("#lend-return-device-type-select").append($("<option/>", {
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
						$("#lend-return-location-after-select").append($("<option/>", {
							value: val.loc,
							text: val.loc + " (" + val.freq + ")"
						}));
					});
					$("#lend-return-location-after-select").on("change", function(e) {
						$("#lend-return-location-after").val($(e.target).val());
					});
					break;
				case ISMPEMS_CODE.NO_CONTENT:
					ismpems_alert("沒有設備種類資料");
					break;
				default:
					ismpems_alert("No such API");
			}
		});

		$("#lend-return-device-type-select").on('change', function() {
			$("#lend-return-device-type").val($(this).val());
			$("#lend-return-device-type").change();
		});

		// format device-type
		$("#lend-return-device-type").on("change keyup", function(e) {
			$(this).val($(this).val().toUpperCase());
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

		$("#lend-return-query").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();
			var type = $("#lend-return-device-type").val(),
				num = $("#lend-device-num").val();
			if (type.length === 3 && num.length > 0) {
				ismpems_api_get("member", "lendq", { type: type, num: num }, function(json) {
					ismpems_debug_report("lend-return:lend query", json);
					switch (json.code) {
						case ISMPEMS_CODE.OK:
							$("#lend-record-id").val(json.data.id);
							$("#lend-return-member").val(json.data.member.name);
							$("#lend-return-location").val(json.data.location);
							$("#lend-lend-datetime").val(json.data.lend_datetime);
							$("#lend-lend-handler").val(json.data.lend_handler.name);
							$("#lend-return-memo").val(json.data.memo);
							$("#editor-last-modified-datetime").html('<em>設備資料最後修改時間：' + json.data.device.last_modified_datetime + '</em>');
							$("#submit-button").prop("disabled", false);
							break;
						case ISMPEMS_CODE.BAD_REQUEST:
							ismpems_alert(json.detail);
							$("#editor-last-modified-datetime").html('');
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

		$("#lend-return-form").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();

			var lendReturn = {
				id: $("#lend-record-id").val(),
				type: $("#lend-return-device-type").val(),
				num: $("#lend-device-num").val(),
				new_location: $("#lend-return-location-after").val(),
				datetime: $("#lend-return-datetime").val(),
				handler: $("#system-user-account").val(),
				memo: $("#lend-return-memo").val(),
			};

			ismpems_api_get("member", "return", lendReturn, function(json) {
				ismpems_debug_report("lend-return:return", json);
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
