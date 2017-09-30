$(function() {
    // system-devices-status.js
    if ($("article").hasClass("system-devices-status-page")) {
        $("#device-status-list").DataTable({
            ajax: {
                url: ISMPEMS_SERVER_API + "device/status",
                type: "POST",
                dataSrc: function(json) {
                    console.log(json);
                    return json.data;
                }
            },
            columns: [
                { data: "code" },
                { data: "text" },
            ],
            language: {
                url: ISMPEMS_SERVER_ROUTE + "js/Chinese-traditional.json"
            },
            select: true,
            columnDefs: [{
                targets: [0],
            }],
            pagingType: "full_numbers"
        });

        $("#table-data-delete").click(function() {
            var table = $("#device-status-list").DataTable();
            var selected = table.rows(".selected");
            var data = selected.data();

            if (data[0] !== undefined) {
                ismpems_confirm("確定要刪除？", function($modal) {
                    selected.remove().draw();
                    $modal.modal("hide");
                    ismpems_api_get("systemd", "statusdel", data[0], del_device_status);
                });
            } else {
                ismpems_alert("請選擇一筆資料刪除！");
            }
        });

        function del_device_status(json) {
            ismpems_debug_report("del_device_status", json);
            switch (json.code) {
                case ISMPEMS_CODE.OK:
                    ismpems_alert(json.detail);
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
        }

        $("#table-data-add").click(function() {
            $("#ds-title").text("新增裝置狀態");
            $("#device-status-text-msg").html("");
            $("#device-status-text").val("");
            $("#device-status-id-field").hide();
            $("#device-status-modal").modal("show");
        });

        $("#submit-button").click(function() {
            var $text = $("#device-status-text");
            if ($text.val() == "") {
                $("#device-status-text-msg").html("裝置狀態說明不得為空");
            } else {
                $("#device-status-text-msg").html("");
                $("#device-status-modal").modal("hide");
                ismpems_api_get("systemd", "statusadd", { text: $text.val().trim() }, device_status_add);
            }
        });

        function device_status_add(json) {
            ismpems_debug_report("device_status_add", json);
            switch (json.code) {
                case ISMPEMS_CODE.OK:
                    $("#device-status-list").dataTable().api().ajax.reload();
                    ismpems_alert(json.detail);
                    break;
                case ISMPEMS_CODE.BAD_REQUEST:
                    ismpems_alert(json.detail);
                    break;
                default:
                    ismpems_alert(json.detail);
            }
        }
    }
});
