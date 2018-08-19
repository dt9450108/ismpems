var config = window.config = {};

// Config reference element
var $ref = $("#ref");

// Configure responsive bootstrap toolkit
config.ResponsiveBootstrapToolkitVisibilityDivs = {
	'xs': $('<div class="device-xs 				  hidden-sm-up"></div>'),
	'sm': $('<div class="device-sm hidden-xs-down hidden-md-up"></div>'),
	'md': $('<div class="device-md hidden-sm-down hidden-lg-up"></div>'),
	'lg': $('<div class="device-lg hidden-md-down hidden-xl-up"></div>'),
	'xl': $('<div class="device-xl hidden-lg-down			  "></div>'),
};

ResponsiveBootstrapToolkit.use('Custom', config.ResponsiveBootstrapToolkitVisibilityDivs);
//validation configuration
config.validations = {
	debug: true,
	errorClass: 'has-error',
	validClass: 'success',
	errorElement: "span",

	// add error class
	highlight: function (element, errorClass, validClass) {
		$(element).parents("div.form-group")
			.addClass(errorClass)
			.removeClass(validClass);
	},

	// add error class
	unhighlight: function (element, errorClass, validClass) {
		$(element).parents(".has-error")
			.removeClass(errorClass)
			.addClass(validClass);
	},

	// submit handler
	// submitHandler: function(form) {
	// 	form.submit();
	// }
}

//delay time configuration
config.delayTime = 50;

// chart configurations
config.chart = {};

config.chart.colorPrimary = tinycolor($ref.find(".chart .color-primary").css("color"));
config.chart.colorSecondary = tinycolor($ref.find(".chart .color-secondary").css("color"));

// ISMP EMS SYSTEM GLOBAL VARIABLES
var ISMPEMS_CODE = {};
var ISMPEMS_SERVER_ROUTE = null;
var ISMPEMS_SERVER_API = null;
var ISMPEMS_DEBUG_REPORT = true;
var ISMPEMS_SESSION_TIMEOUT = {
	WARNING: null,
	REDIRECT: null
}

function ismpems_init() {
	$.ajax({
		url: 'load.init.php',
		data: {},
		method: "POST",
		timeout: 1000,
		error: function (xhr) {
			console.log('ERROR ===============    ismpems_init    ===============');
			console.log(xhr);
			ismpems_alert('Ajax request 發生錯誤');
		},
		success: function (response) {
			try {
				var json = $.parseJSON(response);
				ISMPEMS_CODE = json.ISMPEMS_CODE;
				ISMPEMS_SERVER_ROUTE = json.SERVER;
				ISMPEMS_SERVER_API = json.API;
				ISMPEMS_DEBUG_REPORT = json.DEBUG;
				ISMPEMS_SESSION_TIMEOUT.WARNING = json.SESSION_TIMEOUT - 30;
				ISMPEMS_SESSION_TIMEOUT.REDIRECT = json.SESSION_TIMEOUT;
			} catch (ex) {
				ismpems_debug_report("mod_loader > response", response);
				ismpems_debug_report("mod_loader > exception", ex);
			}
		},
		async: false
	});
}

function ismpems_api_get(router, action, param, callback) {
	$.ajax({
		url: ISMPEMS_SERVER_API + router + "/" + action,
		data: param,
		method: "POST",
		error: function (xhr) {
			console.log('ERROR ===============    ismpems_api_get    ===============');
			console.log(xhr);
			ismpems_alert("Ajax request 發生錯誤");
		},
		success: function (response) {
			try {
				// ismpems_debug_report("ismpems_api_get", response);
				var json = $.parseJSON(response);
				callback(json);
			} catch (ex) {
				ismpems_debug_report("mod_loader > response", response);
				ismpems_debug_report("mod_loader > exception", ex);
			}
		}
	});
}

function ismpems_alert(text, callback = null, text_content = true) {
	if (text_content) {
		$("#alert-modal").find(".modal-body > p").text(text);
	} else {
		$("#alert-modal").find(".modal-body > p").html(text);
	}
	$("#alert-modal").modal('show');
	if (callback != null) {
		$("#alert-modal").on('hidden.bs.modal', callback);
	}
}

function ismpems_confirm(text, confirm_callback = null) {
	$("#confirm-modal").find(".modal-body > p").text(text);
	$("#confirm-modal").modal({
		keyboard: true,
		focus: true
	})
	$("#confirm-modal").modal('show');
	if (confirm_callback != null) {
		$("#confirm-modal").on('shown.bs.modal', function (e) {
			$("#confirm-button").off().click(function () {
				confirm_callback($("#confirm-modal"));
			});
		});
	}
}

function ismpems_debug_report(tag, report) {
	if (ISMPEMS_DEBUG_REPORT) {
		console.log("[" + tag + "]");
		console.log(report);
	}
}

function pad_left(str, num) {
	return String("0000" + str).slice(0 - num);
}

// jquery extend function
$.extend({
	redirectPost: function (location, args) {
		var form = '';
		$.each(args, function (key, value) {
			value = value.split('"').join('\"')
			form += '<input type="hidden" name="' + key + '" value="' + value + '">';
		});
		$('<form action="' + location + '" method="POST">' + form + '</form>').appendTo($(document.body)).submit();
	}
});

function ismpems_round(value, decimals = 0) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}