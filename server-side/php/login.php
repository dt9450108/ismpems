<?php
require_once 'ismpems_session.php';
start_session(SESSION_TIMEOUT * 1000);

switch ($Action) {
    case 'keepalive':
        $ac = mysql_real_escape_string(trim($_POST['account']));
        mysql_query("UPDATE `system_user` SET `su_last_login` = NOW() WHERE `su_account` = '$ac'");
        API_Result(ISMPEMS_CODE_OK, "OK", "更新登入時間成功", ["url" => ISMPEMS_SERVER]);
        break;
    case 'login':
        $ac = mysql_real_escape_string(trim($_POST['account']));
        $pw = mysql_real_escape_string($_POST['password']);
        //check if form is submitted
        if (empty($ac) || empty($pw)) {
            API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "未輸入帳號或密碼");
        } else {
            $sql = sprintf("SELECT * FROM `system_user` WHERE `su_account` = '%s' AND `su_password` = '%s'", $ac, $pw);
            $result = mysql_query($sql);

            if ($row = mysql_fetch_array($result)) {
                // update last login datetime
                mysql_query("UPDATE `system_user` SET `su_last_login` = NOW() WHERE `su_account` = '$ac'");
                $_SESSION['ismpems_ac'] = $row['su_account'];
                $_SESSION['ismpems_na'] = $row['su_name'];
                $_SESSION['ismpems_em'] = $row['su_email'];
                $_SESSION['ismpems_au'] = $row['su_auth'];
                API_Result(ISMPEMS_CODE_OK, "OK", "登入成功", ["url" => ISMPEMS_SERVER]);
            } else {
                API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "帳號或密碼錯誤", ["url" => null]);
            }
        }
        break;
    case 'logout':
        if (isset($_SESSION['ismpems_ac']) && isset($_SESSION['ismpems_na']) && isset($_SESSION['ismpems_em']) && isset($_SESSION['ismpems_au'])) {
            session_destroy();
            unset($_SESSION['ismpems_ac']);
            unset($_SESSION['ismpems_na']);
            unset($_SESSION['ismpems_em']);
            unset($_SESSION['ismpems_au']);

            API_Result(ISMPEMS_CODE_OK, "OK", "登出成功", ["url" => ISMPEMS_SERVER . "login.html"]);
        } else {
            header("Location: " . ISMPEMS_SERVER . "login.html");
        }
        break;
    default:
        // header('Location: ' . ISMPEMS_SERVER . "error-404-alt.html");
}
