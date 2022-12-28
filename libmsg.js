//libmsg.js

(function(){

//import libmain
if(typeof libmain!="object"){
if(typeof libmain=="undefined"){
var libmain;
}
let libmain_1=libmain;
if(typeof require=="function"){
libmain_1=require("./libmain.js");
}
if(typeof libmain_1!="object"){
console.error("error: cannot access or require libmain. libmsg@L15");
throw "error: cannot access or require libmain. libmsg@L16";
}
libmain=libmain_1;
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
console.error("error: cannot access or require oicq. libmsg@L31");
throw "error: cannot access or require oicq. libmsg@L32";
}
oicq=oicq_1;
}







var score_buy=function(uid,gid,inp){
return libmain.buy(uid,gid,name,parm1);
};

var item_use=function(uid,gid,inp){
return libmain.use(uid,gid,name,count);
};






var libmsg={};

libmsg.handler_onmsg=function(jo){
if(jo["message_type"]!="group"){ //group only
return;
}
if(jo["group_id"]!==271484982){
return;
}
//合并连续的text块
if(!(jo["message"] instanceof Array)) {
return; //internal error
}
for(var a=1;a<jo["message"].length;a++){
if(jo["message"][a-1]["type"]=="text"&&jo["message"][a]["type"]=="text"){
jo["message"][a-1]["data"]["text"]+=jo["message"].splice(a,1)[0]["data"]["text"];
a--;
}
}

var uid=jo["user_id"];
var gid=jo["group_id"];

for(var index=0;index<jo["message"].length;index++){
var cdata=jo["message"][index];

//message handler

if(cdata["type"]=="text"&&cdata["data"]["text"].startsWith("签到")){
try{
var res=libmain.sign(uid,gid);
jo.reply(res);
}catch(e){
console.error(e);
jo.reply("函数执行出错 libmsg@L??");
}
break;
}

if(cdata["type"]=="text"&&cdata["data"]["text"].startsWith("积分排行")){
try{
var res=libmain.score_ranking(gid);
jo.reply(res);
}catch(e){
console.error(e);
jo.reply("函数执行出错 libmsg@L??");
}
break;
}

if(cdata["type"]=="text"&&cdata["data"]["text"].startsWith("我的积分")){
try{
var res=libmain.myscore(uid,gid);
jo.reply(res);
}catch(e){
console.error(e);
jo.reply("函数执行出错 libmsg@L??");
}
break;
}

if(cdata["type"]=="text"&&cdata["data"]["text"].startsWith("我的物品")){
try{
var res=libmain.myitem(uid,gid);
jo.reply(res);
}catch(e){
console.error(e);
jo.reply("函数执行出错 libmsg@L??");
}
break;
}

if(cdata["type"]=="text"&&cdata["data"]["text"].startsWith("物品使用")){
try{
var res=item_use(uid,gid,cdata["data"]["text"].substr(4));
jo.reply(res);
}catch(e){
console.error(e);
jo.reply("函数执行出错 libmsg@L??");
}
break;
}

if(cdata["type"]=="text"&&cdata["data"]["text"].startsWith("积分兑换")){
try{
var res=score_buy(uid,gid,cdata["data"]["text"].substr(4));
jo.reply(res);
}catch(e){
console.error(e);
jo.reply("函数执行出错 libmsg@L??");
}
break;
}


//end of foreach loop
}
//end of function onmsg
};


if(typeof window==="object"){
//web browser
window.libmsg=libmsg;
}else if(typeof global==="object"){
//nodejs
module.exports=libmsg;
}
})();

/*
{"self_id":1832779787,"time":1671458885,"post_type":"message","message_type":"group","sub_type":"normal","message_id":"EC6INqL+J3oAANWfFhgkD2OgcEUB","group_id":271484982,"group_name":"botTestGroup.2.lhy&jimmma","user_id":2734565242,"anonymous":null,"message":[{"type":"text","data":{"text":"为啥路径是在这啊。。"}}],"raw_message":"为啥路径是在这啊。。","atme":false,"block":false,"seqid":54687,"font":"微软雅黑","sender":{"user_id":2734565242,"nickname":".󠁩󠁩󠁩󠁩󠁩󠁩󠁩󠁩","card":"","sex":"unknown","age":0,"area":"unknown","level":1,"role":"admin","title":""}}
*/