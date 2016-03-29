-- MySQL
drop table if exists users;
create table users(
	id int primary key auto_increment,
	username varchar(20),
	password varchar(64)
);

drop table if exists post;
create table post(
	id int primary key auto_increment,
	body text,
	author_id int references users (id)
);

drop table if exists comment;
create table comment(
	id int primary key auto_increment,
	body text,
	author_id int references users (id),
	post_id int references post (id)
);

drop table if exists category;
create table category(
	id int primary key auto_increment,
	name text
);

drop table if exists post_category;
create table post_category(
	post_id int references post (id),
	category_id int references category(id),
	primary key(post_id,category_id)
);

insert into users values (1,'etiene','geronimo');
insert into users values (2,'pedro','fantastic');

insert into post values (1,'This is a post',1);
insert into post values (2,'This is another post',2);
insert into post values (3,'This is yet anoter post',1);

insert into category values (1,'Politics');
insert into category values (2,'Internet');
insert into category values (3,'Programming');
insert into category values (4,'Personal');
insert into category values (5,'Other');

insert into post_category values (1,1);
insert into post_category values (1,2);
insert into post_category values (1,3);
insert into post_category values (2,5);
insert into post_category values (2,4);
insert into post_category values (3,3);
insert into post_category values (3,4);

insert into comment values(1,"This is a comment",2,1);
insert into comment values(2,"This is another comment",2,1);
insert into comment values(3,"This is yet another comment",1,2);
