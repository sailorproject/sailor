#! /bin/bash

# A script for setting up environment for travis-ci testing.
# Sets up openresty.
OPENRESTY_VERSION="1.9.3.1"

wget https://openresty.org/download/ngx_openresty-$OPENRESTY_VERSION.tar.gz
tar xzvf ngx_openresty-OPENRESTY_VERSION.tar.gz
cd ngx_openresty-OPENRESTY_VERSION/
./configure
make
make install

export PATH=${PATH}:$HOME/.lua:$HOME/.local/bin:${TRAVIS_BUILD_DIR}/install/nginx/sbin

cd ../
rm -rf ngx_openresty-OPENRESTY_VERSION

nginx -v 
resty -v 
