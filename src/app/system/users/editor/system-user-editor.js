$(function() {
	if ($("article").hasClass("system-user-editor-page")) {
		$("#submit-button").prop("disabled", true);
		// system-user-editor.js
		ismpems_api_get("systemd", "usersq", { "order": "ASC" }, function(json) {
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$.each(json.data, function(key, val) {
						$("#user-query-key").append($("<option/>", {
							value: val.account,
							text: val.name + " (" + val.account + ")"
						}));
					});
					break;
				case ISMPEMS_CODE.NO_CONTENT:
					ismpems_alert(json.detail);
					break;
				default:
					ismpems_alert("No such API");
			}
		});

		// check account is duplicated
		$("#user-account").on("blur", function() {
			if ($(this).val().trim().length > 0 && $("#user-old-account").val() != $(this).val().trim()) {
				ismpems_api_get("systemd", "accountck", { account: $(this).val() }, function(json) {
					ismpems_debug_report("member-adder:accountck", json);
					switch (json.code) {
						case ISMPEMS_CODE.OK:
							$("#user-account-help-block").html('至少4個字元<br><span style="color: #F44336;">' + json.detail + '</span>');
							$("#submit-button").prop("disabled", false);
							break;
						case ISMPEMS_CODE.NO_CONTENT:
							$("#user-account-help-block").html('至少4個字元');
							$("#submit-button").prop("disabled", true);
							break;
						default:
							ismpems_alert("No such API");
							$("#submit-button").prop("disabled", true);
					}
				});
			}
		});

		// check email is duplicated
		$("#user-email").on("blur", function() {
			if ($(this).val().trim().length > 0 && $("#user-old-email").val() != $(this).val().trim()) {
				ismpems_api_get("systemd", "emailck", { email: $(this).val() }, function(json) {
					ismpems_debug_report("member-adder:emailck", json);
					switch (json.code) {
						case ISMPEMS_CODE.OK:
							$("#user-email-help-block").html(json.detail);
							break;
						case ISMPEMS_CODE.NO_CONTENT:
							$("#user-email-help-block").html('');
							break;
						default:
							ismpems_alert("No such API");
					}
				});
			}
		});

		$("#system-user-query").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();
			if ($("#user-query-key").val() == "") {
				return false;
			}
			ismpems_api_get("systemd", "userq", { key: $("#user-query-key").val() }, function(json) {
				ismpems_debug_report("member-editor:userq", json);
				switch (json.code) {
					case ISMPEMS_CODE.OK:
						$("#user-account").val(json.data.account);
						$("#user-old-account").val(json.data.account);
						$("#user-name").val(json.data.name);
						$("#user-email").val(json.data.email);
						$("#user-old-email").val(json.data.email);
						$("#submit-button").prop("disabled", false);
						break;
					case ISMPEMS_CODE.NO_CONTENT:
						ismpems_alert(json.detail);
						clear_form();
						$("#submit-button").prop("disabled", true);
						break;
					default:
						clear_form();
						$("#submit-button").prop("disabled", true);
						ismpems_alert("No such API");
				}
			});
			return false;
		});

		$("#system-user-editor").submit(function(e) {
			// prevent submit form but do validation
			e.preventDefault();
			var user = {
				olduseraccount: $("#user-old-account").val(),
				useraccount: $("#user-account").val(),
				password: null,
				username: $("#user-name").val(),
				email: $("#user-email").val(),
			};

			if ($("#user-password").val().length) {
				user.password = CryptoJS.SHA256($("#user-password").val()).toString();
			}

			ismpems_api_get("systemd", "userupdate", user, function(json) {
				ismpems_debug_report("member-editor:userupdate", json);
				switch (json.code) {
					case ISMPEMS_CODE.OK:
						ismpems_alert(json.detail, function() { location.reload(); });
						break;
					case ISMPEMS_CODE.BAD_REQUEST:
						ismpems_alert(json.detail);
						break;
					case ISMPEMS_CODE.NOT_MODIFIED:
						ismpems_alert(json.detail);
						break;
					default:
						ismpems_alert("No such API");
				}
			});
			return false;
		});

		function clear_form() {
			$("#user-account").val("");
			$("#user-old-account").val("");
			$("#user-name").val("");
			$("#user-email").val("");
			$("#user-old-email").val("");
		}
		// page function end
	}
})
