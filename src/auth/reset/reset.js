//ResetForm validation
$(function() {
	if (!$('#reset-form').length) {
        return false;
    }

    var resetValidationSettings = {
	    rules: {
	        email1: {
	            required: true,
	            email: true
	        }
	    },
	    messages: {
	        email1: {
	            required: "請輸入Email",
	            email: "請輸入有效的Email"
	        }
	    },
	    invalidHandler: function() {
			animate({
				name: 'shake',
				selector: '.auth-container > .card'
			});
		}
	}
	$.extend(resetValidationSettings, config.validations);
    $('#reset-form').validate(resetValidationSettings);
})