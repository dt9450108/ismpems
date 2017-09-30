<?php
ini_set('date.timezone', 'Asia/Taipei');
/**
 *     Login DB Connection Settings
 */
define("LOGIN_DB_HOST", "localhost");
define("LOGIN_DB_USER", "root");
define("LOGIN_DB_PWD", "");
define("LOGIN_DB_NAME", "new_ismp_ems");

/**
 *     System DB Connection Settings
 */
define("SYSTEM_DB_HOST", "localhost");
define("SYSTEM_DB_USER", "root");
define("SYSTEM_DB_PWD", "");
define("SYSTEM_DB_NAME", "new_ismp_ems");

/**
 *  Server Configs
 */
define("PROTOCOL", "http://");
// define("HOST", "192.168.0.100");
define("HOST", "127.0.0.1");
define("PORT", "80");
define("ROUTE", "/modular-admin-html-master/dist/");
define("ISMPEMS_SERVER", PROTOCOL . HOST . ":" . PORT . ROUTE);
define("ISMPEMS_SERVER_API", PROTOCOL . HOST . ":" . PORT . ROUTE . "php/");
define("ISMPEMS_DEBUG_ENABLE", true);

// Auth variables
define("ISMPEMS_ADMIN", 0);
define("ISMPEMS_USER", 1);

// The unit of time is second
define("SESSION_TIMEOUT", 3000);

// date and time format
define("DATE_FORMAT", "Y-m-d");
define("TIME_FORMAT", "H:i:s");
define("TIME_HM_FORMAT", "H:i");
define("DATETIME_FORMAT", DATE_FORMAT . " " . TIME_FORMAT);
define("PHOTO_DATETIME_FORMAT", "YmdHis");

// For API Result
define("ISMPEMS_CODE_OK", 200);
define("ISMPEMS_CODE_NO_CONTENT", 204);
define("ISMPEMS_CODE_NOT_MODIFIED", 304);
define("ISMPEMS_CODE_BAD_REQUEST", 400);
define("ISMPEMS_CODE_NOT_FOUND", 404);
define("ISMPEMS_CODE_SERVER_ERROR", 500);
define("ISMPEMS_CODE_NO_API", 501);
define("ISMPEMS_CODE_UNKNOWN_ERROR", 600);
