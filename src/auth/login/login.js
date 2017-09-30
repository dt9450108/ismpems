//LoginForm validation
$(function() {
	if ($('#login-form').length) {
		var loginValidationSettings = {
			rules: {
				useraccount: {
					required: true,
				},
				password: "required",
			},
			messages: {
				useraccount: {
					required: "請輸入帳號",
				},
				password: "請輸入密碼",
			},
			invalidHandler: function() {
				animate({
					name: 'shake',
					selector: '.auth-container > .card'
				});
			}
		}
		$.extend(loginValidationSettings, config.validations);
		loginValidationSettings.submitHandler = function(form, e) {
			e.preventDefault();

			var user = {
				account: $("#useraccount").val(),
				password: CryptoJS.SHA256($("#password").val()).toString(),
			};
			ismpems_api_get("login", "login", user, function(json) {
				ismpems_debug_report("login-page:login", json);
				switch (json.code) {
					case ISMPEMS_CODE.OK:
						window.location.href = json.data.url;
						break;
					case ISMPEMS_CODE.BAD_REQUEST:
						ismpems_alert(json.detail);
						break;
					default:
						ismpems_alert("No such API");
				}
			});
			return false;
		};
		$("#login-form").validate(loginValidationSettings);
	}
})
