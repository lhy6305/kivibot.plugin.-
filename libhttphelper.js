//libhttphelper.js

(function(){

//import http
if(typeof http!="object"){
if(typeof http=="undefined"){
var http;
}
let http_1=http;
if(typeof window=="object"){
http_1=window.http;
}
if(typeof http_1!="object"&&typeof global=="object"){
http_1=global.http;
}
if(typeof require=="function"){
http_1=require("http");
}
if(typeof http_1!="object"){
console.error("error: cannot access http. libhttphelper@L21");
}
http=http_1;
}

//import https
if(typeof https!="object"){
if(typeof https=="undefined"){
var https;
}
let https_1=https;
if(typeof window=="object"){
https_1=window.https;
}
if(typeof https_1!="object"&&typeof global=="object"){
https_1=global.https;
}
if(typeof require=="function"){
https_1=require("https");
}
if(typeof https_1!="object"){
console.error("error: cannot access https. libhttphelper@L42");
}
https=https_1;
}

//import Buffer
if(typeof Buffer!="object"){
if(typeof Buffer=="undefined"){
var Buffer;
}
let Buffer_1=Buffer;
if(typeof require=="function"){
Buffer_1=require("buffer").Buffer;
}
if(typeof Buffer_1!="function"){
console.error("error: cannot access or require Buffer. libhttphelper@L57");
throw "error: cannot access or require Buffer. libhttphelper@L58";
}
Buffer=Buffer_1;
}

var httphelper={};

httphelper.send=function(url,method,dat,callback){
if(arguments.length<3||typeof dat!="string"){
dat="";
}
if(arguments.length<2||typeof method!="string"){
method="GET";
if(dat.length>0){
method="POST";
}
}
if(arguments.length<4||typeof callback!="function"){
callback=new Function();
}
try{
url=new URL(url);
}catch{
console.error("failed to parse url. libhttphelper@L81");
}
var resp=[];
var options={"protocol":url.protocol,"hostname":url.hostname,"port":url.port,"path":url.pathname+url.search,"method":method.toUpperCase(),"headers":{}};
if(method!="GET"){
options["headers"]["Content-Length"]=dat.length;
}
var req_time=Date.now();
var res_time=false;
var req_isaborted=false;
var req=null;
if(url.protocol=="http:"){
req=http;
}else if(url.protocol=="https:"){
req=https;
}else{
console.error("unknown protocol "+url.protocol+". libhttphelper@L97");
return false;
}
req=req.request(options,function(res){
if(req.destroyed){
return;
}
res.on("data",function(chunk){
if(!req_isaborted){
req_time=false;
res_time=Date.now();
resp.push(chunk);
}
});
res.on("end",function(){
if(!req_isaborted){
req_isaborted=true;
resp=Buffer.concat(resp);
callback(resp);
}
});
});
var res_timer=setInterval(function(){
if(res_time!==false&&res_time!==true&&Date.now()>res_time+5000&&!req_isaborted){
req_isaborted=true;
req.abort();
console.error("timeout while receiving data from "+url.hostname+":"+url.port+". libhttphelper@L123");
callback(false);
}
if(req_isaborted){
clearInterval(res_timer);
}
},100);
var req_timer=setInterval(function(){
if(req_time!==false&&Date.now()>req_time+5000&&!req_isaborted){
req_isaborted=true;
req.abort();
console.error("connection to "+url.hostname+":"+url.port+" timeout. libhttphelper@134");
callback(false);
}
if(req_time===false||req_isaborted){
clearInterval(req_timer);
}
},100);
req.on("error",function(e){
if(!req_isaborted){
req_isaborted=true;
console.error("request failed with message ["+e.message+"]. libhttphelper@144");
console.error(e);
callback(false);
}
});
if(dat.length>0){
req.write(dat);
}
req.end();
return req;
};

if(typeof window==="object"){
//web browser
window.httphelper=httphelper;
}else if(typeof global==="object"){
//nodejs
module.exports=httphelper;
}

})();