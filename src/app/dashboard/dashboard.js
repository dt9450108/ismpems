$(function () {
	if ($("article").hasClass("dashboard-page")) {
		// dashboard.js
		// get device types options
		ismpems_api_get("dashboard", "stat", null, function (json) {
			ismpems_debug_report("dashboard stat", json);
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$("#devices-total-number").html(json.data.total);
					$("#devices-lent-number").html(json.data.lent);
					$("#devices-not-lend-number").html(json.data.nlent);
					$("#devices-scrappable-number").html(json.data.scrappable);
					$("#members-number").html(json.data.members);

					var total = parseInt(json.data.total),
						lent = parseInt(json.data.lent),
						nlent = parseInt(json.data.nlent),
						scrappable = parseInt(json.data.scrappable),
						members = parseInt(json.data.members);
					$("#device-total-number-bar").css("width", (total * 100.0 / total) + "%");
					$("#devices-lent-number-bar").css("width", (ismpems_round(lent * 100.0 / total, 0)) + "%");
					$("#devices-not-lend-number-bar").css("width", (ismpems_round(nlent * 100.0 / total, 0)) + "%");
					$("#devices-scrappable-number-bar").css("width", (ismpems_round(scrappable * 100.0 / total, 0)) + "%");
					$("#members-number-bar").css("width", (members * 100.0 / members) + "%");
					$('#dashboard-lab-layout').html('<img src="' + ISMPEMS_SERVER_ROUTE + 'assets/ismp_office_layout.png" class="img-fluid" style="margin: 0 auto;" alt="ISMP location layout">');
					break;
				default:
					ismpems_alert("No such API");
			}
		});

		setTimeout(getKindStat, 100);

		$('#dashboard-kind-stat-filter').click(filterKindStat);
		$('#dashboard-kind-stat-filter-clear').click(function() {
			var $container = $('#dashboard-kind-stat');
			 $container.find('li').show();
			 $('#dashboard-search-input').val('');
		});
		// page function end
	}

	function getKindStat() {
		ismpems_api_get("dashboard", "kindstat", null, function (json) {
			ismpems_debug_report("dashboard kindstat", json);
			switch (json.code) {
				case ISMPEMS_CODE.OK:
					$.each(json.data.stat, function (idx, val) {
						$('#dashboard-kind-stat').append(
							'<li class="item"> \
								<div class="item-row"> \
									<div class="item-col item-col-title no-overflow"> \
										<div> \
											<h4 class="item-title no-wrap"> \
												' + val.type + ' \
											</h4> \
										</div> \
									</div> \
									<div class="item-col item-col-sales"> \
										<div class="item-heading">Sales</div> \
										<div class="item-text"> \
											' + val.text + ' \
										</div> \
									</div> \
									<div class="item-col item-col-stats"> \
										<div class="no-overflow"> \
											<div class="item"> \
												<div class="value"> \
													' + val.count + ' \
												</div> \
											</div> \
											<div class="progress item-progress"> \
												<div class="progress-bar" style="width: ' + (val.count * 100 / json.data.total) * 2 + '%;"></div> \
											</div> \
										</div> \
									</div> \
								</div> \
							</li>'
						);

					});
					break;
				default:
					ismpems_alert("No such API");
			}
		});
	}

	function filterKindStat() {
		var $container = $('#dashboard-kind-stat'),
			$lis = $container.find('li'),
			target = $('#dashboard-search-input').val().trim();
		if (target == '') {
			return false;
		}

		console.log($lis);
		for (var i = 1; i < $lis.length; i++) {
			var title = $($lis[i]).find('.item-title').html().trim(),
				text = $($lis[i]).find('.item-text').html().trim();

			if (title.indexOf(target) == -1 && text.indexOf(target) == -1) {
				$($lis[i]).hide();
			} else {
				$($lis[i]).show();
			}
		}
	}
})