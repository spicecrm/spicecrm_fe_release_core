-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server Version:               5.6.21 - MySQL Community Server (GPL)
-- Server Betriebssystem:        Win32
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Exportiere Struktur von Tabelle spicecrm_dev.spicebeanguides
CREATE TABLE IF NOT EXISTS `spicebeanguides` (
  `id` varchar(36) NOT NULL,
  `module` varchar(50) DEFAULT NULL,
  `status_field` varchar(36) DEFAULT NULL,
  `build_language` text,
  KEY `idx_spicebeanguides_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle spicecrm_dev.spicebeanguides: ~6 rows (ungefähr)
DELETE FROM `spicebeanguides`;
/*!40000 ALTER TABLE `spicebeanguides` DISABLE KEYS */;
INSERT INTO `spicebeanguides` (`id`, `module`, `status_field`, `build_language`) VALUES
	('4accc09e-c953-4999-91b6-3d9175f4afa1', 'ServiceTickets', 'serviceticket_status', NULL),
	('7ab5d2a9-871e-428d-928d-02674298af37', 'Leads', 'status', NULL),
	('a3b2a07a-dd8e-4578-b567-140f4ecf2f31', 'Opportunities', 'sales_stage', 'modules/Opportunities/language/createFromGuide.php'),
	('bcc4f3a1-7fd5-449b-8d73-9871a9133d5d', 'Cases', 'status', NULL),
	('e539aac5-d6b3-4c88-b858-bd8fcb357a27', 'Tasks', 'status', NULL),
	('70457375-1D80-4321-9110-059DDB14C1D0', 'SystemDeploymentCRs', 'crstatus', NULL);
/*!40000 ALTER TABLE `spicebeanguides` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle spicecrm_dev.spicebeanguidestages
CREATE TABLE IF NOT EXISTS `spicebeanguidestages` (
  `id` varchar(36) NOT NULL,
  `spicebeanguide_id` varchar(36) DEFAULT NULL,
  `stage` varchar(36) DEFAULT NULL,
  `secondary_stage` varchar(36) DEFAULT NULL,
  `stage_sequence` int(11) DEFAULT NULL,
  `stage_color` varchar(6) DEFAULT NULL,
  `stage_add_data` text,
  KEY `idx_spicebeanguidestages_guideid` (`spicebeanguide_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle spicecrm_dev.spicebeanguidestages: ~27 rows (ungefähr)
DELETE FROM `spicebeanguidestages`;
/*!40000 ALTER TABLE `spicebeanguidestages` DISABLE KEYS */;
INSERT INTO `spicebeanguidestages` (`id`, `spicebeanguide_id`, `stage`, `secondary_stage`, `stage_sequence`, `stage_color`, `stage_add_data`) VALUES
	('11bf1756-90c5-494b-90cb-7f59a5adca56', 'e539aac5-d6b3-4c88-b858-bd8fcb357a27', 'Deferred', NULL, 4, NULL, NULL),
	('1308628e-bca6-49b8-ad60-5167149716b9', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', 'Analysis', NULL, 1, NULL, '{probability: 25}'),
	('213ae43d-4501-4356-8728-d35a1ab3be2b', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', 'Proposal', NULL, 3, NULL, '{probability: 60}'),
	('2bdd9ed5-d6a4-4722-a164-220ef88405ae', '7ab5d2a9-871e-428d-928d-02674298af37', 'In Process', NULL, 2, NULL, NULL),
	('30a7993c-1cd4-40dc-a4e6-772f34d53b6b', '7ab5d2a9-871e-428d-928d-02674298af37', 'closed', 'dead', 4, NULL, NULL),
	('30e916d7-9b5d-45a1-b44c-20f37079544c', '7ab5d2a9-871e-428d-928d-02674298af37', 'Assigned', NULL, 1, NULL, NULL),
	('35807c0e-2b71-4f83-a9c9-4b079e284668', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', 'Negotiation', NULL, 4, NULL, '{probability: 85}'),
	('3632b913-b92f-49f9-b970-9f69d9d95fc3', 'bcc4f3a1-7fd5-449b-8d73-9871a9133d5d', 'New', NULL, 0, NULL, NULL),
	('383f8d0e-ade0-4fe7-a66f-3a5c9235596e', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', 'Qualification', NULL, 0, NULL, '{probability: 10}'),
	('3d80408b-8dd2-4eb5-8fac-c95924b6c4cc', 'bcc4f3a1-7fd5-449b-8d73-9871a9133d5d', 'Pending Input', NULL, 2, NULL, NULL),
	('40ad35bb-354f-4b9d-a644-30ebcceefbcd', 'bcc4f3a1-7fd5-449b-8d73-9871a9133d5d', 'Closed', NULL, 3, NULL, NULL),
	('44fa9544-b3a8-4a19-9df8-177ec239f56c', 'e539aac5-d6b3-4c88-b858-bd8fcb357a27', 'In Progress', NULL, 1, NULL, NULL),
	('50d2480b-b961-4800-9a2d-8aa1d422b05e', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', 'Proposition', NULL, 2, NULL, '{probability: 45}'),
	('542cc960-a8b0-4dc6-96bf-10a0535ed420', '4accc09e-c953-4999-91b6-3d9175f4afa1', 'Pending Input', NULL, 2, NULL, NULL),
	('646d8cde-03aa-4688-abb8-51bb74d55c2e', 'e539aac5-d6b3-4c88-b858-bd8fcb357a27', 'Completed', NULL, 3, NULL, NULL),
	('66e492a9-ce06-4749-b4c0-12e97cb15dbf', 'e539aac5-d6b3-4c88-b858-bd8fcb357a27', 'Pending Input', NULL, 2, NULL, NULL),
	('7348c94b-94a2-4a95-93ea-f42776454dc2', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', 'Closed', 'Discontinued', 7, NULL, '{probability: 0}'),
	('7593eb1e-9dcc-4f7c-9d45-3b7af525f267', '4accc09e-c953-4999-91b6-3d9175f4afa1', 'Assigned', NULL, 1, NULL, NULL),
	('7d76759e-d078-4bae-a93b-948517ad322c', '4accc09e-c953-4999-91b6-3d9175f4afa1', 'Closed', NULL, 3, NULL, NULL),
	('8837a4eb-ae6d-4d1b-89a4-32daba0ae155', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', 'Closed', 'Lost', 6, NULL, '{probability: 0}'),
	('96a8f932-d158-4e8d-8bfe-b1d436d4f855', '7ab5d2a9-871e-428d-928d-02674298af37', 'New', NULL, 0, NULL, NULL),
	('96acb7aa-d1b9-47ef-b109-168275b5b4cf', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', 'Closed', 'Won', 5, NULL, '{probability: 100}'),
	('e23afa03-645d-4666-87a0-17f32780ed92', '4accc09e-c953-4999-91b6-3d9175f4afa1', 'New', NULL, 0, NULL, NULL),
	('e3f7f97f-eb75-4c8d-89e5-58d0240fb2e9', '7ab5d2a9-871e-428d-928d-02674298af37', 'closed', 'converted', 3, NULL, NULL),
	('f2bd43b5-d671-415e-a992-02c48c8fa1e9', 'e539aac5-d6b3-4c88-b858-bd8fcb357a27', 'Not Started', NULL, 0, NULL, NULL),
	('f93f179c-3fd9-489f-af13-c747ea4d8bb1', '7ab5d2a9-871e-428d-928d-02674298af37', 'Recycled', NULL, 5, NULL, NULL),
	('ffa0313b-7f11-4dd7-87b5-0e9e1c066edd', 'bcc4f3a1-7fd5-449b-8d73-9871a9133d5d', 'Assigned', NULL, 1, NULL, NULL),
	('23E4F1BC-79AC-4BA7-8A60-2FFADAA67CD0', '70457375-1D80-4321-9110-059DDB14C1D0', '0', NULL, 0, NULL, NULL),
	('8EE44694-D00C-4909-B5D2-F61F08712172', '70457375-1D80-4321-9110-059DDB14C1D0', '1', NULL, 1, NULL, NULL),
	('BABBE0EB-F684-4D68-BDF7-5F8076C24D34', '70457375-1D80-4321-9110-059DDB14C1D0', '2', NULL, 2, NULL, NULL);
/*!40000 ALTER TABLE `spicebeanguidestages` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle spicecrm_dev.spicebeanguidestages_checks
CREATE TABLE IF NOT EXISTS `spicebeanguidestages_checks` (
  `id` varchar(36) NOT NULL,
  `spicebeanguide_id` varchar(36) DEFAULT NULL,
  `stage_id` varchar(36) DEFAULT NULL,
  `check_sequence` int(11) DEFAULT NULL,
  `check_include` varchar(150) DEFAULT NULL,
  `check_class` varchar(80) DEFAULT NULL,
  `check_method` varchar(80) DEFAULT NULL,
  KEY `idx_spicebeanguidestageschecks_stageid` (`stage_id`),
  KEY `idx_spicebeanguidestageschecks_guideid` (`spicebeanguide_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle spicecrm_dev.spicebeanguidestages_checks: ~9 rows (ungefähr)
DELETE FROM `spicebeanguidestages_checks`;
/*!40000 ALTER TABLE `spicebeanguidestages_checks` DISABLE KEYS */;
INSERT INTO `spicebeanguidestages_checks` (`id`, `spicebeanguide_id`, `stage_id`, `check_sequence`, `check_include`, `check_class`, `check_method`) VALUES
	('280116e3-a7ff-4d6d-bd42-264d6b76a96c', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', '383f8d0e-ade0-4fe7-a66f-3a5c9235596e', 0, 'modules/Opportunities/guideChecks/guideChecks.php', 'standardOpportunityGuideChecks', 'qualification_activitiy'),
	('a3a85844-bf7e-4a0b-9232-78fb817c0078', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', '1308628e-bca6-49b8-ad60-5167149716b9', 0, 'modules/Opportunities/guideChecks/guideChecks.php', 'standardOpportunityGuideChecks', 'analysis_activitiy'),
	('f76c14ee-575d-4e9a-8924-24588a3073fa', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', '383f8d0e-ade0-4fe7-a66f-3a5c9235596e', 1, 'modules/Opportunities/guideChecks/guideChecks.php', 'standardOpportunityGuideChecks', 'qualification_projectmanager'),
	('86f42329-f05f-48fe-8518-d75e420e340b', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', '1308628e-bca6-49b8-ad60-5167149716b9', 1, 'modules/Opportunities/guideChecks/guideChecks.php', 'standardOpportunityGuideChecks', 'analysis_businessevaluator'),
	('8e6cc54c-49d3-4d48-ab20-e742d09ea886', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', '1308628e-bca6-49b8-ad60-5167149716b9', 2, 'modules/Opportunities/guideChecks/guideChecks.php', 'standardOpportunityGuideChecks', 'analysis_budgetidentified'),
	('6f1ac153-16aa-457a-ae1f-e80e715374bb', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', '50d2480b-b961-4800-9a2d-8aa1d422b05e', 0, 'modules/Opportunities/guideChecks/guideChecks.php', 'standardOpportunityGuideChecks', 'vprop_valueproposition'),
	('cb0091f8-9d18-44a4-91e0-f455eeb05bf3', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', '50d2480b-b961-4800-9a2d-8aa1d422b05e', 2, 'modules/Opportunities/guideChecks/guideChecks.php', 'standardOpportunityGuideChecks', 'vprop_businessdecisionmaker'),
	('659fc324-52b3-4e80-998b-f550e0e3b5ac', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', '383f8d0e-ade0-4fe7-a66f-3a5c9235596e', 0, 'modules/Opportunities/guideChecks/guideChecks.php', 'standardOpportunityGuideChecks', 'qualification_businessneeds'),
	('94344f8c-d3d6-48e9-a018-c6b08c200121', 'a3b2a07a-dd8e-4578-b567-140f4ecf2f31', '1308628e-bca6-49b8-ad60-5167149716b9', 2, 'modules/Opportunities/guideChecks/guideChecks.php', 'standardOpportunityGuideChecks', 'qualification_businesspainpoints');
/*!40000 ALTER TABLE `spicebeanguidestages_checks` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle spicecrm_dev.spicebeanguidestages_check_texts
CREATE TABLE IF NOT EXISTS `spicebeanguidestages_check_texts` (
  `id` varchar(36) NOT NULL,
  `stage_check_id` varchar(36) DEFAULT NULL,
  `language` varchar(5) DEFAULT NULL,
  `text` varchar(50) DEFAULT NULL,
  KEY `idx_spicebeanguidestageschecktexts_stagecheckid` (`stage_check_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle spicecrm_dev.spicebeanguidestages_check_texts: ~18 rows (ungefähr)
DELETE FROM `spicebeanguidestages_check_texts`;
/*!40000 ALTER TABLE `spicebeanguidestages_check_texts` DISABLE KEYS */;
INSERT INTO `spicebeanguidestages_check_texts` (`id`, `stage_check_id`, `language`, `text`) VALUES
	('f02f58d3-a75e-43cf-a146-ea37821da6fd', '280116e3-a7ff-4d6d-bd42-264d6b76a96c', 'en_us', 'one closed call or meeting'),
	('d908cc42-a9e1-4bfd-b850-bf6034c2b34d', 'a3a85844-bf7e-4a0b-9232-78fb817c0078', 'en_us', 'one closed meeting'),
	('bea2cf84-7467-4771-b29d-375943075d9c', 'f76c14ee-575d-4e9a-8924-24588a3073fa', 'en_us', 'Projectmanager identified'),
	('f8b12630-7350-4b7d-9189-0caf4abce739', '86f42329-f05f-48fe-8518-d75e420e340b', 'en_us', 'Business Evaluator identified'),
	('105b6f0d-71bc-4a2a-b0b3-87750e56322d', '8e6cc54c-49d3-4d48-ab20-e742d09ea886', 'en_us', 'Budget identified'),
	('7a62ca37-8c68-4f54-892c-4ddf25596a87', '6f1ac153-16aa-457a-ae1f-e80e715374bb', 'en_us', 'Value Proposition defined'),
	('54998ec2-2170-490c-99e9-5610d3076c45', 'cb0091f8-9d18-44a4-91e0-f455eeb05bf3', 'en_us', 'Business Decision Maker identified'),
	('1157d0b3-57e8-4af6-b50e-90998bb302c9', '659fc324-52b3-4e80-998b-f550e0e3b5ac', 'en_us', 'Business Need identified'),
	('f789ae1f-27a4-4268-a39d-f4c597744eb2', '94344f8c-d3d6-48e9-a018-c6b08c200121', 'en_us', 'Business Painpoint identified'),
	('7a18ebbc-93c8-11e7-afce-54ee7543b1f7', '280116e3-a7ff-4d6d-bd42-264d6b76a96c', 'de_DE', 'ein abgeschlossenses Telefonat oder Besuch'),
	('7a1aeddf-93c8-11e7-afce-54ee7543b1f7', 'a3a85844-bf7e-4a0b-9232-78fb817c0078', 'de_DE', 'ein abgeschlossener Besuch'),
	('7a1c250f-93c8-11e7-afce-54ee7543b1f7', 'f76c14ee-575d-4e9a-8924-24588a3073fa', 'de_DE', 'Projektmanager festgelegt'),
	('7a1dace5-93c8-11e7-afce-54ee7543b1f7', '86f42329-f05f-48fe-8518-d75e420e340b', 'de_DE', 'Business Entscheider festgelegt'),
	('7a1f8b00-93c8-11e7-afce-54ee7543b1f7', '8e6cc54c-49d3-4d48-ab20-e742d09ea886', 'de_DE', 'Budget definiert'),
	('7a211b7e-93c8-11e7-afce-54ee7543b1f7', '6f1ac153-16aa-457a-ae1f-e80e715374bb', 'de_DE', 'Value Proposition definiert'),
	('7a22a7fe-93c8-11e7-afce-54ee7543b1f7', 'cb0091f8-9d18-44a4-91e0-f455eeb05bf3', 'de_DE', 'Business entscheider festgelegt'),
	('7a23f849-93c8-11e7-afce-54ee7543b1f7', '659fc324-52b3-4e80-998b-f550e0e3b5ac', 'de_DE', 'Business Need definiert'),
	('7a2593bc-93c8-11e7-afce-54ee7543b1f7', '94344f8c-d3d6-48e9-a018-c6b08c200121', 'de_DE', 'Business Painpoint definiert');
/*!40000 ALTER TABLE `spicebeanguidestages_check_texts` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle spicecrm_dev.spicebeanguidestages_texts
CREATE TABLE IF NOT EXISTS `spicebeanguidestages_texts` (
  `id` varchar(36) NOT NULL,
  `stage_id` varchar(36) DEFAULT NULL,
  `language` varchar(5) DEFAULT NULL,
  `stage_name` varchar(25) DEFAULT NULL,
  `stage_secondaryname` varchar(25) DEFAULT NULL,
  `stage_description` text,
  KEY `idx_spicebeanguidestagestexts_stageid` (`stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle spicecrm_dev.spicebeanguidestages_texts: ~58 rows (ungefähr)
DELETE FROM `spicebeanguidestages_texts`;
/*!40000 ALTER TABLE `spicebeanguidestages_texts` DISABLE KEYS */;
INSERT INTO `spicebeanguidestages_texts` (`id`, `stage_id`, `language`, `stage_name`, `stage_secondaryname`, `stage_description`) VALUES
	('1b566ef6-468c-4eb4-9bf7-47b9441d8a9a', '11bf1756-90c5-494b-90cb-7f59a5adca56', 'en_us', 'Deferred', NULL, NULL),
	('1E425522-752D-44A5-AA0D-9631CEE80975', '7d76759e-d078-4bae-a93b-948517ad322c', 'de_DE', 'Abgeschlossen', NULL, NULL),
	('2D0B969D-2A77-4E91-915B-3BF9DA153D46', 'ffa0313b-7f11-4dd7-87b5-0e9e1c066edd', 'de_DE', 'Zugewiesen', NULL, NULL),
	('304A483A-2657-40B9-B5FD-AF93715B86F5', '7593eb1e-9dcc-4f7c-9d45-3b7af525f267', 'en_us', 'Assigned', NULL, NULL),
	('353e1796-e084-4106-9597-aec11960fc63', '213ae43d-4501-4356-8728-d35a1ab3be2b', 'en_us', 'Proposal', NULL, '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Proposal</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nIn this Phase you take your Value Proposition and formulate it into a commercial proposal to put towards the customer. In case you have different options formulate multiple Proposals as alternatives. You should also understand and define the upsides and downsides for the opportunity since those are important facts for the forecasting. Latest at this stage you should identify the Primary Decision Maker in the company for the purchase.\r\n<br><br>\r\nIn this phase you should: \r\n<br><br>\r\n<li>Attach at least one Proposal to the Opportunity\r\n<li>Identified the primary decision maker\r\n<li>Set the upside and downsides (best case, worst case for the opportunity) based on the proposals and potential alternatives\r\n<div>'),
	('35C1D78D-2A97-41DD-948A-31F5C22636FE', '542cc960-a8b0-4dc6-96bf-10a0535ed420', 'de_DE', 'Rückmeldung ausstehend', NULL, NULL),
	('3D52F0B4-6C04-48C6-9F67-CAEFB61A6547', '7d76759e-d078-4bae-a93b-948517ad322c', 'en_us', 'Closed', NULL, NULL),
	('3DCA9B49-1D6F-438A-A3BF-C8120458CA76', '3632b913-b92f-49f9-b970-9f69d9d95fc3', 'de_DE', 'Neu', NULL, NULL),
	('3ef4be58-a5bf-47d0-bdc7-e14eec15d72c', '383f8d0e-ade0-4fe7-a66f-3a5c9235596e', 'en_us', 'Qualification', NULL, '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Qualification</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nQualification is the initial step in an opportunity. In the qualification phase the account team needs to get basic insight into the opportunity. First steps are to contact the customer, identifying the project manager and potential other key players . The account Team should gather the Business Needs the customer has and also the Pain Points that are currently driving the customer.\r\n<br><br>\r\nIn this phase you should:\r\n<br><br>\r\n<li>Identify the Project Manager on Customer side\r\n<li>Have at least one closed activity (Call or Meeting) with the customer\r\n<li>Define the Business Needs of the customer\r\n</div>'),
	('4195663e-1457-46c0-a55f-7b41f1d066fb', '66e492a9-ce06-4749-b4c0-12e97cb15dbf', 'en_us', 'Pending Input', NULL, NULL),
	('43e60791-aabd-45fd-97c7-7ea234042e89', '96a8f932-d158-4e8d-8bfe-b1d436d4f855', 'en_us', 'New', NULL, '<h2>New</h2>\r\n<br>\r\nfor new Leads assign the proper user or team for the Lead Qualification\r\n<br><br>\r\nTo close the phase you should: \r\n<br><br>\r\n<li>assign a user for the lead qualification'),
	('465aac18-342e-44fe-a12a-4c2fa9648bc7', '8837a4eb-ae6d-4d1b-89a4-32daba0ae155', 'en_us', 'Closed', '(lost)', '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Closed Lost</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nYou did not win the business but one of your competitors did document the loss reason. \r\n<br><br>\r\nIn this phase you should: \r\n<br><br>\r\n<li>Define the reason why you lost the business\r\n<li>Add a short explanation on the loss reason\r\n</div>'),
	('53FD77E0-F27B-4AEA-A3D7-1575DCCD5586', '3632b913-b92f-49f9-b970-9f69d9d95fc3', 'en_us', 'New', NULL, NULL),
	('609e126f-6e2e-4d33-8563-ab318283c7d7', '50d2480b-b961-4800-9a2d-8aa1d422b05e', 'en_us', 'Value Proposition', NULL, '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Value Proposition</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nThe main goal here is the definition of the Value Proposition to the customer. Define the Solution proposal you want to position towards the customer as well as the value proposition to the customer tied to the solution.  In the competitive analysis complete the analysis and define the main competitive differentiators compared to your competitor’s solutions. Also identify the threats from other competitors. Latest at this point you also need to identify the business decision maker.\r\n<br><br>\r\nIn this phase you should: \r\n<br><br>\r\n<li>Define the Solution Proposal as well as Value Proposition \r\n<li>Identified the business decision maker\r\n<li>Complete the competitive analysis for each of your competitors\r\n</div>'),
	('67B1B401-1F3D-4E56-9C98-8F0BC67FEC49', '40ad35bb-354f-4b9d-a644-30ebcceefbcd', 'en_us', 'Closed', NULL, NULL),
	('75791C49-FBF4-46A8-B95D-9161144876E5', '542cc960-a8b0-4dc6-96bf-10a0535ed420', 'en_us', 'Pending Input', NULL, NULL),
	('7655B609-5065-4D51-AE59-1A3722804697', '3d80408b-8dd2-4eb5-8fac-c95924b6c4cc', 'de_DE', 'Erwarte Rückmeldung', NULL, NULL),
	('775606db-17d8-448b-98ab-551946200f30', 'e3f7f97f-eb75-4c8d-89e5-58d0240fb2e9', 'en_us', 'Closed', '(converted)', NULL),
	('7a273394-93c8-11e7-afce-54ee7543b1f7', '383f8d0e-ade0-4fe7-a66f-3a5c9235596e', 'de_DE', 'Qualifikation', NULL, '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Qualification</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nQualification is the initial step in an opportunity. In the qualification phase the account team needs to get basic insight into the opportunity. First steps are to contact the customer, identifying the project manager and potential other key players . The account Team should gather the Business Needs the customer has and also the Pain Points that are currently driving the customer.\r\n<br><br>\r\nIn this phase you should:\r\n<br><br>\r\n<li>Identify the Project Manager on Customer side\r\n<li>Have at least one closed activity (Call or Meeting) with the customer\r\n<li>Define the Business Needs of the customer\r\n</div>'),
	('7a28fb5d-93c8-11e7-afce-54ee7543b1f7', '1308628e-bca6-49b8-ad60-5167149716b9', 'de_DE', 'Analyse', NULL, '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Analysis</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nIn the Analysis Phase the goal is to define the Solution Proposal that will be put towards the customer. You should also assess the competitive landscape and define your top three competitors in this opportunity. In terms of the buying center at the customer the business evaluator. Understand the pain points and thus main drivers for the Purchasing process. You will need the business needs and pain points to formulate the value proposition.\r\n<br><br>\r\nIn this phase you should:\r\n<br><br>\r\n<li>Have at least one meeting closed with the customer\r\n<li>Define the Pain Points the customer want to address \r\n<li>Identified the business evaluator\r\n<li>Have at least one competitor identified\r\n<li>Set the customers budget\r\n</div>'),
	('7a2b013a-93c8-11e7-afce-54ee7543b1f7', '50d2480b-b961-4800-9a2d-8aa1d422b05e', 'de_DE', 'Value Proposition', NULL, '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Value Proposition</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nThe main goal here is the definition of the Value Proposition to the customer. Define the Solution proposal you want to position towards the customer as well as the value proposition to the customer tied to the solution.  In the competitive analysis complete the analysis and define the main competitive differentiators compared to your competitor’s solutions. Also identify the threats from other competitors. Latest at this point you also need to identify the business decision maker.\r\n<br><br>\r\nIn this phase you should: \r\n<br><br>\r\n<li>Define the Solution Proposal as well as Value Proposition \r\n<li>Identified the business decision maker\r\n<li>Complete the competitive analysis for each of your competitors\r\n</div>'),
	('7a2cd7b7-93c8-11e7-afce-54ee7543b1f7', '213ae43d-4501-4356-8728-d35a1ab3be2b', 'de_DE', 'Angebot', NULL, '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Proposal</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nIn this Phase you take your Value Proposition and formulate it into a commercial proposal to put towards the customer. In case you have different options formulate multiple Proposals as alternatives. You should also understand and define the upsides and downsides for the opportunity since those are important facts for the forecasting. Latest at this stage you should identify the Primary Decision Maker in the company for the purchase.\r\n<br><br>\r\nIn this phase you should: \r\n<br><br>\r\n<li>Attach at least one Proposal to the Opportunity\r\n<li>Identified the primary decision maker\r\n<li>Set the upside and downsides (best case, worst case for the opportunity) based on the proposals and potential alternatives\r\n<div>'),
	('7a2e8191-93c8-11e7-afce-54ee7543b1f7', '35807c0e-2b71-4f83-a9c9-4b079e284668', 'de_DE', 'Verhandlung', NULL, '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Negotiation</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nIn the final phase of the sales cycle you are negotiating the details of one proposal with the customer. Decide which is the final and last proposal that you are negotiating. Define the Plan to Closure for the opportunity.\r\n<br><br>\r\nIn this phase you should: \r\n<br><br>\r\n<li>Narrow the list of proposals down to one active proposal\r\n<li>Define the Plan to Closure\r\n</div>'),
	('7a303176-93c8-11e7-afce-54ee7543b1f7', '96acb7aa-d1b9-47ef-b109-168275b5b4cf', 'de_DE', 'Closed', '(won)', '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Closed Won</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nCongratulation. You did win the business\r\n</div>'),
	('7a3203bd-93c8-11e7-afce-54ee7543b1f7', '8837a4eb-ae6d-4d1b-89a4-32daba0ae155', 'de_DE', 'Closed', '(lost)', '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Closed Lost</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nYou did not win the business but one of your competitors did document the loss reason. \r\n<br><br>\r\nIn this phase you should: \r\n<br><br>\r\n<li>Define the reason why you lost the business\r\n<li>Add a short explanation on the loss reason\r\n</div>'),
	('7a338caa-93c8-11e7-afce-54ee7543b1f7', '7348c94b-94a2-4a95-93ea-f42776454dc2', 'de_DE', 'Closed', '(discontinued)', '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Closed Discontinued</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nYouyou did not close the business because the customer die not purchase any solution you should also document the loss reason and also provide a short explanation to the loss reason.\r\n<br><br>\r\nIn this phase you should: \r\n<br><br>\r\n<li>Define the reason why you lost the business\r\n<li>Add a short explanation on the loss reason\r\n</div>'),
	('7a356351-93c8-11e7-afce-54ee7543b1f7', '96a8f932-d158-4e8d-8bfe-b1d436d4f855', 'de_DE', 'Neu', NULL, '<h2>New</h2>\r\n<br>\r\nfor new Leads assign the proper user or team for the Lead Qualification\r\n<br><br>\r\nTo close the phase you should: \r\n<br><br>\r\n<li>assign a user for the lead qualification'),
	('7a373d1d-93c8-11e7-afce-54ee7543b1f7', '30e916d7-9b5d-45a1-b44c-20f37079544c', 'de_DE', 'zugeweisen', NULL, '<h2>Assigned</h2>\r\n<br>\r\nfor assigned leads verify the contacts data and create at lease one activitiy for the Lead (Task or Call)\r\n<br><br>\r\nTo close the phase you should: \r\n<br><br>\r\n<li>verify the contact details\r\n<li>add one activitiy (Task or Call) for the Lead'),
	('7a38f049-93c8-11e7-afce-54ee7543b1f7', '2bdd9ed5-d6a4-4722-a164-220ef88405ae', 'de_DE', 'in Arbeit', NULL, '<h2>in Process</h2>\r\n<br>\r\nto qualify a lead you shoudl assess that the customer has set up a project, has a budget allocated and has set a decision timeframe. \r\n<br><br>\r\nTo close the phase you should: \r\n<br><br>\r\n<li>add a description with a short summary on the Lead and the customers interest\r\n<li>have at least one closed activitiy \r\n<li>verify that the customer has a budget allocated\r\n<li>verify that the customer has aproject manager allocated driving the process\r\n<li>set the decision timeframe for the customer\r\n<li>define the solution match defining how our offering matches the customers needs'),
	('7a3ad30d-93c8-11e7-afce-54ee7543b1f7', 'e3f7f97f-eb75-4c8d-89e5-58d0240fb2e9', 'de_DE', 'Closed', '(converted)', NULL),
	('7a3cbfd6-93c8-11e7-afce-54ee7543b1f7', '30a7993c-1cd4-40dc-a4e6-772f34d53b6b', 'de_DE', 'Closed', '(dead)', NULL),
	('7a3eca21-93c8-11e7-afce-54ee7543b1f7', 'f93f179c-3fd9-489f-af13-c747ea4d8bb1', 'de_DE', 'Wiederverwertet', NULL, NULL),
	('7a4064dc-93c8-11e7-afce-54ee7543b1f7', 'f2bd43b5-d671-415e-a992-02c48c8fa1e9', 'de_DE', 'nicht Begonnen', NULL, NULL),
	('7a42ac8f-93c8-11e7-afce-54ee7543b1f7', '44fa9544-b3a8-4a19-9df8-177ec239f56c', 'de_DE', 'In Arbeit', NULL, NULL),
	('7a4495e8-93c8-11e7-afce-54ee7543b1f7', '66e492a9-ce06-4749-b4c0-12e97cb15dbf', 'de_DE', 'warte auf Rückmeldung', NULL, NULL),
	('7a464272-93c8-11e7-afce-54ee7543b1f7', '646d8cde-03aa-4688-abb8-51bb74d55c2e', 'de_DE', 'abgeschlossen', NULL, NULL),
	('7a47da12-93c8-11e7-afce-54ee7543b1f7', '11bf1756-90c5-494b-90cb-7f59a5adca56', 'de_DE', 'verschoben', NULL, NULL),
	('7cce2faa-00cb-43fe-ba2d-7745a46ce896', '2bdd9ed5-d6a4-4722-a164-220ef88405ae', 'en_us', 'in Process', NULL, '<h2>in Process</h2>\r\n<br>\r\nto qualify a lead you shoudl assess that the customer has set up a project, has a budget allocated and has set a decision timeframe. \r\n<br><br>\r\nTo close the phase you should: \r\n<br><br>\r\n<li>add a description with a short summary on the Lead and the customers interest\r\n<li>have at least one closed activitiy \r\n<li>verify that the customer has a budget allocated\r\n<li>verify that the customer has aproject manager allocated driving the process\r\n<li>set the decision timeframe for the customer\r\n<li>define the solution match defining how our offering matches the customers needs'),
	('8261cc64-70ca-4995-931f-39eee67b4ad8', 'f93f179c-3fd9-489f-af13-c747ea4d8bb1', 'en_us', 'Recycled', NULL, NULL),
	('885B6B8D-B8A3-41B2-BCF0-989FF710D980', 'e23afa03-645d-4666-87a0-17f32780ed92', 'en_us', 'New', NULL, NULL),
	('889f97cb-69b1-420f-bb95-302dc1ccb5c2', '646d8cde-03aa-4688-abb8-51bb74d55c2e', 'en_us', 'Completed', NULL, NULL),
	('8CAC4435-6E75-49D1-B5E3-DD68F74E8DB4', '3d80408b-8dd2-4eb5-8fac-c95924b6c4cc', 'en_us', 'Pending Input', NULL, NULL),
	('9371f2be-d437-423b-a544-ab46ccc7ad64', 'f2bd43b5-d671-415e-a992-02c48c8fa1e9', 'en_us', 'Not Started', NULL, NULL),
	('975ce24e-631b-4c5b-abee-8231f70b3681', '1308628e-bca6-49b8-ad60-5167149716b9', 'en_us', 'Analysis', NULL, '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Analysis</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nIn the Analysis Phase the goal is to define the Solution Proposal that will be put towards the customer. You should also assess the competitive landscape and define your top three competitors in this opportunity. In terms of the buying center at the customer the business evaluator. Understand the pain points and thus main drivers for the Purchasing process. You will need the business needs and pain points to formulate the value proposition.\r\n<br><br>\r\nIn this phase you should:\r\n<br><br>\r\n<li>Have at least one meeting closed with the customer\r\n<li>Define the Pain Points the customer want to address \r\n<li>Identified the business evaluator\r\n<li>Have at least one competitor identified\r\n<li>Set the customers budget\r\n</div>'),
	('b20a2046-0f47-420f-b5e1-865cb54e70eb', '96acb7aa-d1b9-47ef-b109-168275b5b4cf', 'en_us', 'Closed', '(won)', '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Closed Won</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nCongratulation. You did win the business\r\n</div>'),
	('b30fd2eb-b48b-4a3a-aca8-e01e708d081a', '44fa9544-b3a8-4a19-9df8-177ec239f56c', 'en_us', 'In Progress', NULL, NULL),
	('ccde7904-f4c6-454c-947f-e292a634b945', '30e916d7-9b5d-45a1-b44c-20f37079544c', 'en_us', 'Assigned', NULL, '<h2>Assigned</h2>\r\n<br>\r\nfor assigned leads verify the contacts data and create at lease one activitiy for the Lead (Task or Call)\r\n<br><br>\r\nTo close the phase you should: \r\n<br><br>\r\n<li>verify the contact details\r\n<li>add one activitiy (Task or Call) for the Lead'),
	('CCFA32F8-BDD6-4CA6-9B96-57A9C7039A39', 'ffa0313b-7f11-4dd7-87b5-0e9e1c066edd', 'en_us', 'Assigned', NULL, NULL),
	('D782971B-68CC-492F-A698-7871A4C1903D', 'e23afa03-645d-4666-87a0-17f32780ed92', 'de_DE', 'Neu', NULL, NULL),
	('e0c48ca1-0e17-43ed-91e7-32f42ea5065e', '7348c94b-94a2-4a95-93ea-f42776454dc2', 'en_us', 'Closed', '(discontinued)', '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Closed Discontinued</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nYouyou did not close the business because the customer die not purchase any solution you should also document the loss reason and also provide a short explanation to the loss reason.\r\n<br><br>\r\nIn this phase you should: \r\n<br><br>\r\n<li>Define the reason why you lost the business\r\n<li>Add a short explanation on the loss reason\r\n</div>'),
	('eae42c0e-3530-42c4-b5d5-38035e9e2dd1', '35807c0e-2b71-4f83-a9c9-4b079e284668', 'en_us', 'Negotiation', NULL, '<h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom">Negotiation</h2>\r\n<div class="slds-text-longform slds-p-top--medium">\r\nIn the final phase of the sales cycle you are negotiating the details of one proposal with the customer. Decide which is the final and last proposal that you are negotiating. Define the Plan to Closure for the opportunity.\r\n<br><br>\r\nIn this phase you should: \r\n<br><br>\r\n<li>Narrow the list of proposals down to one active proposal\r\n<li>Define the Plan to Closure\r\n</div>'),
	('EEE8B8A9-63C8-472F-84A2-5225F5D94810', '7593eb1e-9dcc-4f7c-9d45-3b7af525f267', 'de_DE', 'Zugewiesen', NULL, NULL),
	('F24716EB-130C-44A6-B600-AFE6A1E00F25', '40ad35bb-354f-4b9d-a644-30ebcceefbcd', 'de_DE', 'Abgeschlossen', NULL, NULL),
	('fd83912e-937c-41bd-b4d2-b89a5b96e375', '30a7993c-1cd4-40dc-a4e6-772f34d53b6b', 'en_us', 'Closed', '(dead)', NULL),
	('DBDF3632-8CB3-47AA-B435-B52B3F719238', '23E4F1BC-79AC-4BA7-8A60-2FFADAA67CD0', 'en_us', 'created', NULL, NULL),
	('3656BB4E-9EC8-41ED-B430-F0DF7C6C05F1', '23E4F1BC-79AC-4BA7-8A60-2FFADAA67CD0', 'de_DE', 'angelegt', NULL, NULL),
	('7D134F04-0BB6-448C-B4C6-C1C468483356', '8EE44694-D00C-4909-B5D2-F61F08712172', 'en_us', 'in progress', NULL, NULL),
	('B263ED5A-EA21-4DF7-B2DB-A80BC60148D8', '8EE44694-D00C-4909-B5D2-F61F08712172', 'de_DE', 'in Arbeit', NULL, NULL),
	('A5DB3062-98A6-4231-9E40-DF4B9F6632C3', 'BABBE0EB-F684-4D68-BDF7-5F8076C24D34', 'en_us', 'in test', NULL, NULL),
	('E1EB3176-92C9-49F1-AD51-1187F689F1E8', 'BABBE0EB-F684-4D68-BDF7-5F8076C24D34', 'de_DE', 'im Test', NULL, NULL);
/*!40000 ALTER TABLE `spicebeanguidestages_texts` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
