-- SQLite3
drop table if exists users;
create table users(
	id integer primary key autoincrement,
	username varchar(20),
	password varchar(20)
);

drop table if exists post;
create table post(
	id integer primary key autoincrement,
	body text,
	author_id integer references users (id)
);

drop table if exists comment;
create table comment(
	id integer primary key autoincrement,
	body text,
	author_id integer references users (id),
	post_id integer references post (id)
);

drop table if exists category;
create table category(
	id integer primary key autoincrement,
	name text
);

drop table if exists post_category;
create table post_category(
	post_id integer references post (id),
	category_id integer references category(id),
	primary key(post_id,category_id)
);
