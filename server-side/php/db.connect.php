<?php
require_once "system.config.php";

$link = mysql_connect(SYSTEM_DB_HOST, SYSTEM_DB_USER, SYSTEM_DB_PWD);
mysql_select_db(SYSTEM_DB_NAME, $link);
mysql_query("SET NAMES 'utf8'");
mysql_query("SET CHARACTER SET utf8");
mysql_query("SET CHARACTER_SET_RESULTS=utf8");
