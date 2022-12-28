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

libmain.sign=function(uid,gid){

};

libmain.score_ranking=function(gid){

};

libmain.myscore=function(uid,gid){

};

libmain.myitem=function(uid,gid){

};

libmain.buy(uid,gid,name,parm1){

};

libmain.use(uid,gid,name,count){

};



if(typeof window==="object"){
//web browser
window.libmain=libmain;
}else if(typeof global==="object"){
//nodejs
module.exports=libmain;
}
})();