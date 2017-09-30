$(function() {
	if ($("article").hasClass("system-user-adder-page")) {
		// system-user-adder.js
		// check account is duplicated
		$("#user-account").on("blur", function() {
			if ($(this).val().trim().length > 0) {
				ismpems_api_get("systemd", "accountck", { account: $(this).val() }, function(json) {
					ismpems_debug_report("member-adder:accountck", json);
					switch (json.code) {
						case ISMPEMS_CODE.OK:
							$("#system-user-add-button").prop("disabled", true);
							$("#user-account-help-block").html('至少4個字元<br><span style="color: #F44336;">' + json.detail + '</span>');
							break;
						case ISMPEMS_CODE.NO_CONTENT:
							$("#system-user-add-button").prop("disabled", false);
							$("#user-account-help-block").html('至少4個字元');
							break;
						default:
							ismpems_alert("No such API");
					}
				});
			}
		});

		// check email is duplicated
		$("#user-email").on("blur", function() {
			if ($(this).val().trim().length > 0) {
				ismpems_api_get("systemd", "emailck", { email: $(this).val() }, function(json) {
					ismpems_debug_report("member-adder:emailck", json);
					switch (json.code) {
						case ISMPEMS_CODE.OK:
							$("#system-user-add-button").prop("disabled", true);
							$("#user-email-help-block").html(json.detail);
							break;
						case ISMPEMS_CODE.NO_CONTENT:
							$("#system-user-add-button").prop("disabled", false);
							$("#user-email-help-block").html('');
							break;
						default:
							ismpems_alert("No such API");
					}
				});
			}
		});

		$("#system-user-adder").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();
			var user = {
				useraccount: $("#user-account").val(),
				password: CryptoJS.SHA256($("#user-password").val()).toString(),
				retype_password: CryptoJS.SHA256($("#user-password").val()).toString(),
				username: $("#user-name").val(),
				email: $("#user-email").val(),
			};

			ismpems_api_get("systemd", "useradd", user, function(json) {
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
