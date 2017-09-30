<?php
switch ($Action) {
    case 'stat':
        $res = mysql_query("SELECT * FROM `device`");
        $total_devices_num = mysql_num_rows($res);
        $lent_devices_num = 0;
        $not_lent_devices_num = 0;
        $scrappable_devices_num = 0;

        $devices = [];
        while ($row = mysql_fetch_array($res)) {
            if (2 == $row['d_status']) {
                $lent_devices_num++;
            } else if (1 == $row['d_status']) {
                $not_lent_devices_num++;
            }

            if (!empty($row['d_duration']) && !empty($row['d_buy_date'])) {
                $buy_date = new DateTime($row['d_buy_date']);
                $end_date = $buy_date->add(new DateInterval("P" . $row['d_duration'] . "Y"));
                if ($end_date < (new DateTime(date(DATE_FORMAT)))) {
                    $scrappable_devices_num++;
                }
            }
        }
        $res = mysql_query("SELECT * FROM `member` WHERE 1");
        $members_num = mysql_num_rows($res);

        API_Result(ISMPEMS_CODE_OK, "OK", "設備狀態統計", ["total" => $total_devices_num, "lent" => $lent_devices_num, "nlent" => $not_lent_devices_num, "scrappable" => $scrappable_devices_num, "members" => $members_num]);
        break;
    default:
        header('Location: ' . ISMPEMS_SERVER . "error-404-alt.html");
}
