$(function() {
    // system-users-list.js
    if ($("article").hasClass("system-users-list-page")) {
        $("#users-list").DataTable({
            ajax: {
                url: ISMPEMS_SERVER_API + "systemd/usersq",
                type: "POST",
                dataSrc: function(json) {
                    console.log(json);
                    return json.data;
                }
            },
            columns: [
                { data: "account" },
                { data: "name" },
                { data: "email" },
                { data: "last_login" },
            ],
            language: {
                url: ISMPEMS_SERVER_ROUTE + "js/Chinese-traditional.json"
            },
            pagingType: "full_numbers",
			order: [
				[5, "desc"]
			],
        });
    }
});
