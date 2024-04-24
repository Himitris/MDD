# MDD app

This is the MDD app back-end.


## Installation

First install [Java](https://www.oracle.com/fr/java/technologies/downloads/#java21) according your operating system.

Then install [Maven](https://maven.apache.org/install.html).

And finally install [MySQL](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/).

Go to resources/sql in the root directory and :
* open a terminal,
* connect to mysql with your credentials,
* create a database 'CREATE DATABASE mdd',
* find the SQL script in '/ressources' and import it with 'SOURCE script.sql'.

initialize the following two environment variables: SPRING_DATASOURCE_USERNAME SPRING_DATASOURCE_PASSWORD with your credentials and SPRING_JWT_SECRETKEY with a 64 random hexadecimal.

Then you're réady to run it !

## Author

Antoine Gautier