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


var libmain={};

libmain.savepath="savefile.json";

var getsave=function(){
var res=fileio.file_get_contents(libmain.savepath);
if(res===false){
console.warn("warn: cannot get save file. use empty object instead. libmain@L44");
return {};
}
try{
res=JSON.parse(res);
}catch(e){
console.error(e);
console.error("error: cannot parse save file as json object. libmain@L51");
return false;
}
return res;
};

var setsave=function(obj){
try{
obj=JSON.stringify(obj);
}catch(e){
console.error(e);
console.error("error: cannot stringify input as json. libmain@L62");
return false;
}
obj=fileio.file_put_contents(libmain.savepath,obj);
if(obj===false){
console.error("error: cannot write save file. libmain@L67");
return false;
}
return true;
};

libmain.sign=function(uid,gid){
var sf=getsave();
if(sf===false){
return oicq.cqcode.at(uid)+" "+"😣💦你干嘛～哈哈～哎哟 file_read_fail libmain@L76";
}
if(!(gid in sf)){
sf[gid]={};
}
var flag_cansign=false;
var flag_newusr=false;
if(!(uid in sf[gid])){
sf[gid][uid]={"total":0,"continue":0,"lastsign":0,"customTitle":""};
flag_newusr=true;
}
if(!("total" in sf[gid][uid])){
sf[gid][uid]["total"]=0;
}
if(!("continue" in sf[gid][uid])){
sf[gid][uid]["continue"]=0;
}
if(!("lastsign" in sf[gid][uid])){
sf[gid][uid]["lastsign"]=0;
}
if(!("customTitle" in sf[gid][uid])){
sf[gid][uid]["customTitle"]="";
}
var todayzero=(new Date().setHours(0,0,0,0))/100000;
if(lastsign<todayzero){
flag_cansign=true;
}
if(!flag_cansign){
return "["+sf[gid][uid]["customTitle"]+"]"+oicq.cqcode.at(uid)+" "+"今天已经签过了";
}
sf[gid][uid]["lastsign"]=(Date.now()/100000).toFixed(0);
sf[gid][uid]["continue"]=Math.max(0,sf[gid][uid]["continue"]);
sf[gid][uid]["continue"]+=1;
var addscore=Math.max(Math.min(sf[gid][uid]["continue"],7),0);
var res="["+sf[gid][uid]["customTitle"]+"]"+oicq.cqcode.at(uid)+" ";
res+="签到成功";
res+="，获得"+addscore+"积分";
sf[gid][uid]["total"]+=addscore;
if(flag_newusr){
addscore+=20;
res+="，🧧已为你额外加成首签20积分";
}
sf=setsave(sf);
if(sf===false){
return oicq.cqcode.at(uid)+" "+"😣💦你干嘛～哈哈～哎哟 file_write_fail libmain@L120";
}
res+="，🧧连签"+sf[gid][uid]["continue"]+"天🧧"
return res;
};

libmain.myscore=function(uid,gid){
var sf=getsave();
if(sf===false){
return oicq.cqcode.at(uid)+" "+"😣💦你干嘛～哈哈～哎哟 file_read_fail libmain@L129";
}
if(!(gid in sf)||!(uid in sf[gid])){
return oicq.cqcode.at(uid)+" "+"😣💦你干嘛～哈哈～哎哟，先签个到吧 no_such_key libmain@L132";
}
return oicq.cqcode.at(uid)+" "+"你当前拥有积分"+sf[gid][uid]["total"];
};

libmain.group_ranking=function(gid){

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