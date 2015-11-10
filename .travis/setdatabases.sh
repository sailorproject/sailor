if [ "$DB_DRIVER" == "postgres" ]; then
	luarocks install luasql-postgres PGSQL_INCDIR=/usr/lib/postgresql/9.1/

	psql -c 'create database sailor_test;' -U postgres
	psql $DB_NAME < test/dev-app/sql/pgsql.sql

else
	luarocks install luasql-mysql MYSQL_INCDIR=/usr/include/mysql

	mysql -e 'create database sailor_test;'
	mysql $DB_NAME < test/dev-app/sql/mysql.sql
fi
