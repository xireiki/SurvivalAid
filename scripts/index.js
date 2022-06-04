import { MC, UI, GT, Commands, data, enu } from "./core/index.js"; // 导入 core

// 分文件存储的命令函数
import { tpa, accept, refusual } from "./commands/tpa.js";
import { list } from "./commands/list.js";
import { home } from "./commands/home.js";
import { back } from "./commands/back.js";
import { ban } from "./commands/ban.js";
import { kill } from "./commands/kill.js";
import { test, gtest } from "./commands/test.js";
// 分文件存储的 ui 函数
import { weather } from "./screen/weather.js";
import { ui } from "./screen/ui.js";


Commands
  .setStorage(data) // 会传递给函数的第三个变量
  .setCancel(true) // 取消消息发送
  /* regist("命令名称 参数解释", "命令说明", 命令函数(命令解析参数, 事件返回值, 数据地址)) */
  .regist("tpa <player: player>", "请求传送至 player", tpa)
  .regist("accept [player: player]", "同意 player 的传送请求", accept)
  .regist("deny [player: player]", "拒绝 player 或者 最后一个向你申请传送的玩家 的传送请求", refusual)
  .regist("list [object: string]", "查看对象 object", list)
  .regist("kill", "自杀", kill)
  .regist("back [number: number]", "返回倒数第 number 个死亡地点", back)
  .regist("home set/to/del <name: string>", "创建/传送/删除名为 name 的传送点", home)
  .regist("ban <player: player>", "加入/取消黑名单", ban)
  .regist("test [param: any]...", "测试函数", test)
  /* replace("替换关键词", "解释", 替换函数(命令解析参数, 事件返回值, 数据地址)) */
  .replace("%health", "当前血量", function(args, event, param){
    return `(§c${event.sender.getComponent('health').current}§r)`;
  })
  .replace("%location", "当前位置", function(args, event, param){
    return `(§6${event.sender.location.x | 0}, ${event.sender.location.y | 0}, ${event.sender.location.z | 0}§r)`;
  })
  /* trigger("触发关键词", 提醒函数(命令解析参数, 事件返回值, 数据地址)) */
  .trigger("自杀", function(args, event, param){
    Commands.echo("§l§a别想不开啊§r，伤心的少年！ §o?kill§r §l可以帮你解决烦恼！§r", event.sender.name)
  })
  .trigger("传送点", function(args, event, param){
    Commands.echo("§l使用 §o?home§r §l命令可以设置传送点哦！", event.sender.name);
  })

enu.on("weatherChange", weather);
enu.on("itemUseOn", ui);

GT.register("xireiki", "test", gtest);

let version = "1.0.0";
console.log(`[xireiki]生存辅助脚本加载完成，版本: ${version}, 作者: xireiki, GitHub: xireiki`);
