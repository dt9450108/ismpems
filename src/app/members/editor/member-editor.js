$(function() {
	if ($("article").hasClass("member-editor-page")) {
		// member-editor.js
		if ($("#members-editor-redirect").val() === "1") {
			setTimeout(function() { $("#member-query").submit(); }, 50);
		}

		$("#submit-button").prop("disabled", true);
		$("#member-query").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();

			ismpems_api_get("member", "query", {
				key: $("#member-query-key").val()
			}, function(json) {
				ismpems_debug_report("member-editor:query", json);
				switch (json.code) {
					case ISMPEMS_CODE.OK:
						$("#member-id").val(json.data.id);
						$("#member-name").val(json.data.name);
						$("#member-email").val(json.data.email);
						$("#member-memo").val(json.data.memo);
						$('input[name="member_activation_radios"][value="' + json.data.activation + '"]').attr('checked', true);
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

			return false;
		});

		$("#member-editor").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();

			ismpems_debug_report("member-editor.js: submit", {
				id: $("#member-id").val(),
				name: $("#member-name").val(),
				email: $("#member-email").val(),
				activation: $('input[name="member_activation_radios"]:checked').val(),
				memo: $("#member-memo").val()
			});

			ismpems_api_get("member", "update", {
				id: $("#member-id").val(),
				name: $("#member-name").val(),
				email: $("#member-email").val(),
				activation: $('input[name="member_activation_radios"]:checked').val(),
				memo: $("#member-memo").val()
			}, function(json) {
				ismpems_debug_report("member-editor:update", json);
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
