<?php
switch ($Action) {
    case 'return':
        $rr_id = $_POST['id'];
        $d_type = $_POST['type'];
        $d_num = $_POST['num'];
        $d_location = $_POST['new_location'];
        $rr_return_datetime = $_POST['datetime'];
        $rr_f_return_handler = $_POST['handler'];
        $rr_memo = $_POST['memo'];
        if (empty($rr_id) || empty($d_type) || empty($d_num) || empty($d_location) || empty($rr_return_datetime) || empty($rr_f_return_handler) || empty($rr_memo)) {
            API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
        } else {
            $sql = sprintf("UPDATE `repair_record` SET `rr_return_datetime` = '%s', `rr_f_return_handler` = '%s', `rr_memo` = %s WHERE `rr_id` = %s",
                $rr_return_datetime,
                $rr_f_return_handler,
                empty($rr_memo) ? "NULL" : "'" . mysql_real_escape_string(trim($rr_memo)) . "'",
                $rr_id
            );
            $res = mysql_query($sql);
            if (mysql_affected_rows() > 0) {
                // update device status
                $sql = sprintf("UPDATE `device` SET `d_status` = 1, `d_location` = '%s', `d_last_modified_datetime` = NOW() WHERE `d_type` = '%s' AND `d_num` = %s", $d_location, $d_type, $d_num);
                $res = mysql_query($sql);
                if (mysql_affected_rows() > 0) {
                    API_Result(ISMPEMS_CODE_OK, "OK", "送修設備歸還記錄已儲存");
                } else {
                    API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
                }
            } else {
                API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
            }
        }
        break;
    case 'repairq':
        $type = $_POST['type'];
        $num = intval($_POST['num']);
        if (empty($type) || empty($num)) {
            API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
        } else {
            $sql = sprintf("SELECT * FROM `repair_record`, `device_status`, `device`, `system_user` WHERE `rr_fd_type` = `d_type` AND `rr_fd_num` = `d_num` AND `rr_f_repair_handler` = `su_account` AND `rr_f_return_handler` IS NULL AND `rr_fd_type` = '%s' AND `rr_fd_num` = %s", $type, $num);
            $res = mysql_query($sql);
            $num = mysql_num_rows($res);
            if ($num > 0) {
                $row = mysql_fetch_array($res);
                $repair_record = [
                    "id" => $row['rr_id'],
                    "repair_datetime" => substr($row['rr_repair_datetime'], 0, count($row['rr_repair_datetime']) - 4),
                    "return_datetime" => substr($row['rr_return_datetime'], 0, count($row['rr_return_datetime']) - 4),
                    "memo" => $row['rr_memo'],
                    "device" => [
                        "type" => $row['d_type'],
                        "num" => $row['d_num'],
                        "name" => $row['d_real_name'],
                        "location" => $row['d_location'],
                        "brand" => $row['d_brand'],
                        "serial_num" => $row['d_serial_num'],
                        "duration" => $row['d_duration'],
                        "buy_from" => $row['d_buy_from'],
                        "buy_date" => $row['d_buy_date'],
                        "price" => $row['d_price'],
                        "spec" => $row['d_spec'],
                        "memo" => $row['d_memo'],
                        "last_modified_datetime" => $row['d_last_modified_datetime'],
                        "status" => [
                            "id" => $row['ds_id'],
                            "text" => $row['ds_text'],
                        ],
                        "ncku" => [
                            "property_num" => $row['d_ncku_property_num'],
                            "num" => $row['d_ncku_num'],
                            "serial_num" => $row['d_ncku_serial_num'],
                            "price_name" => $row['d_ncku_price_name'],
                        ],
                    ],
                    "repair_handler" => [
                        "account" => $row['su_account'],
                        "name" => $row['su_name'],
                        "email" => $row['su_email'],
                        "last_login" => $row['su_last_login'],
                    ]];
                API_Result(ISMPEMS_CODE_OK, "OK", "查詢維修記錄完成", $repair_record);
            } else {
                API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "沒有此筆維修記錄");
            }
        }
        break;
    case 'repairsq':
        $res = mysql_query("SELECT `rr_id`, `rr_fd_type`, `rr_fd_num`, `rr_repair_datetime`, `rr_return_datetime`, `rr_f_repair_handler`, `rr_f_return_handler`, `rr_memo`, `system_user_t1`.`su_name` AS `repair_handler`, `system_user_t2`.`su_name` AS `return_handler` FROM `repair_record` LEFT JOIN `system_user` AS `system_user_t1` ON `repair_record`.`rr_f_repair_handler` = `system_user_t1`.`su_account` LEFT JOIN `system_user` AS `system_user_t2` ON `repair_record`.`rr_f_return_handler` = `system_user_t2`.`su_account`");
        $num = mysql_num_rows($res);
        if ($num == 0) {
            API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "沒有任何維修記錄", []);
        } else {
            $repairs = [];
            while ($row = mysql_fetch_array($res)) {
                $repair_datetime = substr($row['rr_repair_datetime'], 0, count($row['rr_repair_datetime']) - 4);
                $return_datetime = substr($row['rr_return_datetime'], 0, count($row['rr_return_datetime']) - 4);
                $repairs[] = [
                    "lr_id" => $row['rr_id'],
                    "type" => $row['rr_fd_type'],
                    "num" => $row['rr_fd_num'],
                    "repair_datetime" => $repair_datetime,
                    "return_datetime" => (($return_datetime) ? $return_datetime : null),
                    "rr_f_repair_handler" => $row['rr_f_repair_handler'],
                    "rr_f_return_handler" => $row['rr_f_return_handler'],
                    "memo" => $row['rr_memo'],
                    "repair_handler" => $row['repair_handler'],
                    "return_handler" => $row['return_handler'],
                ];
            }
            API_Result(ISMPEMS_CODE_OK, "OK", "查詢所有維修記錄成功", $repairs);
        }
        break;
    case 'repair':
        $rr_fd_type = $_POST['type'];
        $rr_fd_num = $_POST['num'];
        $rr_repair_datetime = $_POST['datetime'];
        $rr_f_repair_handler = $_POST['handler'];
        $rr_memo = mysql_real_escape_string(trim($_POST['memo']));
        if (empty($rr_fd_type) || empty($rr_fd_num) || empty($rr_repair_datetime) || empty($rr_f_repair_handler) || empty($rr_memo)) {
            API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
        } else {
            // check available of the device
            $res = mysql_query("SELECT * FROM `device` WHERE `d_type` = '$rr_fd_type' AND `d_num` = $rr_fd_num");
            $row = mysql_fetch_array($res);
            if ($row['d_status'] == 1) {
                $sql = sprintf("INSERT INTO `repair_record`(`rr_fd_type`, `rr_fd_num`, `rr_repair_datetime`, `rr_f_repair_handler`, `rr_memo`) VALUES ('%s', %s, '%s', '%s', '%s')",
                    $rr_fd_type,
                    $rr_fd_num,
                    $rr_repair_datetime,
                    $rr_f_repair_handler,
                    $rr_memo
                );
                $res = mysql_query($sql);
                if (mysql_affected_rows() > 0) {
                    // update device status
                    $sql = sprintf("UPDATE `device` SET `d_status` = 4, `d_last_modified_datetime` = NOW() WHERE `d_type` = '%s' AND `d_num` = %s", $rr_fd_type, $rr_fd_num);
                    $res = mysql_query($sql);
                    if (mysql_affected_rows() > 0) {
                        API_Result(ISMPEMS_CODE_OK, "OK", "設備送修已儲存");
                    } else {
                        API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
                    }
                } else {
                    API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
                }
            } else {
                // unavailable
                API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", $rr_fd_type . "-" . $rr_fd_num . " 設備無法送修");
            }
        }
        break;
    case 'queryall':
        $type_clause = "";
        if (!empty($_POST['type'])) {
            $type_clause = sprintf(" AND `d_type` = '%s'", $_POST['type']);
        }
        $status_clause = "";
        if (!empty($_POST['status'])) {
            $status_clause = sprintf(" AND `d_status` = %s", $_POST['status']);
        }
        $location_clause = "";
        if (!empty($_POST['location'])) {
            $location_clause = sprintf(" AND `d_location` = '%s'", $_POST['location']);
        }

        $sql = sprintf("SELECT * FROM `device`, `device_status` WHERE `d_status` = `ds_id` %s %s %s", $type_clause, $status_clause, $location_clause);
        $res = mysql_query($sql);
        $num = mysql_num_rows($res);
        if ($num == 0) {
            API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "沒有任何設備資料", []);
        } else {
            $devices = [];
            while ($row = mysql_fetch_array($res)) {
                $devices[] = [
                    "type" => $row['d_type'],
                    "num" => $row['d_num'],
                    "name" => $row['d_real_name'],
                    "location" => $row['d_location'],
                    "status" => $row['d_status'],
                    "ncku_property_num" => $row['d_ncku_property_num'],
                    "ncku_num" => $row['d_ncku_num'],
                    "ncku_serial_num" => $row['d_ncku_serial_num'],
                    "ncku_price_name" => $row['d_ncku_price_name'],
                    "brand" => $row['d_brand'],
                    "serial_num" => $row['d_serial_num'],
                    "duration" => $row['d_duration'],
                    "buy_from" => $row['d_buy_from'],
                    "buy_date" => $row['d_buy_date'],
                    "price" => $row['d_price'],
                    "spec" => $row['d_spec'],
                    "memo" => $row['d_memo'],
                    "last_modified_datetime" => $row['d_last_modified_datetime'],
                    "status_text" => $row['ds_text'],
                ];
            }
            API_Result(ISMPEMS_CODE_OK, "OK", "查詢所有設備資料成功", $devices);
        }
        break;
    case 'update':
        $d_type = $_POST['type'];
        $d_num = $_POST['num'];
        $d_real_name = $_POST['name'];
        $d_location = $_POST['location'];
        $d_status = $_POST['status'];
        $d_ncku_property_num = $_POST['ncku_property_num'];
        $d_ncku_num = $_POST['ncku_num'];
        $d_ncku_serial_num = $_POST['ncku_serial_num'];
        $d_ncku_price_name = $_POST['ncku_price_name'];
        $d_brand = $_POST['brand'];
        $d_serial_num = $_POST['serial_num'];
        $d_duration = $_POST['duration'];
        $d_buy_from = $_POST['buy_from'];
        $d_buy_date = $_POST['buy_date'];
        $d_price = $_POST['price'];
        $d_spec = $_POST['spec'];
        $d_memo = $_POST['memo'];

        if (empty($d_type) || empty($d_num) || empty($d_real_name) || empty($d_location) || empty($d_status)) {
            API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
        } else {
            $sql = sprintf("UPDATE `device` SET `d_real_name` = '%s', `d_location` = '%s', `d_status` = %s, `d_ncku_property_num` = %s, `d_ncku_num` = %s, `d_ncku_serial_num` = %s, `d_ncku_price_name` = %s, `d_brand` = %s, `d_serial_num` = %s, `d_duration` = %s, `d_buy_from` = %s, `d_buy_date` = %s, `d_price` = %s, `d_spec` = %s, `d_memo` = %s, `d_last_modified_datetime` = NOW() WHERE `d_type` = '%s' AND `d_num` = %s",
                mysql_real_escape_string(trim($d_real_name)),
                mysql_real_escape_string(trim($d_location)),
                $d_status,
                empty($d_ncku_property_num) ? "NULL" : "'" . mysql_real_escape_string(trim($d_ncku_property_num)) . "'",
                empty($d_ncku_num) ? "NULL" : "'" . mysql_real_escape_string(trim($d_ncku_num)) . "'",
                empty($d_ncku_serial_num) ? "NULL" : $d_ncku_serial_num,
                empty($d_ncku_price_name) ? "NULL" : "'" . mysql_real_escape_string(trim($d_ncku_price_name)) . "'",
                empty($d_brand) ? "NULL" : "'" . mysql_real_escape_string(trim($d_brand)) . "'",
                empty($d_serial_num) ? "NULL" : "'" . mysql_real_escape_string(trim($d_serial_num)) . "'",
                empty($d_duration) ? "NULL" : $d_duration,
                empty($d_buy_from) ? "NULL" : "'" . mysql_real_escape_string(trim($d_buy_from)) . "'",
                empty($d_buy_date) ? "NULL" : "'" . mysql_real_escape_string(trim($d_buy_date)) . "'",
                empty($d_price) ? "NULL" : $d_price,
                empty($d_spec) ? "NULL" : "'" . mysql_real_escape_string(trim($d_spec)) . "'",
                empty($d_memo) ? "NULL" : "'" . mysql_real_escape_string(trim($d_memo)) . "'",
                $d_type,
                intval($d_num)
            );
            $res = mysql_query($sql);

            if (mysql_affected_rows() >= 0) {
                API_Result(ISMPEMS_CODE_OK, "OK", "設備更新成功");
            } else {
                API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
            }
        }
        break;
    case 'query':
        $d_type = $_POST['type'];
        $d_num = $_POST['num'];

        if (empty($d_type) || empty($d_num)) {
            API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
        } else {
            // check device is existed
            $sql = sprintf("SELECT * FROM `device`, `device_status` WHERE `d_type` = '%s' AND `d_num` = %s AND `d_status` = `ds_id`", $d_type, $d_num);
            $res = mysql_query($sql);
            $num = mysql_num_rows($res);

            if ($num == 0) {
                API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "此設備不存在，請檢查種類或編號");
            } else {
                $row = mysql_fetch_array($res);
                $device = [
                    "type" => $row['d_type'],
                    "num" => $row['d_num'],
                    "name" => $row['d_real_name'],
                    "location" => $row['d_location'],
                    "status" => $row['d_status'],
                    "ncku_property_num" => $row['d_ncku_property_num'],
                    "ncku_num" => $row['d_ncku_num'],
                    "ncku_serial_num" => $row['d_ncku_serial_num'],
                    "ncku_price_name" => $row['d_ncku_price_name'],
                    "brand" => $row['d_brand'],
                    "serial_num" => $row['d_serial_num'],
                    "duration" => $row['d_duration'],
                    "buy_from" => $row['d_buy_from'],
                    "buy_date" => $row['d_buy_date'],
                    "price" => $row['d_price'],
                    "spec" => $row['d_spec'],
                    "memo" => $row['d_memo'],
                    "last_modified_datetime" => $row['d_last_modified_datetime'],
                    "status_text" => $row['ds_text'],
                ];
                API_Result(ISMPEMS_CODE_OK, "OK", "設備查詢成功", $device);
            }
        }
        break;
    case 'add':
        $d_type = $_POST['type'];
        $d_num = $_POST['num'];
        $d_real_name = $_POST['name'];
        $d_location = $_POST['location'];
        $d_status = $_POST['status'];
        $d_ncku_property_num = $_POST['ncku_property_num'];
        $d_ncku_num = $_POST['ncku_num'];
        $d_ncku_serial_num = $_POST['ncku_serial_num'];
        $d_ncku_price_name = $_POST['ncku_price_name'];
        $d_brand = $_POST['brand'];
        $d_serial_num = $_POST['serial_num'];
        $d_duration = $_POST['duration'];
        $d_buy_from = $_POST['buy_from'];
        $d_buy_date = $_POST['buy_date'];
        $d_price = $_POST['price'];
        $d_spec = $_POST['spec'];
        $d_memo = $_POST['memo'];

        if (empty($d_type) || empty($d_num) || empty($d_real_name) || empty($d_location) || empty($d_status)) {
            API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
        } else {
            // check type and num existed
            $sql = sprintf("SELECT * FROM `device` WHERE `d_type` = '%s' AND `d_num` = %s", $d_type, $d_num);
            $res = mysql_query($sql);
            $num = mysql_num_rows($res);
            if ($num > 0) {
                API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "此設備已存在，請檢查種類或編號");
            } else {
                $sql = sprintf("INSERT INTO `device`(`d_type`, `d_num`, `d_real_name`, `d_location`, `d_status`, `d_ncku_property_num`, `d_ncku_num`, `d_ncku_serial_num`, `d_ncku_price_name`, `d_brand`, `d_serial_num`, `d_duration`, `d_buy_from`, `d_buy_date`, `d_price`, `d_spec`, `d_memo`, `d_last_modified_datetime`) VALUES ('%s', %s, '%s', '%s', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())",
                    $d_type,
                    intval($d_num),
                    mysql_real_escape_string(trim($d_real_name)),
                    mysql_real_escape_string(trim($d_location)),
                    $d_status,
                    empty($d_ncku_property_num) ? "NULL" : "'" . mysql_real_escape_string(trim($d_ncku_property_num)) . "'",
                    empty($d_ncku_num) ? "NULL" : "'" . mysql_real_escape_string(trim($d_ncku_num)) . "'",
                    empty($d_ncku_serial_num) ? "NULL" : $d_ncku_serial_num,
                    empty($d_ncku_price_name) ? "NULL" : "'" . mysql_real_escape_string(trim($d_ncku_price_name)) . "'",
                    empty($d_brand) ? "NULL" : "'" . mysql_real_escape_string(trim($d_brand)) . "'",
                    empty($d_serial_num) ? "NULL" : "'" . mysql_real_escape_string(trim($d_serial_num)) . "'",
                    empty($d_duration) ? "NULL" : $d_duration,
                    empty($d_buy_from) ? "NULL" : "'" . mysql_real_escape_string(trim($d_buy_from)) . "'",
                    empty($d_buy_date) ? "NULL" : "'" . mysql_real_escape_string(trim($d_buy_date)) . "'",
                    empty($d_price) ? "NULL" : $d_price,
                    empty($d_spec) ? "NULL" : "'" . mysql_real_escape_string(trim($d_spec)) . "'",
                    empty($d_memo) ? "NULL" : "'" . mysql_real_escape_string(trim($d_memo)) . "'"
                );
                $res = mysql_query($sql);

                if (mysql_affected_rows() >= 0) {
                    API_Result(ISMPEMS_CODE_OK, "OK", "設備新增成功");
                } else {
                    API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
                }
            }
        }
        break;
    case 'getnum':
        $type = $_POST['type'];
        $sql = sprintf("SELECT `d_type`, `d_num` FROM `device` WHERE `d_type` = '%s' ORDER BY `d_num` DESC LIMIT 1", $type);
        $res = mysql_query($sql);
        $num = mysql_num_rows($res);
        if ($num == 0) {
            API_Result(ISMPEMS_CODE_OK, "OK", "取得 $type 種類之編號", ["last" => 0, "next" => 1]);
        } else {
            $row = mysql_fetch_array($res);
            $nextNum = intval($row['d_num']) + 1;
            API_Result(ISMPEMS_CODE_OK, "OK", "取得 $type 種類之編號", ["last" => $row['d_num'], "next" => $nextNum]);
        }
        break;
    case 'types':
        $order = isset($_POST['order']) ? $_POST['order'] : "ASC";
        $sql = sprintf("SELECT * FROM `device_type` ORDER BY `dt_type` %s", $order);
        $res = mysql_query($sql);
        $num = mysql_num_rows($res);
        if ($num > 0) {
            $device_type = [];
            while ($row = mysql_fetch_array($res)) {
                $device_type[] = ["code" => $row['dt_type'], "text" => $row['dt_text']];
            }
            API_Result(ISMPEMS_CODE_OK, "OK", "List is the device types", $device_type);
        } else {
            API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "No information of device types", []);
        }
        break;
    case 'status':
        $order = isset($_POST['order']) ? $_POST['order'] : "ASC";
        $sql = sprintf("SELECT * FROM `device_status` ORDER BY `ds_id` %s", $order);
        $res = mysql_query($sql);
        $num = mysql_num_rows($res);
        if ($num > 0) {
            $device_status = [];
            while ($row = mysql_fetch_array($res)) {
                $device_status[] = ["code" => $row['ds_id'], "text" => $row['ds_text']];
            }
            API_Result(ISMPEMS_CODE_OK, "OK", "List is the device status", $device_status);
        } else {
            API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "No information of device status", []);
        }
        break;
    case 'extlocq':
        // query existing location data
        $order = isset($_POST['order']) ? $_POST['order'] : "ASC";
        $sql = sprintf("SELECT DISTINCT `d_location`, COUNT(`d_location`) AS `d_loc_freq` FROM `device` GROUP BY `d_location` ORDER BY `d_location` %s", $order);
        $res = mysql_query($sql);
        $num = mysql_num_rows($res);
        if ($num > 0) {
            $locations = [];
            while ($row = mysql_fetch_array($res)) {
                $locations[] = [
                    "loc" => $row['d_location'],
                    "freq" => $row['d_loc_freq']];
            }
            API_Result(ISMPEMS_CODE_OK, "OK", "List is the used location data", $locations);
        } else {
            API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "No information of used location data", []);
        }
        break;
    default:
        header('Location: ' . ISMPEMS_SERVER . "error-404-alt.html");
}
