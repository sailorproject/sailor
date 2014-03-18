local sailor_path = {{path}}
package.path = package.path .. ';'..sailor_path..'/?.lua'
require "sailor"
sailor.launch()
