$(function () {
	// lend-list.js
	if ($("article").hasClass("lend-list-page")) {
		// get device types options
		ismpems_api_get("device", "types", {
			"order": "ASC"
		}, function (json) {
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$.each(json.data, function (key, val) {
						$("#device-type-select").append($("<option/>", {
							value: val.code,
							text: val.code + " - " + val.text
						}));
					});
					$("#device-type-select").on("change", function () {
						table.ajax.reload();
					});

					$("input[name='lent-status-radio']").on("change", function () {
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

		// get members options
		ismpems_api_get("member", "all", {
			"order": "ASC"
		}, function (json) {
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$.each(json.data, function (key, val) {
						$("#member-select").append($("<option/>", {
							value: val.id,
							text: (key + 1) + ". " + val.name
						}));
					});
					$("#member-select").on("change", function () {
						table.ajax.reload();
					});
					break;
				case ISMPEMS_CODE.NO_CONTENT:
					ismpems_alert("沒有借用人資料");
					break;
				default:
					ismpems_alert("No such API");
			}
		});

		var table = $("#lends-list").DataTable({
			ajax: {
				url: ISMPEMS_SERVER_API + "member/lendsq",
				type: "POST",
				dataSrc: function (json) {
					console.log(json);
					return json.data;
				},
				data: function () {
					return {
						type: $("#device-type-select").val(),
						member: $("#member-select").val(),
						status: $("input[name='lent-status-radio']:checked").val()
					}
				}
			},
			columns: [{
					data: "type"
				},
				{
					data: "num"
				},
				{
					data: "name"
				},
				{
					data: "lender_name"
				},
				{
					data: "location"
				},
				{
					data: "lend_datetime"
				},
				{
					data: "return_datetime"
				},
				{
					data: "lend_handler"
				},
				{
					data: "return_handler"
				},
				{
					data: "memo"
				},
			],
			language: {
				url: ISMPEMS_SERVER_ROUTE + "js/Chinese-traditional.json"
			},
			lengthMenu: [10, 20, 25, 50],
			pageLength: 20,
			select: true,
			pagingType: "full_numbers",
			order: [
				[5, "desc"]
			],
			columnDefs: [{
				width: "15%",
				targets: 2
			}]
		});

		table.on('select', function (e, dt, type, indexes) {
			var rowData = table.rows(".selected").data().toArray()[0];
			if (rowData.return_datetime === null) {
				$("#lend-edit-button").prop("disabled", false);
			}
			$("#lend-device-edit-button").prop("disabled", false);
		}).on('deselect', function (e, dt, type, indexes) {
			$("#lend-edit-button").prop("disabled", true);
			$("#lend-device-edit-button").prop("disabled", true);
		});
		$("#lend-edit-button").click(function () {
			var rowData = table.rows(".selected").data().toArray()[0];
			console.log(rowData);
			$.redirectPost(ISMPEMS_SERVER_ROUTE + "lend-return.html", {
				type: rowData.type,
				num: rowData.num,
				redirect: "1"
			});
		});
		$("#lend-device-edit-button").click(function () {
			var rowData = table.rows(".selected").data().toArray()[0];
			console.log(rowData);
			$.redirectPost(ISMPEMS_SERVER_ROUTE + "item-editor.html", {
				type: rowData.type,
				num: rowData.num,
				redirect: "1"
			});
		});
	}
});