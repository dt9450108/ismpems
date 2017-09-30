$(function() {
	if ($("article").hasClass("dashboard-page")) {
		// dashboard.js
		// get device types options
		ismpems_api_get("dashboard", "stat", null, function(json) {
			ismpems_debug_report("dashboard stat", json);
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$("#devices-total-number").html(json.data.total);
					$("#devices-lent-number").html(json.data.lent);
					$("#devices-not-lend-number").html(json.data.nlent);
					$("#devices-scrappable-number").html(json.data.scrappable);
					$("#members-number").html(json.data.members);

					var total = parseInt(json.data.total),
						lent = parseInt(json.data.lent),
						nlent = parseInt(json.data.nlent),
						scrappable = parseInt(json.data.scrappable),
						members = parseInt(json.data.members);
					$("#device-total-number-bar").css("width", (total * 100.0 / total) + "%");
					$("#devices-lent-number-bar").css("width", (ismpems_round(lent * 100.0 / total, 0)) + "%");
					$("#devices-not-lend-number-bar").css("width", (ismpems_round(nlent * 100.0 / total, 0)) + "%");
					$("#devices-scrappable-number-bar").css("width", (ismpems_round(scrappable * 100.0 / total, 0)) + "%");
					$("#members-number-bar").css("width", (members * 100.0 / members) + "%");
					break;
				default:
					ismpems_alert("No such API");
			}
		});

		// page function end
	}
})
