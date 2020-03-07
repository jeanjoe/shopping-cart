# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.28)
# Database: shopping_cart
# Generation Time: 2020-03-07 05:59:07 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table products
# ------------------------------------------------------------

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '',
  `price` double unsigned DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `quantity_available` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;

INSERT INTO `products` (`id`, `name`, `price`, `image`, `quantity_available`)
VALUES
	(1,'Apples',0.3,'https://source.unsplash.com/1600x900/?fruit,apple',100),
	(2,'Beer',2,'https://source.unsplash.com/1600x900/?bar,beer,drinking',200),
	(3,'Water',1,'https://source.unsplash.com/1600x900/?bottle,water,drinking',75),
	(4,'Cheese',3.74,'https://source.unsplash.com/1600x900/?cheese',50);

/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ratings
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ratings`;

CREATE TABLE `ratings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;

INSERT INTO `ratings` (`id`, `product_id`, `rating`)
VALUES
	(1,3,3),
	(2,1,3),
	(3,3,4),
	(4,1,3),
	(5,4,4),
	(6,1,2),
	(7,2,3),
	(8,1,5),
	(9,1,3),
	(10,2,5),
	(11,3,4),
	(12,4,5),
	(13,4,4),
	(14,3,4),
	(15,2,4),
	(16,3,3),
	(17,4,4),
	(18,2,3),
	(19,1,4),
	(20,2,4),
	(21,2,1),
	(22,3,3),
	(23,3,3),
	(24,4,4),
	(25,2,1),
	(26,1,1),
	(27,2,4),
	(28,3,3),
	(29,3,4),
	(30,4,5);

/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
