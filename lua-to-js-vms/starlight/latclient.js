/*
 Lua@Client Extensions for starlight
  Copyright (c) 2015 Felipe Daragon 
  
 License: MIT
 
*/

window[ addEventListener ? 'addEventListener' : 'attachEvent' ](
  addEventListener ? 'load' : 'onload', 
  function(){
    Array.prototype.forEach.call(document.querySelectorAll('script[type=\"text\/lua\"]'), function(tag) {
      (starlight.parser.parse(tag.innerHTML))();
    });
  }
)