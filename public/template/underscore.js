this["JST"] = this["JST"] || {};

this["JST"]["app/templates/homepage.us"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<!DOCTYPE html>\n<html>\n  <head>\n    <title>'+
( pkg.name )+
'</title>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\n    <link rel="stylesheet" type="text/css" href="'+
( css )+
'" media="all" />\n  </head>\n  <body>\n    <script type="text/javascript" src="'+
( js )+
'"></script>\n    <div id="app" class=""></div>\n  </body>\n</html>';
}
return __p;
};

this["JST"]["app/templates/login.us"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h1>Welcome!</h1>\n<form>\n  <fieldset>\n    <p>\n      <label>Login</label>\n      <input type="text" name="user" value="'+
( obj.user || "" )+
'" placeholder="User name">\n    </p>\n    <p>\n      <label>Password</label>\n      <input type="password" name="pass">\n    </p>\n    <div>\n      <button type="submit" class="btn btn-primary">Login</button>\n    </div>\n  </fieldset>\n</form>';
}
return __p;
};

this["JST"]["app/templates/replies.us"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="replies">\n  <h1>Replies</h1>\n  <div class="collection-actions">\n    <button class="btn btn-info fetch">\n      Fetch <span class="icon-refresh icon-white"></span>\n    </button>\n    <button class="btn btn-danger delete">\n      Clear <span class="icon-remove icon-white"></span>\n    </button>\n  </div>\n\n  ';
 _(obj).each(function(reply){ 
;__p+='\n    <p class="reply">\n      <div class="author">\n        <small>\n          '+
( reply.author )+
',\n          <a href="'+
( gafBaseUrl() )+
''+
( reply.post_path )+
'">'+
( reply.timestamp )+
'</a>\n        </small>\n      </div>\n      <div class="message">\n        '+
( reply.text )+
'\n      </div>\n      <div class="link pull-right">\n        <a href="'+
( gafBaseUrl() )+
''+
( reply.thread_path )+
'" class="strong">\n          Go To Post <span class=" icon-circle-arrow-right"></span>\n        </a>\n      </div>\n    </p>\n    <hr/>\n  ';
 }) 
;__p+='\n\n  <div class="site-actions">\n    <button class="btn logout pull-right">Logout</button>\n  </div>\n</div>';
}
return __p;
};