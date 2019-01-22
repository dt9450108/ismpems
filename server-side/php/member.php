<?php
switch ($Action) {
    case 'lendsq':
        // SELECT `lr_id`, `lr_fd_type`, `lr_fd_num`, `lr_fm_id`, `lr_before_location`, `lr_lend_datetime`, `lr_return_datetime`, `lr_f_lend_handler`, `lr_f_return_handler`, `lr_memo`, `m_name`, `system_user`.`su_name` AS `lend_handler`, `system_user`.`su_name` AS `return_handler` FROM `lend_record`, `member` WHERE `lr_fm_id` = `m_id`
        // LEFT JOIN `system_user` ON `lend_record`.`lr_f_lend_handler` = `system_user`.`su_account`
        // LEFT JOIN `system_user` ON `lend_record`.`lr_f_return_handler` = `system_user`.`su_account`
        // (SELECT `su_name` FROM `lend_record`, `system_user` WHERE `lr_f_return_handler` = `su_account`) AS
        // (SELECT `su_name` FROM `lend_record`, `system_user` WHERE `lr_f_lend_handler` = `su_account`) AS
        $type_clause = "";
        if (!empty($_POST['type'])) {
            $type_clause = sprintf(" AND `lend_record`.`lr_fd_type` = '%s'", $_POST['type']);
        }
        $member_clause = "";
        if (!empty($_POST['member'])) {
            $member_clause = sprintf(" AND `lend_record`.`lr_fm_id` = %s", $_POST['member']);
        }
        $status_clause = "";
        switch ($_POST['status']) {
            case 'back':
                $status_clause = " AND `lend_record`.`lr_return_datetime` IS NOT NULL";
                break;
            case 'lent':
                $status_clause = " AND `lend_record`.`lr_return_datetime` IS NULL";
                break;
            default:
        }

        $res = mysql_query("SELECT `lend_record`.`lr_id`, `lend_record`.`lr_fd_type`, `lend_record`.`lr_fd_num`, `lend_record`.`lr_fm_id`, `lend_record`.`lr_before_location`, `lend_record`.`lr_lend_datetime`, `lend_record`.`lr_return_datetime`, `lend_record`.`lr_f_lend_handler`, `lend_record`.`lr_f_return_handler`, `lend_record`.`lr_memo`, `member`.`m_name` AS `lender_name`, `system_user_t1`.`su_name` AS `lend_handler`, `system_user_t2`.`su_name` AS `return_handler`, `device`.`d_real_name` FROM `lend_record` LEFT JOIN `member` ON `lend_record`.`lr_fm_id` = `member`.`m_id` LEFT JOIN `system_user` AS `system_user_t1` ON `lend_record`.`lr_f_lend_handler` = `system_user_t1`.`su_account` LEFT JOIN `system_user` AS `system_user_t2` ON `lend_record`.`lr_f_return_handler` = `system_user_t2`.`su_account` LEFT JOIN `device` ON `device`.`d_type` = `lend_record`.`lr_fd_type` AND `device`.`d_num` = `lend_record`.`lr_fd_num` WHERE 1 $type_clause $member_clause $status_clause");
        $num = mysql_num_rows($res);
        if ($num == 0) {
            API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "沒有任何借用記錄", []);
        } else {
            $lends = [];
            while ($row = mysql_fetch_array($res)) {
                $lend_datetime = substr($row['lr_lend_datetime'], 0, count($row['lr_lend_datetime']) - 4);
                $return_datetime = substr($row['lr_return_datetime'], 0, count($row['lr_return_datetime']) - 4);
                $lends[] = [
                    "lr_id" => $row['lr_id'],
                    "type" => $row['lr_fd_type'],
                    "num" => $row['lr_fd_num'],
                    "m_id" => $row['lr_fm_id'],
                    "location" => $row['lr_before_location'],
                    "lend_datetime" => $lend_datetime,
                    "return_datetime" => (($return_datetime) ? $return_datetime : null),
                    "lr_f_lend_handler" => $row['lr_f_lend_handler'],
                    "lr_f_return_handler" => $row['lr_f_return_handler'],
                    "memo" => $row['lr_memo'],
                    "lender_name" => $row['lender_name'],
                    "lend_handler" => $row['lend_handler'],
                    "return_handler" => $row['return_handler'],
                    "name" => $row['d_real_name'],
                ];
            }
            API_Result(ISMPEMS_CODE_OK, "OK", "查詢所有借用記錄成功", $lends);
        }
        break;
    case 'update':
        $m_id = $_POST['id'];
        $m_name = mysql_real_escape_string(trim($_POST['name']));
        $m_email = mysql_real_escape_string(trim($_POST['email']));
        $m_active = mysql_real_escape_string(trim($_POST['activation']));
        $m_memo = mysql_real_escape_string(trim($_POST['memo']));

        if (empty($m_id) || empty($m_name) || empty($m_email)) {
            API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
        } else {
            $sql = sprintf("UPDATE `member` SET `m_name` = '%s', `m_email` = '%s', `m_memo` = %s, `m_active` = %s WHERE `m_id` = %s",
                $m_name,
                $m_email,
                empty($m_memo) ? "NULL" : "'" . $m_memo . "'",
                $m_active,
                $m_id
            );
            $res = mysql_query($sql);
            if (mysql_affected_rows() > 0) {
                API_Result(ISMPEMS_CODE_OK, "OK", "借用人資料已更新");
            } else {
                API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
            }
        }
        break;
    case 'add':
        $m_name = $_POST['name'];
        $m_email = $_POST['email'];
        $m_memo = $_POST['memo'];

        if (empty($m_name) || empty($m_email)) {
            API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
        } else {
            $sql = sprintf("INSERT INTO `member`(`m_name`, `m_email`, `m_memo`) VALUES ('%s', '%s', %s)",
                mysql_real_escape_string(trim($m_name)),
                mysql_real_escape_string(trim($m_email)),
                empty($m_memo) ? "NULL" : "'" . mysql_real_escape_string(trim($m_memo)) . "'"
            );
            $res = mysql_query($sql);
            if (mysql_affected_rows() > 0) {
                API_Result(ISMPEMS_CODE_OK, "OK", "成功新增借用人資料");
            } else {
                API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
            }
        }
        break;
    case 'query':
        $key = mysql_real_escape_string(trim($_POST['key']));
        if (empty($key)) {
            API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
        } else {
            $sql = sprintf("SELECT * FROM `member` WHERE `m_name` = '%s' OR `m_email` = '%s'", $key, $key);
            $res = mysql_query($sql);
            $num = mysql_num_rows($res);
            if ($num > 0) {
                $row = mysql_fetch_array($res);
                $member = [
                    "id" => $row['m_id'],
                    "name" => $row['m_name'],
                    "email" => $row['m_email'],
                    "activation" => $row['m_active'],
                    "memo" => $row['m_memo'],
                ];
                API_Result(ISMPEMS_CODE_OK, "OK", "成功查詢借用人資料", $member);
            } else {
                API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "沒有關於 $key 的借用人資料");
            }
        }
        break;
    case 'return':
        $lr_id = $_POST['id'];
        $lr_return_datetime = $_POST['datetime'];
        $lr_f_return_handler = $_POST['handler'];
        $lr_memo = $_POST['memo'];
        $d_type = $_POST['type'];
        $d_num = $_POST['num'];
        $d_location = $_POST['new_location'];
        if (empty($lr_id) || empty($lr_return_datetime) || empty($lr_f_return_handler) || empty($d_type) || empty($d_num) || empty($d_location)) {
            API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
        } else {
            $sql = sprintf("UPDATE `lend_record` SET `lr_return_datetime` = '%s', `lr_f_return_handler` = '%s', `lr_memo` = %s, `lr_last_modified` = NOW() WHERE `lr_id` = %s",
                $lr_return_datetime,
                $lr_f_return_handler,
                empty($lr_memo) ? "NULL" : "'" . mysql_real_escape_string(trim($lr_memo)) . "'",
                $lr_id
            );
            $res = mysql_query($sql);
            if (mysql_affected_rows() > 0) {
                // update device status
                $sql = sprintf("UPDATE `device` SET `d_status` = 1, `d_location` = '%s', `d_last_modified_datetime` = NOW() WHERE `d_type` = '%s' AND `d_num` = %s", $d_location, $d_type, $d_num);
                $res = mysql_query($sql);
                if (mysql_affected_rows() > 0) {
                    API_Result(ISMPEMS_CODE_OK, "OK", "設備歸還記錄已儲存");
                } else {
                    API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
                }
            } else {
                API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
            }
        }
        break;
    case 'lendq':
        $lr_fd_type = $_POST['type'];
        $lr_fd_num = intval($_POST['num']);
        if (empty($lr_fd_type) || empty($lr_fd_num)) {
            API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
        } else {
            $sql = sprintf("SELECT * FROM `lend_record`, `device_status`, `device`, `system_user`, `member` WHERE `m_id` = `lr_fm_id` AND `d_type` = `lr_fd_type` AND `d_num` = `lr_fd_num` AND `d_status` = `ds_id` AND `su_account` = `lr_f_lend_handler` AND `lr_return_datetime` IS NULL AND `lr_fd_type` = '%s' AND `lr_fd_num` = %s", $lr_fd_type, $lr_fd_num);
            $res = mysql_query($sql);
            $num = mysql_num_rows($res);
            if ($num > 0) {
                $row = mysql_fetch_array($res);
                $lend_record = [
                    "id" => $row['lr_id'],
                    "location" => $row['lr_before_location'],
                    "lend_datetime" => $row['lr_lend_datetime'],
                    "return_datetime" => $row['lr_return_datetime'],
                    "memo" => $row['lr_memo'],
                    "member" => [
                        "id" => $row['m_id'],
                        "name" => $row['m_name'],
                        "email" => $row['m_email'],
                        "memo" => $row['m_memo'],
                    ],
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
                    "lend_handler" => [
                        "account" => $row['su_account'],
                        "name" => $row['su_name'],
                        "email" => $row['su_email'],
                        "last_login" => $row['su_last_login'],
                    ]];
                API_Result(ISMPEMS_CODE_OK, "OK", "查詢借用記錄完成", $lend_record);
            } else {
                API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "沒有此筆借用記錄");
            }
        }
        break;
    case 'lend':
        $lr_fd_type = $_POST['type'];
        $lr_fd_num = intval($_POST['num']);
        $lr_fm_id = $_POST['member'];
        $lr_before_location = $_POST['location'];
        $lr_lend_datetime = $_POST['datetime'];
        $lr_f_lend_handler = $_POST['handler'];
        $lr_memo = $_POST['memo'];

        if (empty($lr_fd_type) || empty($lr_fd_num) || empty($lr_fm_id) || empty($lr_before_location) || empty($lr_lend_datetime)) {
            API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
        } else {
            // check available of the device
            $res = mysql_query("SELECT * FROM `device` WHERE `d_type` = '$lr_fd_type' AND `d_num` = $lr_fd_num");
            $row = mysql_fetch_array($res);
            if ($row['d_status'] == 1) {
                // available
                $sql = sprintf("INSERT INTO `lend_record`(`lr_fd_type`, `lr_fd_num`, `lr_fm_id`, `lr_before_location`, `lr_lend_datetime`, `lr_f_lend_handler`, `lr_memo`) VALUES ('%s', %s, %s, '%s', '%s', '%s', %s)",
                    $lr_fd_type,
                    $lr_fd_num,
                    $lr_fm_id,
                    $lr_before_location,
                    $lr_lend_datetime,
                    $lr_f_lend_handler,
                    empty($lr_memo) ? "NULL" : "'" . mysql_real_escape_string(trim($lr_memo)) . "'"
                );

                $res = mysql_query($sql);
                if (mysql_affected_rows() > 0) {
                    // update device status
                    $sql = sprintf("UPDATE `device` SET `d_status` = 2, `d_location` = (SELECT `m_name` FROM `member` WHERE `m_id` = %s), `d_last_modified_datetime` = NOW() WHERE `d_type` = '%s' AND `d_num` = %s", $lr_fm_id, $lr_fd_type, $lr_fd_num);
                    $res = mysql_query($sql);
                    if (mysql_affected_rows() > 0) {
                        API_Result(ISMPEMS_CODE_OK, "OK", "設備借用記錄已儲存");
                    } else {
                        API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
                    }
                } else {
                    API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
                }
            } else {
                // unavailable
                API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", $lr_fd_type . "-" . $lr_fd_num . " 設備已被其他人借走");
            }
        }
        break;
    case 'all':
        $order = isset($_POST['order']) ? $_POST['order'] : "ASC";
        $activation = isset($_POST['activation']) ? $_POST['activation'] : "";
        $active_clause = "";
        if (!empty($activation)) {
            $active_clause = " AND `m_active` = $activation";
        }

        $sql = sprintf("SELECT * FROM `member` WHERE 1 %s ORDER BY CONVERT(`m_name` using big5) %s", $active_clause, $order);
        $res = mysql_query($sql);
        $num = mysql_num_rows($res);
        if ($num > 0) {
            $members = [];
            while ($row = mysql_fetch_array($res)) {
                $members[] = [
                    "id" => $row['m_id'],
                    "name" => $row['m_name'],
                    "email" => $row['m_email'],
                    "activation" => $row['m_active'],
                    "memo" => $row['m_memo'],
                ];
            }
            API_Result(ISMPEMS_CODE_OK, "OK", "List is the members", $members);
        } else {
            API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "No information of members", []);
        }
        break;
    default:
        header('Location: ' . ISMPEMS_SERVER . "error-404-alt.html");
}
