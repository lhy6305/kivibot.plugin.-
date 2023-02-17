
const libmsg = require("./libmsg.js");

const info = {
    name: "积分签到",
    author: "ly65",
    version: "1.0.0"
};


const listener = function(data){
    libmsg.handler_onmsg(data);
}

// 定义 enable 函数
const enable = bot => {
    bot.on('message', listener);
  };
  
  // 定义 disable 函数
  const disable = bot => {
    bot.off('message', listener);
  };
  
  module.exports = { info, enable, disable };