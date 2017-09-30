$(function() {
    // lend-list.js
    if ($("article").hasClass("repair-list-page")) {
        $("#repair-list").DataTable({
            ajax: {
                url: ISMPEMS_SERVER_API + "device/repairsq",
                type: "POST",
                dataSrc: function(json) {
                    console.log(json);
                    return json.data;
                }
            },
            columns: [
                { data: "type" },
                { data: "num" },
                { data: "repair_datetime" },
                { data: "return_datetime" },
                { data: "repair_handler" },
                { data: "return_handler" },
                { data: "memo" },
            ],
            language: {
                url: ISMPEMS_SERVER_ROUTE + "js/Chinese-traditional.json"
            },
            lengthMenu: [10, 20, 25, 50],
            pageLength: 20,
            pagingType: "full_numbers"
        });
    }
});
