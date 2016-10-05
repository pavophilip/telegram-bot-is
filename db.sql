CREATE TABLE `telegram_is`.`clients` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `telegram_id` INT NULL,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `username` VARCHAR(45) NULL,
  `createdAt` DATETIME NULL,
  `updatedAt` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));