#! /bin/bash

# A script for setting up environment for travis-ci testing.
# Sets up openresty.
OPENRESTY_VERSION="1.9.3.1"
OPENRESTY_DIR=$TRAVIS_BUILD_DIR/install/openresty

wget https://openresty.org/download/ngx_openresty-$OPENRESTY_VERSION.tar.gz
tar xzvf ngx_openresty-$OPENRESTY_VERSION.tar.gz
cd ngx_openresty-$OPENRESTY_VERSION/

if [ "$LUA" == "lua5.1" ]; then
	./configure --prefix="$OPENRESTY_DIR" --with-lua51=$TRAVIS_BUILD_DIR/install/lua
elif [ "$LUA" == "lua5.2" ]; then
	./configure --prefix="$OPENRESTY_DIR"
elif [ "$LUA" == "luajit" ]; then
	./configure --prefix="$OPENRESTY_DIR" --with-luajit=$TRAVIS_BUILD_DIR/install/lua
fi

make
make install

export PATH=${PATH}:$HOME/.lua:$HOME/.local/bin:${TRAVIS_BUILD_DIR}/install/openresty/nginx/sbin
export PATH=${PATH}:$HOME/.lua:$HOME/.local/bin:${TRAVIS_BUILD_DIR}/install/openresty/bin

cd ../
rm -rf ngx_openresty-$OPENRESTY_VERSION

nginx -v 
resty -v 
