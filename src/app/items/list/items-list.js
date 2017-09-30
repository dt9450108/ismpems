$(function() {
	// items-list.js
	if ($("article").hasClass("items-list-page")) {
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
					$("#device-type-select").on("change", function() {
						table.ajax.reload();
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
					$("#device-status-select").on("change", function() {
						table.ajax.reload();
					});
					break;
				case ISMPEMS_CODE.NO_CONTENT:
					ismpems_alert("沒有設備狀態資料");
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
						$("#device-locations-select").append($("<option/>", {
							value: val.loc,
							text: val.loc + " (" + val.freq + ")"
						}));
					});
					$("#device-locations-select").on("change", function() {
						table.ajax.reload();
					});
					break;
				case ISMPEMS_CODE.NO_CONTENT:
					ismpems_alert("沒有設備位置資料");
					break;
				default:
					ismpems_alert("No such API");
			}
		});

		$("#device-query-reset-button").click(function() {
			$("#device-type-select").val("");
			$("#device-status-select").val("");
			$("#device-locations-select").val("").change();
		});

		var table = $("#devices-list").DataTable({
			ajax: {
				url: ISMPEMS_SERVER_API + "device/queryall",
				type: "POST",
				dataSrc: function(json) {
					return json.data;
				},
				data: function() {
					return {
						type: $("#device-type-select").val(),
						status: $("#device-status-select").val(),
						location: $("#device-locations-select").val()
					};
				}
			},
			columns: [
				{ data: "type" },
				{ data: "num" },
				{ data: "name" },
				{ data: "location" },
				{ data: "status_text" },
				{ data: "ncku_property_num" },
				{ data: "ncku_num" },
				{ data: "ncku_serial_num" },
				{ data: "ncku_price_name" },
				{ data: "brand" },
				{ data: "serial_num" },
				{ data: "duration" },
				{ data: "buy_from" },
				{ data: "buy_date" },
				{ data: "price" },
				{ data: "spec" },
				{ data: "memo" },
				{ data: "last_modified_datetime" }
			],
			language: {
				url: ISMPEMS_SERVER_ROUTE + "js/Chinese-traditional.json"
			},
			lengthMenu: [5, 10, 20, 25, 50],
			pageLength: 10,
			select: true,
			pagingType: "full_numbers",
			order: [
				[13, "desc"]
			]
		});

		table.on('select', function(e, dt, type, indexes) {
			var data = table.rows(indexes).data().toArray()[0];
			$("#device-edit-button").prop("disabled", false);
			if (data.status === "1") {
				$("#device-lending-button").prop("disabled", false);
			} else if (data.status === "2") {
				$("#device-returning-button").prop("disabled", false);
			}
		}).on('deselect', function(e, dt, type, indexes) {
			$("#device-edit-button").prop("disabled", true);
			$("#device-lending-button").prop("disabled", true);
		});
		$("#device-edit-button").click(function() {
			var rowData = table.rows(".selected").data().toArray()[0];
			$.redirectPost(ISMPEMS_SERVER_ROUTE + "item-editor.html", { type: rowData.type, num: rowData.num, redirect: "1" });
		});
		$("#device-lending-button").click(function() {
			var rowData = table.rows(".selected").data().toArray()[0];
			$.redirectPost(ISMPEMS_SERVER_ROUTE + "lend-adder.html", { type: rowData.type, num: rowData.num, redirect: "1" });
		});
		$("#device-returning-button").click(function() {
			var rowData = table.rows(".selected").data().toArray()[0];
			$.redirectPost(ISMPEMS_SERVER_ROUTE + "lend-return.html", { type: rowData.type, num: rowData.num, redirect: "1" });
		});
	}
});
