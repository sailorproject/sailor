-- PostgreSQL
drop table if exists users cascade;
drop table if exists post cascade;
drop table if exists comment cascade;
drop table if exists post_category cascade;

drop table if exists users cascade;
create table users(
	id serial primary key,
	username varchar(20),
	password varchar(64)
);

drop table if exists post cascade;
create table post(
	id serial primary key,
	body text,
	author_id int references users ON DELETE set null
);

drop table if exists comment cascade;
create table comment(
	id serial primary key,
	body text,
	author_id int references users ON DELETE set null,
	post_id int references post ON DELETE CASCADE
);

drop table if exists category cascade;
create table category(
	id serial primary key,
	name text
);

drop table if exists post_category cascade;
create table post_category(
	post_id int references post ON DELETE CASCADE,
	category_id int references category ON DELETE CASCADE,
	primary key(post_id,category_id)
);