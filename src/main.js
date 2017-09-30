$(function() {
	ismpems_init();
	$("body").addClass("loaded");
	$("#lab-device-location-layout").click(function() {
		ismpems_alert('<img src="' + ISMPEMS_SERVER_ROUTE + 'assets/ismp_office_layout.png" class="img-fluid" alt="ISMP location layout">', null, false);
	});

	if ($("#app").length) {
		$.sessionTimeout({
			title: "閒置過久即將被系統自動登出",
			message: "您長時間未動作，即將被系統自動登出。",
			logoutButton: "確定登出",
			keepAliveButton: "繼續登入",
			keepAliveUrl: ISMPEMS_SERVER_API + 'login/keepalive',
			keepAlive: true,
			ajaxData: { account: $("#system-user-account").val() },
			logoutUrl: ISMPEMS_SERVER_API + 'login/logout',
			onLogout: function(json) {
				var json = $.parseJSON(json);
				window.location.href = json.data.url;
			},
			redirUrl: ISMPEMS_SERVER_API + 'login/logout',
			onRedir: function(json) {
				var json = $.parseJSON(json);
				window.location.href = json.data.url;
			},
			warnAfter: ISMPEMS_SESSION_TIMEOUT.WARNING * 1000,
			redirAfter: ISMPEMS_SESSION_TIMEOUT.REDIRECT * 1000,
			countdownMessage: '即將在 {timer} 秒後被登出...',
			countdownBar: true,
			logoutButtonClasses: "btn btn-danger",
			keepAliveButtonClasses: "btn btn-primary",
			countdownBarClasses: "progress-bar progress-bar-warning progress-bar-striped",
		});
	}
});


/***********************************************
 *        NProgress Settings
 ***********************************************/

// start load bar
NProgress.start();

// end loading bar
NProgress.done();
