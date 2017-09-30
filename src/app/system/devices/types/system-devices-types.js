$(function() {
    // system-devices-types.js
    if ($("article").hasClass("system-devices-types-page")) {
        $("#device-types-list").DataTable({
            ajax: {
                url: ISMPEMS_SERVER_API + "device/types",
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
            lengthMenu: [10, 20, 25, 50],
            pageLength: 20,
            select: true,
            columnDefs: [{
                targets: [0],
            }],
            pagingType: "full_numbers"
        });

        $("#table-data-delete").click(function() {
            var table = $("#device-types-list").DataTable();
            var selected = table.rows(".selected");
            var data = selected.data();

            if (data[0] !== undefined) {
                ismpems_confirm("確定要刪除？", function($modal) {
                    selected.remove().draw();
                    $modal.modal("hide");
                    ismpems_api_get("systemd", "typedel", data[0], del_device_type);
                });
            } else {
                ismpems_alert("請選擇一筆資料刪除！");
            }
        });

        function del_device_type(json) {
            ismpems_debug_report("del_device_type", json);
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
            $("#dt-title").text("新增裝置種類");
            $("#device-type-id").val("");
            $("#device-type-text").val("");
            $("#device-type-id-msg").html("");
            $("#device-type-text-msg").html("");
            $("#device-type-modal").modal("show");
        });

        $("#device-type-id").on("change keyup", function(e) {
            $(this).val($(this).val().toUpperCase());
        });

        $("#submit-button").click(function() {
            var $id = $("#device-type-id"),
                $text = $("#device-type-text"),
                idRegex = /[A-Z]{3}/,
                submit_check = true;
            $id.val($id.val().trim());
            if ($id.val() == "") {
                $("#device-type-id-msg").html("裝置種類編碼不得為空");
                submit_check = false;
            } else {
                if (idRegex.test($id.val().trim())) {
                    $("#device-type-id-msg").html("");
                } else {
                    $("#device-type-id-msg").html("裝置種類編碼格式錯誤");
                }
            }

            if ($text.val() == "") {
                $("#device-type-text-msg").html("裝置種類說明不得為空");
                submit_check = false;
            } else {
                $("#device-type-text-msg").html("");
            }

            if (submit_check) {
                $("#device-type-modal").modal("hide");
                ismpems_api_get("systemd", "typeadd", { id: $id.val(), text: $text.val().trim() }, device_type_add);
            }
        });

        function device_type_add(json) {
            ismpems_debug_report("type", json);
            switch (json.code) {
                case ISMPEMS_CODE.OK:
                    $("#device-types-list").dataTable().api().ajax.reload();
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
