CREATE TABLE `TOPIC` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(40),
  `description` VARCHAR(2000)
);

CREATE TABLE `COMMENT` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `author_username` varchar(40),
  `author_id` int,
  `article_id` int,
  `content` VARCHAR(2000)
);

CREATE TABLE `ARTICLES` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(50),
  `content` VARCHAR(10000),
  `author_id` int,
  `topic_id` int,
  `author_username` VARCHAR(40),
  `topic_name` VARCHAR(40),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `USERS` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(40),
  `email` VARCHAR(255),
  `password` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `SUBSCRIPTION` (
  `user_id` INT, 
  `topic_id` INT
);

ALTER TABLE `ARTICLES` ADD FOREIGN KEY (`topic_id`) REFERENCES `TOPIC` (`id`);
ALTER TABLE `ARTICLES` ADD FOREIGN KEY (`author_id`) REFERENCES `USERS` (`id`);
ALTER TABLE `SUBSCRIPTION` ADD FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`);
ALTER TABLE `SUBSCRIPTION` ADD FOREIGN KEY (`topic_id`) REFERENCES `TOPIC` (`id`);
ALTER TABLE `COMMENT` ADD FOREIGN KEY (`article_id`) REFERENCES `ARTICLES` (`id`);
ALTER TABLE `COMMENT` ADD FOREIGN KEY (`author_id`) REFERENCES `USERS` (`id`);

INSERT INTO TOPIC (title, description)
VALUES ('JavaScript', 'JavaScript est un langage de programmation polyvalent utilisé principalement pour le développement web, offrant une exécution côté client dans les navigateurs web.'),
       ('Python', "Python est un langage de programmation polyvalent et facile à lire, apprécié pour sa simplicité et sa concision, souvent utilisé dans le développement web, scientifique, et pour l'automatisation de tâches.");