(function(){

//import libfileio
if(typeof fileio!="object"){
if(typeof fileio=="undefined"){
var fileio;
}
let fileio_1=fileio;
if(typeof window=="object"){
fileio_1=window.fileio;
}
if(typeof fileio_1!="object"&&typeof global=="object"){
fileio_1=global.fileio;
}
if(typeof require=="function"){
fileio_1=require("./libfileio.js");
}
if(typeof fileio_1!="object"){
console.error("error: cannot access libfileio. check if it's in a node environment. libyiyan@L19");
throw "error: cannot access libfileio. check if it's in a node environment. libyiyan@L20";
}
fileio=fileio_1;
}

//import libhttphelper
if(typeof httphelper!="object"){
if(typeof httphelper=="undefined"){
var httphelper;
}
let httphelper_1=httphelper;
if(typeof window=="object"){
httphelper_1=window.httphelper;
}
if(typeof httphelper_1!="object"&&typeof global=="object"){
httphelper_1=global.httphelper;
}
if(typeof require=="function"){
httphelper_1=require("./libhttphelper.js");
}
if(typeof httphelper_1!="object"){
console.error("error: cannot access libhttphelper. check if it's in a node environment. libyiyan@L41");
throw "error: cannot access libhttphelper. check if it's in a node environment. libyiyan@42";
}
httphelper=httphelper_1;
}



var libyiyan={};
libyiyan.local_fallback_file=__dirname+"/"+"yiyan_fallback.txt";

libyiyan.type_map={"a":"动画","b":"漫画","c":"游戏","d":"文学","e":"原创","f":"来自网络","g":"其他","h":"影视","i":"诗词","j":"网易云","k":"哲学","l":"抖机灵"};

libyiyan.get=function(callback){
if(typeof callback!="function"){
console.error("[libyiyan] error: type of arguments[0] (callback) is not Function.");
return false;
}
httphelper.send("https://v1.hitokoto.cn/?encode=json&charset=utf-8","GET","",function(data,req){
var resp="";
if(data===false){
console.warn("[libyiyan] 网络请求出错，正在尝试使用本地fallback...");
if(!fileio.is_readable(libyiyan.local_fallback_file){
resp="『呜哇！fallback喵走丢了！』\r\n";
resp+="--by libyiyan@L65 | 来自 报错";
callback(resp);
return;
}

rep="『"++"』\r\n";
rep+="--by "++" | 来自 "+;
if(){
console.error("[libyiyan] fallback文件"+libyiyan.local_fallback_file+"无法正常解析");
resp="『呜哇！fallback喵不是喵！它是谁？』\r\n";
resp+="--by libyiyan@L?? | 来自 报错";
callback(resp);
return;
}
callback(resp);
return;
}
"「」"
});
};

if(typeof window==="object"){
//web browser
window.libyiyan=libyiyan;
}else if(typeof global==="object"){
//nodejs
module.exports=libyiyan;
}
})();