var modalMedia = {
	$el: $("#modal-media"),
	result: {},
	options: {},
	open: function(options) {
		options = options || {};
		this.options = options;
		this.$el.modal('show');
		console.log("open");
	},
	close: function() {
		if ($.isFunction(this.options.beforeClose)) {
			this.options.beforeClose(this.result);
		}
		this.$el.modal('hide');
		if ($.isFunction(this.options.afterClose)) {
			this.options.beforeClose(this.result);
		}
		console.log("close");
	}
};