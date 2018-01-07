/*
Navicat MySQL Data Transfer

Source Server         : mysql57
Source Server Version : 50717
Source Host           : 127.0.0.1:3306
Source Database       : oa

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-01-07 14:45:39
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for filelist
-- ----------------------------
DROP TABLE IF EXISTS `filelist`;
CREATE TABLE `filelist` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `filename` varchar(100) CHARACTER SET utf8 NOT NULL,
  `staff` varchar(40) CHARACTER SET utf8 NOT NULL,
  `status` int(10) NOT NULL,
  `statusTime` text CHARACTER SET utf8,
  `manager` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `managerTip` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `ceo` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `ceoTip` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of filelist
-- ----------------------------
INSERT INTO `filelist` VALUES ('50', 'jiyin.bao_第一次上传', '吉莹的文件.docx', 'jiyin.bao', '0', '[{\"status\":0,\"time\":\"2017-3-20 9:23\"},{\"status\":\"1\",\"time\":\"2017-3-22 14:3\"},{\"status\":\"20\",\"managerTip\":\"nopass\",\"time\":\"2017-03-22 16:57\"}]', 'hanhan', null, null, null);
INSERT INTO `filelist` VALUES ('51', 'jiyin包 second upload file', '234jiyin.bao34.doc', 'jiyin.bao', '0', '[{\"status\":0,\"time\":\"2017-3-20 9:23\"},{\"status\":\"1\",\"time\":\"2017-3-20 9:28\"},{\"status\":\"20\",\"managerTip\":\"234jiyin.bao34_不行，重写，place\",\"time\":\"2017-3-20 9:29\"}]', 'hanhan', null, null, null);
INSERT INTO `filelist` VALUES ('52', 'jinjin第一次upload', '34anyige.docx', 'jinjin', '50', '[{\"status\":0,\"time\":\"2017-3-20 9:24\"},{\"status\":\"1\",\"time\":\"2017-3-20 9:37\"},{\"status\":\"21\",\"managerTip\":\"jinjin_34anyige.docx——通过，递交给上姐\",\"time\":\"2017-3-20 9:38\"},{\"status\":\"30\",\"time\":\"2017-3-20 9:39\"},{\"status\":\"41\",\"ceoTip\":\"3434343now is ok\",\"time\":\"2017-3-20 9:46\"}]', 'xiaoyan', null, null, null);
INSERT INTO `filelist` VALUES ('53', 'second upload from静静', 'list参考文献part.docx', 'jinjin', '0', '[{\"status\":0,\"time\":\"2017-3-20 9:24\"},{\"status\":\"1\",\"time\":\"2017-3-20 9:37\"},{\"status\":\"20\",\"managerTip\":\"jinjinpart.docx_驳回\",\"time\":\"2017-3-20 9:38\"}]', 'xiaoyan', null, null, null);
INSERT INTO `filelist` VALUES ('54', 'thirdTry', '1311050220_包超杰_文献综述_zhji.doc', 'jinjin', '50', '[{\"status\":0,\"time\":\"2017-3-20 9:25\"},{\"status\":\"1\",\"time\":\"2017-3-20 9:37\"},{\"status\":\"21\",\"managerTip\":\"jinjin_包超杰_文献综述x——通过，递交给上级\",\"time\":\"2017-3-20 9:39\"},{\"status\":\"30\",\"time\":\"2017-3-20 9:49\"},{\"status\":\"40\",\"ceoTip\":\"butongguo_jinjin_baochaojie_文献综述ziji。doc\",\"time\":\"2017-3-20 9:50\"}]', 'xiaoyan', null, null, null);
INSERT INTO `filelist` VALUES ('55', 'I\'m 肖明', '文献综述（电子版）_3_12.doc', 'xiaoming', '50', '[{\"status\":0,\"time\":\"2017-3-20 9:25\"},{\"status\":\"1\",\"time\":\"2017-3-20 9:28\"},{\"status\":\"21\",\"managerTip\":\"xiaoming文献综述312_通过，递交给ceo\",\"time\":\"2017-3-20 9:36\"},{\"status\":\"30\",\"time\":\"2017-3-20 9:49\"},{\"status\":\"41\",\"ceoTip\":\"tongguo_xiaoming_文献综述（电子版）_3_12.docOKOKOK\",\"time\":\"2017-3-20 9:50\"}]', 'hanhan', null, null, null);
INSERT INTO `filelist` VALUES ('56', 'xiaoming的文件', '开题报告（电子版)_3_12.doc', 'xiaoming', '21', '[{\"status\":0,\"time\":\"2017-3-20 9:26\"},{\"status\":\"1\",\"time\":\"2017-3-22 13:56\"},{\"status\":\"21\",\"managerTip\":\"dsafdsa\",\"time\":\"2017-04-05 16:07\"}]', 'hanhan', null, null, null);
INSERT INTO `filelist` VALUES ('57', 'fileFromXiaoMing', '外文翻译（电子版）3_12.doc', 'xiaoming', '50', '[{\"status\":0,\"time\":\"2017-3-20 9:26\"},{\"status\":\"1\",\"time\":\"2017-3-20 9:36\"},{\"status\":\"21\",\"managerTip\":\"再次通过，肖明3_12外文翻译_通过，等待ceo处理\",\"time\":\"2017-3-20 9:37\"},{\"status\":\"30\",\"time\":\"2017-3-21 15:21\"},{\"status\":\"41\",\"ceoTip\":\"of扣分卡佛反馈\",\"time\":\"2017-3-21 15:22\"}]', 'hanhan', null, null, null);
INSERT INTO `filelist` VALUES ('58', 'chaojie第二次上传', '1311050220_包超杰_文献综述_zhji.doc', 'chaojie.bao', '0', '[{\"status\":0,\"time\":\"2017-3-20 9:27\"},{\"status\":\"1\",\"time\":\"2017-3-20 9:37\"},{\"status\":\"20\",\"managerTip\":\"fdsfsdf\",\"time\":\"2017-3-21 19:35\"}]', 'xiaoyan', null, null, null);
INSERT INTO `filelist` VALUES ('59', 'chaojie333333', '1311050220_包超杰_外文翻译_zhji.doc', 'chaojie.bao', '50', '[{\"status\":0,\"time\":\"2017-3-20 9:27\"},{\"status\":\"1\",\"time\":\"2017-3-20 9:52\"},{\"status\":\"21\",\"managerTip\":\"通过_slemple try chaojie.bao\",\"time\":\"2017-3-20 9:52\"},{\"status\":\"30\",\"time\":\"2017-3-20 11:20\"},{\"status\":\"41\",\"ceoTip\":\"dddddddddddddddddddddd\",\"time\":\"2017-3-20 11:20\"}]', 'xiaoyan', null, null, null);
INSERT INTO `filelist` VALUES ('60', 'fileFromChaoJie', '随便zaijianyige.docx', 'chaojie.bao', '50', '[{\"status\":0,\"time\":\"2017-3-20 9:28\"},{\"status\":\"1\",\"time\":\"2017-3-20 15:18\"},{\"status\":\"21\",\"managerTip\":\"bukeke\",\"time\":\"2017-3-20 15:18\"},{\"status\":\"30\",\"time\":\"2017-3-20 15:19\"},{\"status\":\"41\",\"ceoTip\":\"ffffffffff\",\"time\":\"2017-3-20 15:19\"}]', 'xiaoyan', null, null, null);
INSERT INTO `filelist` VALUES ('62', 'title666666', '7_a_document_process_association.docx', 'chaojie.bao', '50', '[{\"status\":0,\"time\":\"2017-3-20 15:18\"},{\"status\":\"1\",\"time\":\"2017-3-22 11:49\"},{\"status\":\"21\",\"managerTip\":\"ddddddddddddd\",\"time\":\"2017-3-22 13:45\"},{\"status\":\"30\",\"time\":\"2017-3-22 13:45\"},{\"status\":\"40\",\"time\":\"2017-03-23 13:34\"}]', 'xiaoyan', null, null, null);
INSERT INTO `filelist` VALUES ('63', '开题报告_newUpload', '开题报告（电子版）.doc', 'chaojie.bao', '50', '[{\"status\":0,\"time\":\"2017-3-21 9:33\"},{\"status\":\"1\",\"time\":\"2017-3-21 15:20\"},{\"status\":\"21\",\"managerTip\":\"passsss\",\"time\":\"2017-3-21 15:21\"},{\"status\":\"30\",\"time\":\"2017-3-21 15:22\"},{\"status\":\"40\",\"ceoTip\":\"of扣分卡佛反馈ffffffff\",\"time\":\"2017-3-21 15:22\"}]', 'xiaoyan', null, null, null);
INSERT INTO `filelist` VALUES ('64', 'tryAdd', '文献综述（电子版)_3_14_zhji.doc', 'chaojie.bao', '0', '[{\"status\":0,\"time\":\"2017-3-21 14:50\"},{\"status\":\"1\",\"time\":\"2017-3-21 15:20\"},{\"status\":\"20\",\"managerTip\":\"book\",\"time\":\"2017-3-21 15:21\"}]', 'xiaoyan', null, null, null);
INSERT INTO `filelist` VALUES ('70', 'tryAdd90', '看fdfd看上传了没.doc', 'chaojie.bao', '0', '[{\"status\":0,\"time\":\"2017-3-21 14:58\"},{\"status\":\"1\",\"time\":\"2017-3-21 15:20\"},{\"status\":\"20\",\"managerTip\":\"booktooooo\",\"time\":\"2017-3-21 15:21\"}]', 'xiaoyan', null, null, null);
INSERT INTO `filelist` VALUES ('71', 'tryAddddd', '吉莹的文件.docx', 'chaojie.bao', '50', '[{\"status\":0,\"time\":\"2017-3-21 14:59\"},{\"status\":\"1\",\"time\":\"2017-3-21 15:21\"},{\"status\":\"21\",\"managerTip\":\"passsssnoono\",\"time\":\"2017-3-21 15:21\"},{\"status\":\"30\",\"time\":\"2017-3-21 19:53\"},{\"status\":\"40\",\"time\":\"2017-3-22 13:35\"}]', 'xiaoyan', null, null, null);
INSERT INTO `filelist` VALUES ('72', '半身', '半身.doc', 'chaojie.bao', '50', '[{\"status\":0,\"time\":\"2017-3-21 15:15\"},{\"status\":\"1\",\"time\":\"2017-3-21 15:21\"},{\"status\":\"21\",\"managerTip\":\"通过——xiaoyan\",\"time\":\"2017-3-21 19:40\"},{\"status\":\"30\",\"time\":\"2017-3-21 19:54\"},{\"status\":\"40\",\"time\":\"2017-3-21 20:8\"}]', 'xiaoyan', null, null, null);
INSERT INTO `filelist` VALUES ('73', '燕池', '半身-燕池.doc', 'chaojie.bao', '0', '[{\"status\":0,\"time\":\"2017-3-21 15:20\"},{\"status\":\"1\",\"time\":\"2017-3-22 13:45\"}]', 'xiaoyan', null, null, null);
INSERT INTO `filelist` VALUES ('74', '完整流程测试', 'list参考文献part.docx', 'jiyin.bao', '50', '[{\"status\":0,\"time\":\"2017-3-22 14:4\"},{\"status\":\"1\",\"time\":\"2017-3-22 14:5\"},{\"status\":\"21\",\"managerTip\":\"通过流程未完成 测试_hanhan\",\"time\":\"2017-3-22 14:6\"},{\"status\":\"30\",\"time\":\"2017-3-22 14:7\"},{\"status\":\"40\",\"ceoTip\":\"bohui_liuchengcesi\",\"time\":\"2017-3-22 14:9\"}]', 'hanhan', null, null, null);
INSERT INTO `filelist` VALUES ('75', '小葵', '小葵yige.docx', '宫崎葵', '0', '[{\"status\":0,\"time\":\"2017-04-10 11:12\"}]', 'xiaoyan', null, null, null);

-- ----------------------------
-- Table structure for userinfo2
-- ----------------------------
DROP TABLE IF EXISTS `userinfo2`;
CREATE TABLE `userinfo2` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 NOT NULL,
  `position` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `rank` varchar(20) CHARACTER SET utf8 NOT NULL,
  `password` varchar(200) CHARACTER SET utf8 NOT NULL,
  `manager` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `dealpwd` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`,`name`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of userinfo2
-- ----------------------------
INSERT INTO `userinfo2` VALUES ('1', 'admin', 'hr', '0', 'e10adc3949ba59abbe56e057f20f883e', null, 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `userinfo2` VALUES ('2', 'chaojie.bao', 'web_engineer', '1', '827ccb0eea8a706c4c34a16891f84e7b', 'xiaoyan', null);
INSERT INTO `userinfo2` VALUES ('3', 'hanhan', 'UI_Designer', '2', '81dc9bdb52d04dc20036dbd8313ed055', 'mayuan', null);
INSERT INTO `userinfo2` VALUES ('4', 'jinjin', 'Hr', '1', '202cb962ac59075b964b07152d234b70', 'xiaoyan', null);
INSERT INTO `userinfo2` VALUES ('5', 'xiaoming', 'product_manager', '1', '202cb962ac59075b964b07152d234b70', 'hanhan', null);
INSERT INTO `userinfo2` VALUES ('7', 'xiaoyan', 'product_manager', '2', '81dc9bdb52d04dc20036dbd8313ed055', 'mayuan', null);
INSERT INTO `userinfo2` VALUES ('8', 'jiyin.bao', 'dataBase_engineer', '1', '202cb962ac59075b964b07152d234b70', 'hanhan', null);
INSERT INTO `userinfo2` VALUES ('9', '斯嘉丽', 'web_engineer', '1', 'e10adc3949ba59abbe56e057f20f883e', 'hanhan', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `userinfo2` VALUES ('11', 'cun', 'web_engineer', '1', 'e10adc3949ba59abbe56e057f20f883e', 'xiaoyan', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `userinfo2` VALUES ('12', '宫崎葵', 'UI_Designer', '1', 'e10adc3949ba59abbe56e057f20f883e', 'xiaoyan', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `userinfo2` VALUES ('13', 'mayun', 'general_manager', '3', 'e10adc3949ba59abbe56e057f20f883e', 'hanhan', 'e10adc3949ba59abbe56e057f20f883e');
