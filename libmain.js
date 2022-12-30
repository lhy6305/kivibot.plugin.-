//libmain
(function(){

//import fileio
if(typeof fileio!="object"){
if(typeof fileio=="undefined"){
var fileio;
}
let fileio_1=fileio;
if(typeof require=="function"){
fileio_1=require("./libfileio.js");
}
if(typeof fileio_1!="object"){
console.error("error: cannot access or require fileio. libmain@L14");
throw "error: cannot access or require fileio. libmain@L15";
}
fileio=fileio_1;
}
/*
//import oicq
if(typeof oicq!="object"){
if(typeof oicq=="undefined"){
var oicq;
}
let oicq_1=oicq;
if(typeof require=="function"){
oicq_1=require("@vikiboss/oicq");
}
if(typeof oicq_1!="object"){
console.error("error: cannot access or require oicq. libmain@L30");
throw "error: cannot access or require oicq. libmain@L31";
}
oicq=oicq_1;
}
*/

var libmain={};

var getsave=function(){
var res=fileio.file_get_contents("savefile.json");
if(res===false){
console.warn("warn: cannot get save file. use empty object instead. libmain@L42");
return {};
}
try{
res=JSON.parse(res);
}catch(e){
console.error(e);
throw "error: cannot parse save file as json object. libmain@L49";
}
return res;
};

var setsave=function(obj){
try{
obj=JSON.stringify(obj);
}catch(e){
console.error(e);
console.error("error: cannot stringify input as json. libmain@L59");
return false;
}
obj=fileio.file_put_contents("savefile.json",obj);
if(obj===false){
console.error("error: cannot write save file. libmain@L64");
return false;
}
return true;
};

libmain.sign=function(uid,gid){
var sf=getsave();
if(!(gid in sf)){
sf[gid]={};
}
var flag_cansign=false;
var flag_newusr=false;
if(!(uid in sf[gid])){
sf[gid][uid]={"total":0,"continue":0,"lastsign":0,"customTitle":""};
flag_newusr=true;
}
var todayzero=(new Date().setHours(0,0,0,0))/100000;
if(lastsign<todayzero){
flag_cansign=true;
}
sf=setsave(sf);
if(sf===false){
return "🧧数据写入失败，请联系管理员🧧 libmain@L87";
}
};

libmain.score_ranking=function(gid){

};

libmain.myscore=function(uid,gid){

};

libmain.myitem=function(uid,gid){

};

libmain.buy=function(uid,gid,name,parm1){

};

libmain.use=function(uid,gid,name,count){

};

libmain.cookconfig_runonce=function(){
var obj=getsave();
for(var a in obj){
delete obj[a]["config"];
delete obj[a]["store"];
for(var b in obj[a]["userData"]){
obj[a][b]=obj[a]["userData"][b];
if("LastSignTime" in obj[a][b]){
obj[a][b]["lastsign"]=obj[a][b]["LastSignTime"];
delete obj[a][b]["LastSignTime"];
}
if(!("total" in obj[a][b])){
obj[a][b]["total"]=0;
}
if(!("continue" in obj[a][b])){
obj[a][b]["continue"]=0;
}
if(!("lastsign" in obj[a][b])){
obj[a][b]["lastsign"]=0;
}
if(!("customTitle" in obj[a][b])){
obj[a][b]["customTitle"]="";
}
}
delete obj[a]["userData"];
}
setsave(obj);
};


if(typeof window==="object"){
//web browser
window.libmain=libmain;
}else if(typeof global==="object"){
//nodejs
module.exports=libmain;
}
})();