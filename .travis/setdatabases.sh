if [ "$DB_DRIVER" == "postgres" ]; then
	luarocks install luasql-postgres PGSQL_INCDIR=/usr/include/postgresql

	psql -c 'create database sailor_test;' -U postgres
	psql $DB_NAME < test/dev-app/sql/pgsql.sql

elif [ "$DB_DRIVER" == "sqlite3" ]; then
	luarocks install luasql-sqlite3
	sqlite3 $TRAVIS_BUILD_DIR/sailor_test.db -init test/dev-app/sql/sqlite3.sql
else
	luarocks install luasql-mysql MYSQL_INCDIR=/usr/include/mysql

	mysql -e 'create database sailor_test;'
	mysql $DB_NAME < test/dev-app/sql/mysql.sql
fi
