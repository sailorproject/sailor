export PATH=${PATH}:$HOME/.lua:$HOME/.local/bin:${TRAVIS_BUILD_DIR}/install/luarocks/bin
export PATH=${PATH}:$HOME/.lua:$HOME/.local/bin:${TRAVIS_BUILD_DIR}/install/openresty/nginx/sbin
export PATH=${PATH}:$HOME/.lua:$HOME/.local/bin:${TRAVIS_BUILD_DIR}/install/openresty/bin
bash .travis/setup_lua.sh
bash .travis/setup_servers.sh
eval `$HOME/.lua/luarocks path`
