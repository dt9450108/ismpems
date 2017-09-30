//SignupForm validation
$(function() {
	if ($("#signup-form").length) {
		var signupValidationSettings = {
			rules: {
				username: {
					required: true,
				},
				useraccount: {
					required: true,
					minlength: 4,
					remote: {
						url: ISMPEMS_SERVER_API + "systemd/accountck",
						type: "POST",
						dataType: "json",
						data: {
							account: function() {
								return $("#user-account").val();
							}
						},
						dataFilter: function(data, type) {
							var json = $.parseJSON(data);
							return !json.data.exist;
						}
					}
				},
				email: {
					required: true,
					email: true,
					remote: {
						url: ISMPEMS_SERVER_API + "systemd/emailck",
						type: "POST",
						dataType: "json",
						data: {
							email: function() {
								return $("#user-email").val();
							}
						},
						dataFilter: function(data, type) {
							var json = $.parseJSON(data);
							return !json.data.exist;
						}
					}
				},
				password: {
					required: true,
					minlength: 6
				},
				retype_password: {
					required: true,
					minlength: 6,
					equalTo: "#user-password"
				},
			},
			groups: {
				pass: "password retype_password",
			},
			errorPlacement: function(error, element) {
				if (element.attr("name") == "password" || element.attr("name") == "retype_password") {
					error.insertAfter($("#retype_password").closest('.row'));
					element.parents("div.form-group").addClass('has-error');
				} else {
					error.insertAfter(element);
				}
			},
			messages: {
				username: {
					required: "請輸入姓名",
				},
				useraccount: {
					required: "請輸入帳號",
					minlength: "輸入應為至少4個字元",
					remote: "帳號重複，無法使用"
				},
				email: {
					required: "請輸入Email",
					email: "請輸入有效的Email",
					remote: "Email重複，無法使用"
				},
				password: {
					required: "請輸入密碼",
					minlength: "密碼應為至少6個字元",
				},
				retype_password: {
					required: "請再次輸入密碼",
					minlength: "密碼應為至少6個字元",
					equalTo: "請輸入相同的密碼"
				},
			},
			invalidHandler: function() {
				animate({
					name: 'shake',
					selector: '.auth-container > .card'
				});
			}
		}
		$.extend(signupValidationSettings, config.validations);
		signupValidationSettings.submitHandler = function(form, e) {
			e.preventDefault();

			var user = {
				useraccount: $("#user-account").val(),
				password: CryptoJS.SHA256($("#user-password").val()).toString(),
				retype_password: CryptoJS.SHA256($("#retype_password").val()).toString(),
				username: $("#user-name").val(),
				email: $("#user-email").val(),
			};

			ismpems_api_get("systemd", "useradd", user, function(json) {
				ismpems_debug_report("member-adder:add", json);
				switch (json.code) {
					case ISMPEMS_CODE.OK:
						ismpems_alert(json.detail, function() { window.location.href = ISMPEMS_SERVER_ROUTE + "login.html"; });
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
		};
		$('#signup-form').validate(signupValidationSettings);
	}
});
