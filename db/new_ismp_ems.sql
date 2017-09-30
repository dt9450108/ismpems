-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- 主機: 127.0.0.1
-- 產生時間： 2017-09-30 17:19:05
-- 伺服器版本: 10.1.25-MariaDB
-- PHP 版本： 5.6.31

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `new_ismp_ems`
--
CREATE DATABASE IF NOT EXISTS `new_ismp_ems` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `new_ismp_ems`;

-- --------------------------------------------------------

--
-- 資料表結構 `device`
--
-- 建立時間: 2017-09-30 13:42:35
--

DROP TABLE IF EXISTS `device`;
CREATE TABLE `device` (
  `d_type` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '實驗室裝置類別',
  `d_num` int(4) UNSIGNED NOT NULL COMMENT '實驗室裝置編號',
  `d_real_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '裝置實際名稱',
  `d_location` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '裝置目前位置',
  `d_status` int(10) UNSIGNED NOT NULL COMMENT '裝置狀態',
  `d_ncku_property_num` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '學校財產編號',
  `d_ncku_num` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '學校財產校碼',
  `d_ncku_serial_num` int(10) DEFAULT NULL COMMENT '學校財產序號',
  `d_ncku_price_name` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '學校財產費別名',
  `d_brand` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '裝置品牌',
  `d_serial_num` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '裝置序號',
  `d_duration` int(3) UNSIGNED DEFAULT NULL COMMENT '使用年限',
  `d_buy_from` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '從哪購買',
  `d_buy_date` date DEFAULT NULL COMMENT '購買日期',
  `d_price` int(10) UNSIGNED DEFAULT NULL COMMENT '裝置價格',
  `d_spec` text COLLATE utf8mb4_unicode_ci COMMENT '裝置規格',
  `d_memo` text COLLATE utf8mb4_unicode_ci COMMENT '備註',
  `d_last_modified_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '資料最後修改日期時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 資料表的關聯 `device`:
--   `d_type`
--       `device_type` -> `dt_type`
--   `d_status`
--       `device_status` -> `ds_id`
--

-- --------------------------------------------------------

--
-- 資料表結構 `device_status`
--
-- 建立時間: 2017-09-30 13:42:35
--

DROP TABLE IF EXISTS `device_status`;
CREATE TABLE `device_status` (
  `ds_id` int(10) UNSIGNED NOT NULL COMMENT '裝置狀態編號',
  `ds_text` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '裝置狀態說明'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 資料表的關聯 `device_status`:
--

-- --------------------------------------------------------

--
-- 資料表結構 `device_type`
--
-- 建立時間: 2017-09-30 13:42:35
--

DROP TABLE IF EXISTS `device_type`;
CREATE TABLE `device_type` (
  `dt_type` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '類別種類',
  `dt_text` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '類別說明'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 資料表的關聯 `device_type`:
--

-- --------------------------------------------------------

--
-- 資料表結構 `lend_record`
--
-- 建立時間: 2017-09-30 13:42:35
--

DROP TABLE IF EXISTS `lend_record`;
CREATE TABLE `lend_record` (
  `lr_id` int(10) NOT NULL COMMENT '借用記錄id',
  `lr_fd_type` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '裝置種類',
  `lr_fd_num` int(4) UNSIGNED NOT NULL COMMENT '裝置編號',
  `lr_fm_id` int(10) UNSIGNED NOT NULL COMMENT '借用人',
  `lr_before_location` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '借出前裝置位置',
  `lr_lend_datetime` datetime NOT NULL COMMENT '借出日期時間',
  `lr_return_datetime` datetime DEFAULT NULL COMMENT '歸還日期時間',
  `lr_f_lend_handler` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '借出經手人',
  `lr_f_return_handler` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '歸還經手人',
  `lr_memo` text COLLATE utf8mb4_unicode_ci COMMENT '借用記錄備註',
  `lr_last_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '資料最後修改日期時間',
  `lr_create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立日期時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 資料表的關聯 `lend_record`:
--   `lr_fd_type`
--       `device` -> `d_type`
--   `lr_fd_num`
--       `device` -> `d_num`
--   `lr_fm_id`
--       `member` -> `m_id`
--   `lr_f_lend_handler`
--       `system_user` -> `su_account`
--   `lr_f_return_handler`
--       `system_user` -> `su_account`
--

-- --------------------------------------------------------

--
-- 資料表結構 `member`
--
-- 建立時間: 2017-09-30 13:42:35
--

DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `m_id` int(10) UNSIGNED NOT NULL COMMENT '成員id',
  `m_name` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '成員名稱',
  `m_email` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '成員電子信箱',
  `m_active` int(1) NOT NULL DEFAULT '1' COMMENT '借用人啟用狀態',
  `m_memo` text COLLATE utf8mb4_unicode_ci COMMENT '借用人備註'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 資料表的關聯 `member`:
--

-- --------------------------------------------------------

--
-- 資料表結構 `repair_record`
--
-- 建立時間: 2017-09-30 13:42:35
--

DROP TABLE IF EXISTS `repair_record`;
CREATE TABLE `repair_record` (
  `rr_id` int(10) NOT NULL COMMENT '維修記錄id',
  `rr_fd_type` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '裝置種類',
  `rr_fd_num` int(4) UNSIGNED NOT NULL COMMENT '裝置編號',
  `rr_repair_datetime` datetime NOT NULL COMMENT '裝置送修日期時間',
  `rr_return_datetime` datetime DEFAULT NULL COMMENT '裝置送回日期時間',
  `rr_f_repair_handler` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '送修經手人',
  `rr_f_return_handler` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '送回經手人',
  `rr_memo` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '維修備註'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 資料表的關聯 `repair_record`:
--   `rr_fd_num`
--       `device` -> `d_num`
--   `rr_fd_type`
--       `device` -> `d_type`
--   `rr_f_repair_handler`
--       `system_user` -> `su_account`
--   `rr_f_return_handler`
--       `system_user` -> `su_account`
--

-- --------------------------------------------------------

--
-- 資料表結構 `system_user`
--
-- 建立時間: 2017-09-30 13:42:35
--

DROP TABLE IF EXISTS `system_user`;
CREATE TABLE `system_user` (
  `su_account` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '系統使用者帳號',
  `su_password` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '系統使用者密碼',
  `su_auth` int(1) NOT NULL DEFAULT '1' COMMENT '權限0:設備長, 1:設備組員',
  `su_name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '系統使用者名稱',
  `su_email` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '系統使用者電子信箱',
  `su_last_login` datetime DEFAULT NULL COMMENT '最後登入時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 資料表的關聯 `system_user`:
--

--
-- 已匯出資料表的索引
--

--
-- 資料表索引 `device`
--
ALTER TABLE `device`
  ADD PRIMARY KEY (`d_num`,`d_type`),
  ADD KEY `d_status` (`d_status`),
  ADD KEY `d_type` (`d_type`);

--
-- 資料表索引 `device_status`
--
ALTER TABLE `device_status`
  ADD PRIMARY KEY (`ds_id`);

--
-- 資料表索引 `device_type`
--
ALTER TABLE `device_type`
  ADD PRIMARY KEY (`dt_type`);

--
-- 資料表索引 `lend_record`
--
ALTER TABLE `lend_record`
  ADD PRIMARY KEY (`lr_id`),
  ADD KEY `lr_fd_num` (`lr_fd_num`),
  ADD KEY `lend_record_ibfk_1` (`lr_fd_type`),
  ADD KEY `lr_fm_id` (`lr_fm_id`),
  ADD KEY `lr_f_lend_handler` (`lr_f_lend_handler`),
  ADD KEY `lr_f_return_handler` (`lr_f_return_handler`);

--
-- 資料表索引 `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`m_id`),
  ADD UNIQUE KEY `m_email` (`m_email`);

--
-- 資料表索引 `repair_record`
--
ALTER TABLE `repair_record`
  ADD PRIMARY KEY (`rr_id`),
  ADD KEY `rr_fd_num` (`rr_fd_num`),
  ADD KEY `rr_fd_type` (`rr_fd_type`),
  ADD KEY `rr_f_repair_handler` (`rr_f_repair_handler`),
  ADD KEY `rr_f_return_handler` (`rr_f_return_handler`);

--
-- 資料表索引 `system_user`
--
ALTER TABLE `system_user`
  ADD PRIMARY KEY (`su_account`);

--
-- 在匯出的資料表使用 AUTO_INCREMENT
--

--
-- 使用資料表 AUTO_INCREMENT `device_status`
--
ALTER TABLE `device_status`
  MODIFY `ds_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '裝置狀態編號', AUTO_INCREMENT=13;

--
-- 使用資料表 AUTO_INCREMENT `lend_record`
--
ALTER TABLE `lend_record`
  MODIFY `lr_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '借用記錄id', AUTO_INCREMENT=288;

--
-- 使用資料表 AUTO_INCREMENT `member`
--
ALTER TABLE `member`
  MODIFY `m_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '成員id', AUTO_INCREMENT=37;

--
-- 使用資料表 AUTO_INCREMENT `repair_record`
--
ALTER TABLE `repair_record`
  MODIFY `rr_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '維修記錄id';

--
-- 已匯出資料表的限制(Constraint)
--

--
-- 資料表的 Constraints `device`
--
ALTER TABLE `device`
  ADD CONSTRAINT `device_ibfk_2` FOREIGN KEY (`d_type`) REFERENCES `device_type` (`dt_type`) ON UPDATE CASCADE,
  ADD CONSTRAINT `device_ibfk_3` FOREIGN KEY (`d_status`) REFERENCES `device_status` (`ds_id`) ON UPDATE CASCADE;

--
-- 資料表的 Constraints `lend_record`
--
ALTER TABLE `lend_record`
  ADD CONSTRAINT `lend_record_ibfk_1` FOREIGN KEY (`lr_fd_type`) REFERENCES `device` (`d_type`) ON UPDATE CASCADE,
  ADD CONSTRAINT `lend_record_ibfk_2` FOREIGN KEY (`lr_fd_num`) REFERENCES `device` (`d_num`) ON UPDATE CASCADE,
  ADD CONSTRAINT `lend_record_ibfk_3` FOREIGN KEY (`lr_fm_id`) REFERENCES `member` (`m_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `lend_record_ibfk_4` FOREIGN KEY (`lr_f_lend_handler`) REFERENCES `system_user` (`su_account`) ON UPDATE CASCADE,
  ADD CONSTRAINT `lend_record_ibfk_5` FOREIGN KEY (`lr_f_return_handler`) REFERENCES `system_user` (`su_account`) ON UPDATE CASCADE;

--
-- 資料表的 Constraints `repair_record`
--
ALTER TABLE `repair_record`
  ADD CONSTRAINT `repair_record_ibfk_1` FOREIGN KEY (`rr_fd_num`) REFERENCES `device` (`d_num`) ON UPDATE CASCADE,
  ADD CONSTRAINT `repair_record_ibfk_2` FOREIGN KEY (`rr_fd_type`) REFERENCES `device` (`d_type`) ON UPDATE CASCADE,
  ADD CONSTRAINT `repair_record_ibfk_3` FOREIGN KEY (`rr_f_repair_handler`) REFERENCES `system_user` (`su_account`) ON UPDATE CASCADE,
  ADD CONSTRAINT `repair_record_ibfk_4` FOREIGN KEY (`rr_f_return_handler`) REFERENCES `system_user` (`su_account`) ON UPDATE CASCADE;


--
-- 詮釋資料
--
USE `phpmyadmin`;

--
-- 資料表 device 的 Metadata
--

--
-- 資料表新增前先清除舊資料 `pma__column_info`
--

TRUNCATE TABLE `pma__column_info`;
--
-- 資料表新增前先清除舊資料 `pma__table_uiprefs`
--

TRUNCATE TABLE `pma__table_uiprefs`;
--
-- 資料表的匯出資料 `pma__table_uiprefs`
--

INSERT INTO `pma__table_uiprefs` (`username`, `db_name`, `table_name`, `prefs`, `last_update`) VALUES
('root', 'new_ismp_ems', 'device', '{\"sorted_col\":\"`device`.`d_status` ASC\"}', '2017-09-11 09:26:49');

--
-- 資料表新增前先清除舊資料 `pma__tracking`
--

TRUNCATE TABLE `pma__tracking`;
--
-- 資料表 device_status 的 Metadata
--

--
-- 資料表新增前先清除舊資料 `pma__column_info`
--

TRUNCATE TABLE `pma__column_info`;
--
-- 資料表新增前先清除舊資料 `pma__table_uiprefs`
--

TRUNCATE TABLE `pma__table_uiprefs`;
--
-- 資料表新增前先清除舊資料 `pma__tracking`
--

TRUNCATE TABLE `pma__tracking`;
--
-- 資料表 device_type 的 Metadata
--

--
-- 資料表新增前先清除舊資料 `pma__column_info`
--

TRUNCATE TABLE `pma__column_info`;
--
-- 資料表新增前先清除舊資料 `pma__table_uiprefs`
--

TRUNCATE TABLE `pma__table_uiprefs`;
--
-- 資料表新增前先清除舊資料 `pma__tracking`
--

TRUNCATE TABLE `pma__tracking`;
--
-- 資料表 lend_record 的 Metadata
--

--
-- 資料表新增前先清除舊資料 `pma__column_info`
--

TRUNCATE TABLE `pma__column_info`;
--
-- 資料表新增前先清除舊資料 `pma__table_uiprefs`
--

TRUNCATE TABLE `pma__table_uiprefs`;
--
-- 資料表新增前先清除舊資料 `pma__tracking`
--

TRUNCATE TABLE `pma__tracking`;
--
-- 資料表 member 的 Metadata
--

--
-- 資料表新增前先清除舊資料 `pma__column_info`
--

TRUNCATE TABLE `pma__column_info`;
--
-- 資料表新增前先清除舊資料 `pma__table_uiprefs`
--

TRUNCATE TABLE `pma__table_uiprefs`;
--
-- 資料表新增前先清除舊資料 `pma__tracking`
--

TRUNCATE TABLE `pma__tracking`;
--
-- 資料表 repair_record 的 Metadata
--

--
-- 資料表新增前先清除舊資料 `pma__column_info`
--

TRUNCATE TABLE `pma__column_info`;
--
-- 資料表新增前先清除舊資料 `pma__table_uiprefs`
--

TRUNCATE TABLE `pma__table_uiprefs`;
--
-- 資料表新增前先清除舊資料 `pma__tracking`
--

TRUNCATE TABLE `pma__tracking`;
--
-- 資料表 system_user 的 Metadata
--

--
-- 資料表新增前先清除舊資料 `pma__column_info`
--

TRUNCATE TABLE `pma__column_info`;
--
-- 資料表新增前先清除舊資料 `pma__table_uiprefs`
--

TRUNCATE TABLE `pma__table_uiprefs`;
--
-- 資料表新增前先清除舊資料 `pma__tracking`
--

TRUNCATE TABLE `pma__tracking`;
--
-- 資料庫 new_ismp_ems 的 Metadata
--

--
-- 資料表新增前先清除舊資料 `pma__bookmark`
--

TRUNCATE TABLE `pma__bookmark`;
--
-- 資料表新增前先清除舊資料 `pma__relation`
--

TRUNCATE TABLE `pma__relation`;
--
-- 資料表新增前先清除舊資料 `pma__pdf_pages`
--

TRUNCATE TABLE `pma__pdf_pages`;
--
-- 資料表的匯出資料 `pma__pdf_pages`
--

INSERT INTO `pma__pdf_pages` (`db_name`, `page_descr`) VALUES
('new_ismp_ems', 'ismpemsimage');

SET @LAST_PAGE = LAST_INSERT_ID();

--
-- 資料表新增前先清除舊資料 `pma__table_coords`
--

TRUNCATE TABLE `pma__table_coords`;
--
-- 資料表的匯出資料 `pma__table_coords`
--

INSERT INTO `pma__table_coords` (`db_name`, `table_name`, `pdf_page_number`, `x`, `y`) VALUES
('new_ismp_ems', 'device', @LAST_PAGE, 317, 40),
('new_ismp_ems', 'device_status', @LAST_PAGE, 62, 42),
('new_ismp_ems', 'device_type', @LAST_PAGE, 62, 140),
('new_ismp_ems', 'lend_record', @LAST_PAGE, 608, 43),
('new_ismp_ems', 'member', @LAST_PAGE, 873, 43),
('new_ismp_ems', 'repair_record', @LAST_PAGE, 607, 274),
('new_ismp_ems', 'system_user', @LAST_PAGE, 873, 204);

--
-- 資料表新增前先清除舊資料 `pma__pdf_pages`
--

TRUNCATE TABLE `pma__pdf_pages`;
--
-- 資料表的匯出資料 `pma__pdf_pages`
--

INSERT INTO `pma__pdf_pages` (`db_name`, `page_descr`) VALUES
('new_ismp_ems', 'ismpemsimage');

SET @LAST_PAGE = LAST_INSERT_ID();

--
-- 資料表新增前先清除舊資料 `pma__table_coords`
--

TRUNCATE TABLE `pma__table_coords`;
--
-- 資料表的匯出資料 `pma__table_coords`
--

INSERT INTO `pma__table_coords` (`db_name`, `table_name`, `pdf_page_number`, `x`, `y`) VALUES
('new_ismp_ems', 'device', @LAST_PAGE, 317, 40),
('new_ismp_ems', 'device_status', @LAST_PAGE, 62, 42),
('new_ismp_ems', 'device_type', @LAST_PAGE, 62, 140),
('new_ismp_ems', 'lend_record', @LAST_PAGE, 608, 43),
('new_ismp_ems', 'member', @LAST_PAGE, 873, 43),
('new_ismp_ems', 'repair_record', @LAST_PAGE, 607, 274),
('new_ismp_ems', 'system_user', @LAST_PAGE, 873, 204);

--
-- 資料表新增前先清除舊資料 `pma__pdf_pages`
--

TRUNCATE TABLE `pma__pdf_pages`;
--
-- 資料表的匯出資料 `pma__pdf_pages`
--

INSERT INTO `pma__pdf_pages` (`db_name`, `page_descr`) VALUES
('new_ismp_ems', 'ismpemsimage');

SET @LAST_PAGE = LAST_INSERT_ID();

--
-- 資料表新增前先清除舊資料 `pma__table_coords`
--

TRUNCATE TABLE `pma__table_coords`;
--
-- 資料表的匯出資料 `pma__table_coords`
--

INSERT INTO `pma__table_coords` (`db_name`, `table_name`, `pdf_page_number`, `x`, `y`) VALUES
('new_ismp_ems', 'device', @LAST_PAGE, 317, 40),
('new_ismp_ems', 'device_status', @LAST_PAGE, 62, 42),
('new_ismp_ems', 'device_type', @LAST_PAGE, 62, 140),
('new_ismp_ems', 'lend_record', @LAST_PAGE, 608, 43),
('new_ismp_ems', 'member', @LAST_PAGE, 873, 43),
('new_ismp_ems', 'repair_record', @LAST_PAGE, 607, 274),
('new_ismp_ems', 'system_user', @LAST_PAGE, 873, 204);

--
-- 資料表新增前先清除舊資料 `pma__pdf_pages`
--

TRUNCATE TABLE `pma__pdf_pages`;
--
-- 資料表的匯出資料 `pma__pdf_pages`
--

INSERT INTO `pma__pdf_pages` (`db_name`, `page_descr`) VALUES
('new_ismp_ems', 'ismpemsimage');

SET @LAST_PAGE = LAST_INSERT_ID();

--
-- 資料表新增前先清除舊資料 `pma__table_coords`
--

TRUNCATE TABLE `pma__table_coords`;
--
-- 資料表的匯出資料 `pma__table_coords`
--

INSERT INTO `pma__table_coords` (`db_name`, `table_name`, `pdf_page_number`, `x`, `y`) VALUES
('new_ismp_ems', 'device', @LAST_PAGE, 317, 40),
('new_ismp_ems', 'device_status', @LAST_PAGE, 62, 42),
('new_ismp_ems', 'device_type', @LAST_PAGE, 62, 140),
('new_ismp_ems', 'lend_record', @LAST_PAGE, 608, 43),
('new_ismp_ems', 'member', @LAST_PAGE, 873, 43),
('new_ismp_ems', 'repair_record', @LAST_PAGE, 607, 274),
('new_ismp_ems', 'system_user', @LAST_PAGE, 873, 204);

--
-- 資料表新增前先清除舊資料 `pma__savedsearches`
--

TRUNCATE TABLE `pma__savedsearches`;
--
-- 資料表新增前先清除舊資料 `pma__central_columns`
--

TRUNCATE TABLE `pma__central_columns`;SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
