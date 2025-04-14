CREATE TABLE `students_table` (
  `student_id` INT(11) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `user_password` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(20) NOT NULL,
  `gender` ENUM('Male','Female','Other') NOT NULL,
  `course` VARCHAR(100) NOT NULL,
  `user_address` TEXT NOT NULL,
  `birthdate` DATE NOT NULL,
  `profile_url` TEXT DEFAULT NULL,
  `verification_code` VARCHAR(10) DEFAULT NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `date_created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`)
)