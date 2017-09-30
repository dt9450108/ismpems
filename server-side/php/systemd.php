<?php
switch ($Action) {
case 'editpw':
	$account = $_POST['account'];
	$oldpw = $_POST['oldpw'];
	$newpw = $_POST['newpw'];
	if (empty($oldpw) || empty($newpw) || empty($account)) {
		API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
	} else {
		// check old password is correct
		$sql = "SELECT * FROM `system_user` WHERE `su_account` = '$account' AND `su_password` = '$oldpw'";
		$res = mysql_query($sql);
		$num = mysql_num_rows($res);
		if ($num == 0) {
			// old password is incorrect
			API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "輸入的舊密碼錯誤");
		} else {
			// check old and new password is not same
			if ($oldpw == $newpw) {
				API_Result(ISMPEMS_CODE_NOT_MODIFIED, "Not Modified", "新密碼與舊密碼相同，請輸入不同密碼！");
			} else {
				$sql = "UPDATE `system_user` SET `su_password` = '$newpw' WHERE `su_account` = '$account'";
				mysql_query($sql);
				if (mysql_affected_rows() > 0) {
					API_Result(ISMPEMS_CODE_OK, "OK", "密碼變更成功");
				} else {
					API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
				}
			}
		}
	}
	break;
case 'typeadd':
	$dt_type = mysql_real_escape_string($_POST['id']);
	$dt_text = mysql_real_escape_string($_POST['text']);
	if (empty($dt_type) || empty($dt_text)) {
		API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
	} else {
		// check status text is existed
		$sql = "SELECT * FROM `device_type` WHERE `dt_type` = '$dt_type' OR `dt_text` = '$dt_text'";
		$res = mysql_query($sql);
		$num = mysql_num_rows($res);
		if ($num == 0) {
			$sql = "INSERT INTO `device_type`(`dt_type`, `dt_text`) VALUES ('$dt_type', '$dt_text')";
			mysql_query($sql);
			if (mysql_affected_rows() > 0) {
				API_Result(ISMPEMS_CODE_OK, "OK", "設備種類 [$dt_type - $dt_text] 已新增");
			} else {
				API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
			}
		} else {
			API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "[$dt_type] 已經存在或 [$dt_text] 類似的種類已經存在");
		}
	}
	break;
case 'statusadd':
	$ds_text = mysql_real_escape_string($_POST['text']);
	if (empty($ds_text)) {
		API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
	} else {
		// check status text is existed
		$sql = "SELECT * FROM `device_status` WHERE `ds_text` = '$ds_text'";
		$res = mysql_query($sql);
		$num = mysql_num_rows($res);
		if ($num == 0) {
			$sql = "INSERT INTO `device_status`(`ds_text`) VALUES ('$ds_text')";
			mysql_query($sql);
			if (mysql_affected_rows() > 0) {
				$newId = mysql_insert_id();
				API_Result(ISMPEMS_CODE_OK, "OK", "設備狀態 [$newId - $ds_text] 已新增");
			} else {
				API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
			}
		} else {
			API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "[$ds_text] 已經存在");
		}
	}
	break;
case 'statusdel':
	$ds_id = $_POST['code'];
	$ds_text = $_POST['text'];
	if (empty($ds_id)) {
		API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
	} else {
		$sql = "DELETE FROM `device_status` WHERE `ds_id` = '$ds_id'";
		mysql_query($sql);
		if (mysql_affected_rows() > 0) {
			API_Result(ISMPEMS_CODE_OK, "OK", "設備狀態 [$ds_id - $ds_text] 已刪除");
		} else {
			API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
		}
	}
	break;
case 'typedel':
	$dt_type = $_POST['code'];
	$dt_text = $_POST['text'];
	if (empty($dt_type)) {
		API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
	} else {
		$sql = "DELETE FROM `device_type` WHERE `dt_type` = '$dt_type'";
		mysql_query($sql);
		if (mysql_affected_rows() > 0) {
			API_Result(ISMPEMS_CODE_OK, "OK", "設備種類 [$dt_type - $dt_text] 已刪除");
		} else {
			API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
		}
	}
	break;
case 'usersq':
	$order = isset($_POST['order']) ? $_POST['order'] : "ASC";
	$res = mysql_query("SELECT * FROM `system_user` ORDER BY `su_name` $order");
	$num = mysql_num_rows($res);
	if ($num > 0) {
		$users = [];
		while ($row = mysql_fetch_array($res)) {
			$users[] = [
				"account" => $row['su_account'],
				"name" => $row['su_name'],
				"email" => $row['su_email'],
				"last_login" => $row['su_last_login'],
			];
		}
		API_Result(ISMPEMS_CODE_OK, "OK", "成功查詢所有系統使用者資料", $users);
	} else {
		API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "查無系統使用者資料", []);
	}
	break;
