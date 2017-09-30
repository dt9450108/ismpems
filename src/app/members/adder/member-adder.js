$(function() {
	if ($("article").hasClass("member-adder-page")) {
		// member-adder.js
		$("#member-add-form").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();

			ismpems_api_get("member", "add", {
				name: $("#member-name").val(),
				email: $("#member-email").val(),
				memo: $("#member-memo").val(),
			}, function(json) {
				ismpems_debug_report("member-adder:add", json);
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
