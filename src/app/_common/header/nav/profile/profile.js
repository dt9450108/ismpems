$(function() {
	// profile.js
	$("#user-edit-password-button").click(function() {
		$("#user-edit-password-modal").on('hidden.bs.modal', function(e) {
			$("#user-old-password").val("");
			$("#user-new-password").val("");
			$("#user-retype-new-password").val("");
		});

		$("#user-edit-password-modal").on('shown.bs.modal', function(e) {
			$("#user-edit-pwd-submit-button").off().click(function() {
				var $oldpw = $("#user-old-password"),
					$newpw = $("#user-new-password"),
					$retype_newpw = $("#user-retype-new-password"),
					submit_check = true;

				submit_check = errorMsg(($oldpw.val().length >= 6), $("#user-old-password-msg"), "舊密碼字數太少");
				submit_check = errorMsg(($newpw.val().length >= 6), $("#user-new-password-msg"), "新密碼字數太少");
				submit_check = errorMsg(($retype_newpw.val().length >= 6), $("#user-retype-new-password-msg"), "新密碼確認字數太少");
				if (submit_check) {
					submit_check = errorMsg(($newpw.val() == $retype_newpw.val()), $("#user-retype-new-password-msg"), "密碼確認與新密碼不相同");
				}

				if (submit_check) {
					ismpems_api_get("systemd", "editpw", {
						account: $("#system-user-account").val(),
						oldpw: CryptoJS.SHA256($oldpw.val()).toString(),
						newpw: CryptoJS.SHA256($newpw.val()).toString()
					}, function(json) {
						ismpems_debug_report("profile.js: edit password", json);
						switch (json.code) {
							case ISMPEMS_CODE.OK:
								$("#user-edit-password-modal").modal("hide");
								ismpems_alert(json.detail, function() { window.location.href = window.location.href; });
								break;
							case ISMPEMS_CODE.BAD_REQUEST:
								errorMsg(false, $("#user-retype-new-password-msg"), json.detail);
								break;
							case ISMPEMS_CODE.NOT_MODIFIED:
								errorMsg(false, $("#user-retype-new-password-msg"), json.detail);
								break;
							case ISMPEMS_CODE.SERVER_ERROR:
								$("#user-edit-password-modal").modal("hide");
								ismpems_alert(json.detail);
								break;
							default:
								$("#user-edit-password-modal").modal("hide");
								ismpems_alert("No such api");
						}
					});
				}

				function errorMsg(verified, $sel, msg) {
					if (!verified) {
						$sel.html(msg);
					} else {
						$sel.html("");
					}
					return verified;
				}
			});
		});
		$("#user-edit-password-modal").modal("show");
	});

	$("#user-logout-button").click(function() {
		ismpems_api_get("login", "logout", null, function(json) {
			ismpems_debug_report("profile.js: logout", json);
			$("#user-edit-password-modal").modal("hide");
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					window.location.href = json.data.url;
					break;
				default:
					ismpems_alert("No such api");
			}
		});
	});
})