case 'userupdate':
	$su_old_account = mysql_real_escape_string(trim($_POST['olduseraccount']));
	$su_account = mysql_real_escape_string(trim($_POST['useraccount']));
	$su_password = $_POST['password'];
	$su_name = mysql_real_escape_string(trim($_POST['username']));
	$su_email = mysql_real_escape_string(trim($_POST['email']));
	if (empty($su_old_account) || empty($su_account) || empty($su_name) || empty($su_email)) {
		API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
	} else {
		$sql = sprintf("UPDATE `system_user` SET `su_account` = '%s'%s, `su_name` = '%s', `su_email` = '%s' WHERE `su_account` = '%s'",
			$su_account,
			empty($su_password) ? "" : ", `su_password` = '$su_password'",
			$su_name,
			$su_email,
			$su_old_account
		);
		$res = mysql_query($sql);
		if (mysql_affected_rows() > 0) {
			API_Result(ISMPEMS_CODE_OK, "OK", "系統用者資料已更新");
		} else {
			API_Result(ISMPEMS_CODE_NOT_MODIFIED, "Not Modified", "使用者資料相同，未更改");
		}
	}
	break;
case 'accountck':
	$su_account = mysql_real_escape_string(trim($_POST['account']));
	if (!empty($su_account)) {
		$res = mysql_query("SELECT * FROM `system_user` WHERE `su_account` = '$su_account'");
		$num = mysql_num_rows($res);
		if ($num > 0) {
			API_Result(ISMPEMS_CODE_OK, "OK", "帳號無法使用", ["exist" => true]);
		} else {
			API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "帳號可以使用", ["exist" => false]);
		}
	}
	break;
case 'emailck':
	$su_email = mysql_real_escape_string(trim($_POST['email']));
	if (!empty($su_email)) {
		$res = mysql_query("SELECT * FROM `system_user` WHERE `su_email` = '$su_email'");
		$num = mysql_num_rows($res);
		if ($num > 0) {
			API_Result(ISMPEMS_CODE_OK, "OK", "Email已存在，無法使用", ["exist" => true]);
		} else {
			API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "帳號的Email可以使用", ["exist" => false]);
		}
	}
	break;
case 'userq':
	$key = mysql_real_escape_string(trim($_POST['key']));
	if (empty($key)) {
		API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
	} else {
		$sql = sprintf("SELECT * FROM `system_user` WHERE `su_account` = '%s' OR `su_email` = '%s'", $key, $key);
		$res = mysql_query($sql);
		$num = mysql_num_rows($res);
		if ($num > 0) {
			$row = mysql_fetch_array($res);
			$user = [
				"account" => $row['su_account'],
				"name" => $row['su_name'],
				"email" => $row['su_email'],
			];
			API_Result(ISMPEMS_CODE_OK, "OK", "成功查詢系統使用者資料", $user);
		} else {
			API_Result(ISMPEMS_CODE_NO_CONTENT, "No Content", "沒有關於 $key 的系統使用者資料");
		}
	}
	break;
case 'useradd':
	$su_account = mysql_real_escape_string(trim($_POST['useraccount']));
	$su_password = $_POST['password'];
	$su_name = mysql_real_escape_string(trim($_POST['username']));
	$su_email = mysql_real_escape_string(trim($_POST['email']));
	if (empty($su_account) || empty($su_password) || empty($su_name) || empty($su_email)) {
		API_Result(ISMPEMS_CODE_BAD_REQUEST, "Bad Request", "必填資料有錯誤");
	} else {
		$sql = sprintf("INSERT INTO `system_user`(`su_account`, `su_password`, `su_name`, `su_email`) VALUES ('%s', '%s', '%s', '%s')",
			$su_account,
			$su_password,
			$su_name,
			$su_email);
		$res = mysql_query($sql);
		if (mysql_affected_rows() > 0) {
			API_Result(ISMPEMS_CODE_OK, "OK", "新增系統用者成功");
		} else {
			API_Result(ISMPEMS_CODE_SERVER_ERROR, "Internal Error", "資料庫錯誤，請通知管理員", $sql);
		}
	}
	break;
// case 'init':
// 	$systemConfig = [
// 		"SERVER" => ISMPEMS_SERVER,
// 		"API" => ISMPEMS_SERVER_API,
// 		"DEBUG" => ISMPEMS_DEBUG_ENABLE,
// 		"ISMPEMS_CODE" => [
// 			"OK" => ISMPEMS_CODE_OK,
// 			"NO_CONTENT" => ISMPEMS_CODE_NO_CONTENT,
// 			"BAD_REQUEST" => ISMPEMS_CODE_BAD_REQUEST,
// 			"NOT_FOUND" => ISMPEMS_CODE_NOT_FOUND,
// 			"SERVER_ERROR" => ISMPEMS_CODE_SERVER_ERROR,
// 			"NO_API" => ISMPEMS_CODE_NO_API,
// 			"UNKNOWN_ERROR" => ISMPEMS_CODE_UNKNOWN_ERROR,
// 		],
// 	];
// 	API_Result(ISMPEMS_CODE_OK, "OK", "Return server config", $systemConfig);
// 	break;
default:
	// header('Location: ' . ISMPEMS_SERVER . "error-404-alt.html");
}
?>