"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disable = exports.enable = exports.info = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const oim_1 = __importDefault(require("@vikiboss/oim"));
const oicq_1 = require("@vikiboss/oicq");
const setting_json_1 = __importDefault(require("./setting.json"));
const DefaultConfig = {
    unit: setting_json_1.default.unit,
    newbie: setting_json_1.default.newbie,
    remedy: setting_json_1.default.remedy // 补签所需积分，暂未实现
};
const info = {
    name: "积分签到",
    author: "Viki",
    version: "1.3.0"
};
exports.info = info;
const ONE_DAY = 24 * 60 * 60 * 1000; // 一天的毫秒数
let pluginData = {};
let botAdmins = [];
const checkData = (group, user) => {
    if (!pluginData[group]) {
        pluginData[group] = {
            config: DefaultConfig,
            store: [],
            userData: {}
        };
    }
    if (!pluginData[group].userData[user]) {
        pluginData[group].userData[user] = {
            total: 0,
            continue: 0,
            LastSignTime: 0,
            customTitle: ""
        };
    }
};
const fileExist = (filePath) => {
    try {
        return fs_1.default.statSync(filePath).isFile();
    }
    catch (_a) {
        return false;
    }
};
const dirExist = (dirPath) => {
    try {
        return fs_1.default.statSync(dirPath).isDirectory();
    }
    catch (_a) {
        return false;
    }
};
const nowForFileName = () => oim_1.default.format(new Date(), "MM月DD日HH时mm分ss秒");
function save(data) {
    try {
        const dir = path_1.default.join(__dirname, String(this.uin));
        const filePath = path_1.default.join(dir, "config.json");
        if (!dirExist(dir))
            fs_1.default.mkdirSync(dir);
        fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    }
    catch (_a) {
        return false;
    }
}
function load(defaultData) {
    const dir = path_1.default.join(__dirname, String(this.uin));
    const filePath = path_1.default.join(dir, "config.json");
    try {
        if (!dirExist(dir))
            fs_1.default.mkdirSync(dir);
        if (!fileExist(filePath)) {
            save.call(this, defaultData);
            return defaultData;
        }
        return JSON.parse(fs_1.default.readFileSync(filePath, { encoding: "utf-8" }));
    }
    catch (_a) {
        fs_1.default.copyFileSync(filePath, path_1.default.join(dir, `[${nowForFileName()}]-config.json`));
        const msg = `配置读取失败，已尝试将原始数据备份到原目录`;
        console.log(msg);
        save.call(this, defaultData);
        return defaultData;
    }
}
function upload(name, group) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [qq, GFS] = [String(this.uin), this.acquireGfs(group)];
            const uploadFileName = `${name}-${nowForFileName()}-config.json`;
            let [qqDirExists, pid, ls] = [false, "", yield GFS.ls()];
            for (const l of ls) {
                if (l.name === qq && ((_a = l) === null || _a === void 0 ? void 0 : _a.is_dir)) {
                    qqDirExists = true;
                    pid = (_b = l) === null || _b === void 0 ? void 0 : _b.fid;
                }
            }
            if (!qqDirExists) {
                const state = yield GFS.mkdir(qq);
                pid = state.fid;
            }
            yield GFS.upload(path_1.default.join(__dirname, qq, "config.json"), pid, uploadFileName);
            return `✅ ${name}：已将配置文件上传至指定群`;
        }
        catch (e) {
            return `❎ ${name}：配置文件上传失败，错误信息：${e === null || e === void 0 ? void 0 : e.message}`;
        }
    });
}
function listener(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    return __awaiter(this, void 0, void 0, function* () {
        const { raw_message: _message, user_id, message_type: type, message_id: msg_id, reply } = data;
        const card = (type === "group" && data.sender.card) || data.sender.nickname || "";
        const message = _message.trim();
        const rep = type === "group" ? oicq_1.cqcode.reply(msg_id) : "";
        const at = type === "group" ? oicq_1.cqcode.at(user_id) : "";
        if (botAdmins.includes(user_id) && message === ((_a = setting_json_1.default === null || setting_json_1.default === void 0 ? void 0 : setting_json_1.default.admin) === null || _a === void 0 ? void 0 : _a.backup)) {
            return yield reply(yield upload.call(this, info.name, setting_json_1.default.group));
        }
        else if (botAdmins.includes(user_id) && message === ((_b = setting_json_1.default === null || setting_json_1.default === void 0 ? void 0 : setting_json_1.default.admin) === null || _b === void 0 ? void 0 : _b.count)) {
            const today = new Date(oim_1.default.format(new Date(), "YYYY-MM-DD 00:00")).getTime();
            let [un, aun] = [0, 0];
            const groups = Object.values(pluginData).map((e) => e.userData);
            for (const group of groups) {
                for (const user of Object.values(group)) {
                    if (user.LastSignTime <= 0)
                        continue;
                    aun += 1;
                    if (user.LastSignTime * 100000 !== today)
                        continue;
                    un += 1;
                }
            }
            return yield reply(`🧧今日签到人数：${un}\n🧧总签到人数：${aun}`);
        }
        if (type !== "group")
            return;
        const unit = DefaultConfig.unit;
        const { group_id } = data;
        if (message === ((_c = setting_json_1.default === null || setting_json_1.default === void 0 ? void 0 : setting_json_1.default.user) === null || _c === void 0 ? void 0 : _c.sign)) {
            checkData(group_id, user_id);
            const today = new Date(oim_1.default.format(new Date(), "YYYY-MM-DD 00:00")).getTime();
            const user = pluginData[group_id].userData[user_id];
            const title = "customTitle" in user ? user.customTitle : "";
            var isNewUser = user.LastSignTime == 0;
            var score = 0;
            const canSign = isNewUser || ((_d = user.LastSignTime * 100000) === 0 || isNaN(Number(_d)) ? (isNewUser = true, 0) : _d) < today;
            if (canSign) {
                let con = 1;
                const newbie = pluginData[group_id].config.newbie;
                const isContinue = ((_e = user.LastSignTime * 100000) === 0 || isNaN(_e) ? (isNewUser = true, 0) : _e) + ONE_DAY === today;
                if (isNewUser) {
                    score = 1 + newbie;
                }
                else if (isContinue) {
                    con = user.continue + 1;
                    score += Math.max(1, Math.min(con, 7));
                }
                else {
                    con = 1;
                    score += 1;
                }
                user.LastSignTime = today / 100000;
                pluginData[group_id].userData[user_id].continue = con;
                pluginData[group_id].userData[user_id].total += score;
                if (save.call(this, pluginData)) {
                    const extra = isNewUser && newbie > 0 ? `，🧧已为你额外加成首签 ${newbie} ${unit}` : "";
                    const continueStr = isContinue ? `，🧧连签 ${con} 天` : "";
                    return yield reply((title === "" ? "" : "[" + title + "]") + ` ${at} 签到成功，获得 ${score} ${unit}${continueStr}${extra}🧧`);
                }
                else {
                    return yield reply(`${rep}数据读写失败，请联系管理员`);
                }
            }
            else {
                return yield reply((title === "" ? "" : "[" + title + "]") + `${at} 今天已经签过了`);
            }
        }
        else if (message === ((_f = setting_json_1.default === null || setting_json_1.default === void 0 ? void 0 : setting_json_1.default.user) === null || _f === void 0 ? void 0 : _f.mine)) {
            checkData(group_id, user_id);
            const total = pluginData[group_id].userData[user_id].total;
            return yield reply(`${rep}你当前拥有 ${total} ${unit}`);
        }
        else if (message === ((_g = setting_json_1.default === null || setting_json_1.default === void 0 ? void 0 : setting_json_1.default.user) === null || _g === void 0 ? void 0 : _g.rank)) {
            checkData(group_id, user_id);
            const groupData = pluginData[group_id].userData;
            const today = new Date(oim_1.default.format(new Date(), "YYYY-MM-DD 00:00")).getTime();
            let arr = [];
            let [msg, i] = [`=== 🎇${unit}排行榜🎇 ===`, 1];
            for (const user of Object.keys(groupData)) {
                const userData = groupData[Number(user)];
                const lastTime = ((_h = userData.LastSignTime * 100000) === 0 || isNaN(Number(_h)) ? 0 : _h);
                const isContinue = lastTime === today || lastTime + ONE_DAY === today;
                const total = userData.total;
                const con = userData.continue;
                const title = "customTitle" in userData ? userData.customTitle : "";
                arr.push({ user, total, con, isContinue, title });
            }
            arr = arr.sort((pre, next) => pre.total - next.total).reverse();
            for (const item of arr.slice(0, 10)) {
                msg += `\n🎇第 ${i++} 名：` + (item.title === "" ? "" : "[" + item.title + "]") + `${oicq_1.cqcode.at(Number(item.user), undefined, true)}`;
                msg += `\n🧧共 ${item.total} ${unit}`;
                msg += item.isContinue ? `，连签 ${item.con} 天` : "";
            }
            return yield reply(msg);
        }
        else if ((_i = ((_i = setting_json_1.default === null || setting_json_1.default === void 0 ? void 0 : setting_json_1.default.user) === null || _i === void 0 ? void 0 : _i.buy)) !== void 0 ? message.substr(0, _i.length) === _i : false) { //判断兑换关键词
            return yield reply((_i = (function (_this) {
                var is_preview = false;
                _i = message.substr(_i.length).split("");
                while ((_i[0] == " " || _i[0] == "\r" || _i[0] == "\n" || _i[0] == "\t") && _i.length > 0) {
                    _i.shift();
                }
                if (_i.length <= 0) {
                    return;
                }
                _i = _i.join("");
                if ((_j = ((_j = setting_json_1.default === null || setting_json_1.default === void 0 ? void 0 : setting_json_1.default.user) === null || _j === void 0 ? void 0 : _j.buy_preview)) !== void 0 ? _i.substr(0, _j.length) === _j : false) { //判断预览关键词
                    is_preview = true;
                    _i = _i.substr(_j.length).split("");
                    while ((_i[0] == " " || _i[0] == "\r" || _i[0] == "\n" || _i[0] == "\t") && _i.length > 0) {
                        _i.shift();
                    }
                    if (_i.length <= 0) {
                        return;
                    }
                    _i = _i.join("");
                }
                if ((_j = ((_j = setting_json_1.default === null || setting_json_1.default === void 0 ? void 0 : setting_json_1.default.user) === null || _j === void 0 ? void 0 : _j.buy_custom_title)) !== void 0 ? _i.substr(0, _j.length) === _j : false) { //判断头衔关键词
                    _i = _i.substr(_j.length).split("");
                    while ((_i[0] == " " || _i[0] == "\r" || _i[0] == "\n" || _i[0] == "\t") && _i.length > 0) {
                        _i.shift();
                    }
                    if (_i.length <= 0) {
                        return;
                    }
                    _i = _i.join("");
                    _j = void 0;
                    try {
                        _j = JSON.parse(_i);
                    } catch {
                        try {
                            _j = JSON.parse("\"" + _i.replaceAll("\"", "\\\"").replaceAll("\\", "\\\\") + "\"");
                        } catch {
                        }
                    }
                    if (_j === void 0 || _j.constructor.toString().match(/function (.*)\(/)[1].toLowerCase() !== "string") {
                        _j = _i;
                    }
                    //处理积分减少部分
                    try {
                        _i = new Function("return " + setting_json_1.default.user.buy_custom_title_rule)();
                        _i = _i(_j.length);
                    } catch {
                        return `${rep} 内部错误，请联系管理员`;
                    }
                    if (is_preview) {
                        _i += "-" + _i;
                    } else if (pluginData[group_id].userData[user_id].total < _i) {
                        return `${rep} 操作失败：需要${_i}积分，当前仅有` + pluginData[group_id].userData[user_id].total;
                    } else {
                        pluginData[group_id].userData[user_id].total -= _i;
                        pluginData[group_id].userData[user_id].customTitle = _j;
                        if (!save.call(_this, pluginData)) {
                            return `${rep} 数据读写异常，此次操作不计分`;
                        }
                    }
                    return `${at}您的头衔已改为[${_j}]，本次花费${_i}积分，当前积分剩余` + pluginData[group_id].userData[user_id].total;
                }
            })(this)) === void 0 ? `${rep} 命令格式错误` : _i);
        }
    });
}
function adminListener(admins) {
    botAdmins = admins;
}
const enable = (bot) => {
    pluginData = load.call(bot, {});
    bot.on("message", listener);
    bot.on("kivibot.admin", adminListener);
};
exports.enable = enable;
const disable = (bot) => {
    bot.off("message", listener);
    bot.off("kivibot.admin", adminListener);
};
exports.disable = disable;
