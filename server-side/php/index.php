<?php
// 設定檔
// =============================================================
require_once "system.config.php";
// 引用模組
// =============================================================
require_once "db.connect.php"; // MySQL連線資訊

// 變數定義
// 因為.htaccess的設定，有RewriteRule傳遞參數得到的router與action
// =============================================================
$Router = @$_GET['router']; // API選擇路徑
$Action = @$_GET['action']; // API動作

// 路徑決定
// ============================================================
switch ($Router) {
case 'device':
// 設備相關
	require_once "device.php";
	break;
case 'member':
// 借用人相關
	require_once "member.php";
	break;
case 'systemd':
// 系統相關
	require_once "systemd.php";
	break;
case 'login':
// 登入相關
	require_once "login.php";
	break;
case 'dashboard':
// dashboard相關
	require_once "dashboard.php";
	break;
default:
// 預設
	API_Result(ISMPEMS_CODE_NO_API, "Not Implemented", "No such API path.");
}

/**
 *  輸出API內容
 *	code 回傳狀態
 *  msg  狀態訊息
 *  array 資料
 */
function API_Result($code, $msg, $detail, $array = null) {
	$result = array("code" => $code,
		"msg" => $msg,
		"detail" => $detail,
		"data" => $array);
	echo json_encode($result, true);
}
?>