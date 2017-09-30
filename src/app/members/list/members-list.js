$(function() {
	// members-list.js
	if ($("article").hasClass("members-list-page")) {
		var table = $("#members-list").DataTable({
			ajax: {
				url: ISMPEMS_SERVER_API + "member/all",
				type: "POST",
				dataSrc: function(json) {
					ismpems_debug_report("member-list.js:datatable", json);
					$.each(json.data, function(key, val) {
						val.activation = parseInt(val.activation) ? "Activated" : "Deactivated";
					});
					return json.data;
				}
			},
			columns: [
				{ data: "id" },
				{ data: "name" },
				{ data: "email" },
				{ data: "activation" },
				{ data: "memo" },
			],
			language: {
				url: ISMPEMS_SERVER_ROUTE + "js/Chinese-traditional.json"
			},
			lengthMenu: [10, 20, 25, 50],
			pageLength: 20,
			select: true,
			columnDefs: [{
				targets: 0,
				visible: false,
				searchable: false
			}],
			pagingType: "full_numbers"
		});
		table.on('select', function(e, dt, type, indexes) {
			$("#members-edit-button").prop("disabled", false);
		}).on('deselect', function(e, dt, type, indexes) {
			$("#members-edit-button").prop("disabled", true);
		});
		$("#members-edit-button").click(function() {
			var rowData = table.rows(".selected").data().toArray()[0];
			console.log(rowData);
			$.redirectPost(ISMPEMS_SERVER_ROUTE + "member-editor.html", { email: rowData.email, redirect: "1" });
		});
	}
});
