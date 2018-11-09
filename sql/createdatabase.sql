CREATE DATABASE thedatabase;

CREATE TABLE classes (
username VARCHAR(45) NOT NULL,
class VARCHAR(45) NOT NULL,
PRIMARY KEY (username, class)
);

CREATE TABLE logininfo (
username VARCHAR(45) NOT NULL,
password VARCHAR(45) NOT NULL,
PRIMARY KEY (username)
);

CREATE TABLE userinfo (
username VARCHAR(45) NOT NULL,
school VARCHAR(45) NOT NULL,
availability VARCHAR(45) NOT NULL,
contact VARCHAR(45) NOT NULL,
PRIMARY KEY (username)
);
