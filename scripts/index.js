import {
  Commands, Events, MC, GT
} from "./lib/core.js";
import * as item from "./lib/scoreboardData.js";

// data 需要等待mojang完成数据存储
let data = {
  tplist: {},
  death: {},
  homes: {},
  black: []
}

const sets = {
  tpa: function(args, event, param) {
    if (args.length == 2) {
      let BeTP = (args[1].slice(0, 1) == "@") ? args[1].slice(1) : args[1];
      if (param.tplist[args[1]] == undefined) {
        param.tplist[BeTP] = [event.sender.name];
      } else {
        param.tplist[BeTP].unshift(event.sender.name);
      }
      Commands.log(`§l§a${event.sender.name}§r, 已为你向 ${args[1]} 发送请求`, event.sender.name);
      Commands.log(`§l§a${BeTP}§r, @${event.sender.name} 请求传送到你的位置`, BeTP);
    } else if (args.length > 2) {
      Commands.error(`§l§a${event.sender.name}§r, 请不要输入多个玩家(我懒得弄多人，而且一般人也用不到)`, event.sender.name);
    } else if (args.length == 1) {
      Commands.error(`§l§a${event.sender.name}§r, 请输入玩家ID`, event.sender.name);
    }
  },
  accept: function(args, event, param) {
    if (args.length > 1) {
      let TeleportList = args.slice(1);
      for (var i in TeleportList) {
        if(TeleportList[i].slice(0, 1) == "@"){
          TeleportList[i] = TeleportList[i].slice(1);
        }
        if (param.tplist[event.sender.name].indexOf(TeleportList[i]) > -1) {
          Commands.log(`§l§a${event.sender.name}§r, 正在为你将玩家 @${TeleportList[i]} 传送至你的位置`, event.sender.name);
          Commands.log(`§l§a${TeleportList[i]}§r, @${event.sender.name} 同意了你的传送请求，正在为你传送...`, event.sender.name);
          Commands.run(`tp ${TeleportList[i]} ${event.sender.name}`);
          param.tplist[event.sender.name].splice(param.tplist[event.sender.name].indexOf(i), 1);
        } else {
          Commands.error(`§l§a${event.sender.name}§r, @${TeleportList[i]}不在你的申请列表中`, event.sender.name)
        }
      }
    } else {
      if (param.tplist[event.sender.name]) {
        if (param.tplist[event.sender.name].length > 0) {
          var transmittee = param.tplist[event.sender.name].shift();
          Commands.log(`§l§a${event.sender.name}§r, 正在为你将玩家 ${transmittee} 传送至你的位置`, event.sender.name);
          Commands.run(`tp ${transmittee} ${event.sender.name}`);
        } else {
          Commands.error(`§l§a${event.sender.name}§r, 你的申请列表为空`, event.sender.name)
        }
      } else {
        Commands.error(`§l§a${event.sender.name}§r, 你的申请列表为空`, event.sender.name)
      }
    }
  },
  refusual: function(args, event, param) {
    if(param.tplist[event.sender.name]){
      if (args.length > 1) {
        let delList = args.slice(1);
        for (let i in delList) {
          delList[i] = (delList[i].slice(0, 1) == "@") ? delList[i].slice(1) : delList[i];
          if (param.tplist[event.sender.name].indexOf(delList[i]) > -1) {
            Commands.log(`§l§a${event.sender.name}§r, 正在为你将玩家 @${delList[i]} 从你的请求列表中删除`, event.sender.name)
            param.tplist[event.sender.name].splice(param.tplist[event.sender.name].indexOf(i), 1);
          } else {
            Commands.error(`§l§a${event.sender.name}§r, @${delList[i]} 不在你的申请列表中`, event.sender.name)
          }
        }
      } else {
        Commands.log(`§l§a${event.sender.name}§r, 正在为你将玩家 @${param.tplist[event.sender.name][0]} 从你的请求列表中删除`, event.sender.name)
        param.tplist[event.sender.name].shift();
      }
    } else {
      Commands.error(`§l§a${event.sender.name}§r, 你的请求列表为空`, event.sender.name);
    }
  },
  list: function(args, event, param) {
    if (args.length > 1) {
      switch (args[1]) {
        case "tplist":
          if(param.tplist[event.sender.name] === undefined || param.tplist[event.sender.name] == []){
            Commands.error(`§l§a${event.sender.name}§r, 你的请求列表为空`, event.sender.name);
            break;
          }
          let tplistStr = "";
          for (let tl in param.tplist[event.sender.name]){
            tplistStr = `${tplistStr}, ${param.tplist[event.sender.name][tl]}`;
          }
          Commands.log(`传送请求列表: ${tplistStr.slice(2)}`, event.sender.name);
          break;
        case "death":
          if(!param.death[event.sender.name]){
            Commands.error(`§l§a${event.sender.name}§r, 你的死亡列表为空`, event.sender.name);
            break;
          }
          let deathStr = "";
          for (let tl in param.death[event.sender.name]){
            deathStr = `${deathStr}, (§6${param.deatg[event.sender.name][tl][0]}§r, §6${param.tplist[event.sender.name][tl][1]}§r, §6${param.tplist[event.sender.name][tl][2]}§r)`;
          }
          Commands.log(`传送请求列表: ${tplistStr.slice(2)}`, event.sender.name);
          break;
        case "home":
          if(!param.homes[event.sender.name]){
            Commands.error(`§l§a${event.sender.name}§r, 你的传送点列表为空`, event.sender.name);
            break;
          }
          let homeStr = "";
          for (let tl in param.homes[event.sender.name]){
            homeStr += `, ${tl}(§l§6${param.homes[event.sender.name][tl][0]["x"] | 0}§r, §l§6${param.homes[event.sender.name][tl][0]["y"] | 0}§r, §l§6${param.homes[event.sender.name][tl][0]["z"] | 0}§r, §l${param.homes[event.sender.name][tl][1]}§r)`;
          }
          Commands.log(`传送点列表: ${homeStr.slice(1)}`, event.sender.name);
          break;
        default:
          Commands.error(`§l§a${event.sender.name}§r, 该对象不存在`, event.sender.name);
          break;
      }
    } else {
      Commands.error("请输入需要查看的对象", event.sender.name)
    }
  },
  home: function(args, event, param) {
    if (args.length > 1) {
      if (args[1] == "to") {
        if (param.homes[event.sender.name] == undefined) {
          Commands.error("你还没有传送点", event.sender.name);
        } else {
          if (param.homes[event.sender.name][args[2]] != undefined) {
            event.sender.teleport(new MC.Location(param.homes[event.sender.name][args[2]][0]['x'], param.homes[event.sender.name][args[2]][0]['y'], param.homes[event.sender.name][args[2]][0]['z']), MC.world.getDimension(param.homes[event.sender.name][args[2]][1]), param.homes[event.sender.name][args[2]][0]["rotation"], 0);
          } else {
            Commands.error(`传送点 ${args[2]} 不存在`, event.sender.name)
          }
        }
      } else if (args[1] == "set") {
        let dimension = (event.sender.dimension === MC.world.getDimension("nether")) ? "nether" : (event.sender.dimension === MC.world.getDimension("the end")) ? "the end" : "overworld";
        if (param.homes[event.sender.name] == undefined) {
          param.homes[event.sender.name] = {};
        }
        param.homes[event.sender.name][args[2]] = [{x: event.sender.location.x, y: event.sender.location.y, z: event.sender.location.z, rotation: event.sender.bodyRotation}, dimension];
        Commands.log(`已创建传送点: §l${args[2]}§r(§l§6${event.sender.location.x | 0}§r, §l§6${event.sender.location.y | 0}§r, §l§6${event.sender.location.z | 0}§r, §l${dimension}§r)§r`, event.sender.name);
      } else if (args[1] == "del") {
        if (param.homes[event.sender.name] == undefined) {
          Commands.error("你没有传送点可以删除", event.sender.name);
        } else {
          if(args[2]){
            var delList = args.slice(2);
            for (var deleteDeliveryPoint in delList){
              param.homes[event.sender.name][delList[deleteDeliveryPoint]] = undefined;
              Commands.log(`已删除传送点: ${delList[deleteDeliveryPoint]}`, event.sender.name);
            }
          } else {
            Commands.log(`很抱歉，你至少需要输入一个传送点名称`, event.sender.name);
          }
        }
      } else if (args[1] == "list"){
        if(param.homes[event.sender.name] == undefined){
          Commands.error("你还没有传送点", event.sender.name);
        } else {
          let a = "";
          for (var b in param.homes[event.sender.name]){
            a += `, ${b}(§l§6${param.homes[event.sender.name][b][0]["x"] | 0}§r, §l§6${param.homes[event.sender.name][b][0]["y"] | 0}§r, §l§6${param.homes[event.sender.name][b][0]["z"] | 0}§r, §l${param.homes[event.sender.name][b][1]}§r)`;
          }
          Commands.log(`你有以下传送点: ${a.slice(2)}`, event.sender.name)
        }
      } else {
        Commands.error("该命令不存在", event.sender.name);
      }
    } else {
      Commands.error("缺少参数", event.sender.name);
    }
  },
  back: function(args, event, param) {
    if (args.length > 1) {
      if (param.death[event.sender.name] == undefined || param.death[event.sender.name] == []) {
        Commands.error("没有死亡地点", event.sender.name)
      } else {
        if (args[1] > param.death[event.sender.name].length) {
          Commands.error("数值错误", event.sender.name);
        } else {
          Commands.run(`tp ${event.sender.name} ${param.death[event.sender.name][parseInt(args[1])][0]} ${param.death[event.sender.name][parseInt(args[1])][1]} ${param.death[event.sender.name][parseInt(args[1])][2]}`);
        }
      }
    } else {
      if (param.death[event.sender.name] == undefined) {
        Commands.error("没有死亡地点", event.sender.name)
      } else {
        Commands.run(`tp ${event.sender.name} ${param.death[event.sender.name][0][0]} ${param.death[event.sender.name][0][1]} ${param.death[event.sender.name][0][2]}`);
      }
    }
  }
}

// 等待MoJang完成mojang-minecraft-ui的开发后继续开发
/*function menu(args, event, data){
  const form = new UI.ActionFormData()
    .title("主菜单")
    .body("欢迎使用生存辅助脚本，作者: xireiki, GitHub: xireiki")
    .button("§l§a玩家§r传送")
    .button("快速§l§a传送§r")
    .button("回§l§c死亡§r点")
    .button("查看列表")
    .button("关闭菜单")
  form.show(event.sender).then((response) => {
    switch(response.selection){
      case 0:
        const teleportMenu1 = new UI.ActionFromData()
          .title("§l§a玩家§r传送")
          .button("关闭菜单")
          .button("返回上级")
          .button("同意传送")
          .button("拒绝传送")
          .button("选择传送")
        teleportMenu1.show(event.sender).then((response) => {
          switch(response.selection){
            case 1:
              // 返回上级
              break;
            case 2:
              sets.accept(["accept"], event, data);
              break;
            case 3:
              sets.refusual(["refusual"], event, data);
              break;
            case 4:
              const teleportMenu = new UI.ActionFromData()
                .title("§l§a玩家§r传送")
                .button("关闭菜单")
              let players = MC.world.getDimension("overworld").getPlayers();
              for (let a in players){
                teleportMenu.button(players[a].name)
              }
              teleportMenu.show(event.sender).then((response) => {
                sets.tpa(["tpa", players[response.selection - 1].name], event, data);
              });
              break;
            default:
              break;
          }
        });
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      default:
        break;
    }
  });
}*/

function test(args, event, data){
  Commands.log("============= START ============");
  item.setString("data", "test");
  Commands.echo(item.getString("data"))
}

Commands
  .setStorage(data) // 会传递给函数的第三个变量
  /* regist("命令名称 参数解释", "命令说明", 命令函数(命令解析参数, 事件返回值, 数据地址)) */
  .regist("tpa <player: player>", "请求传送至 player", sets.tpa)
  .regist("accept [player: player]", "同意 player 的传送请求", sets.accept)
  .regist("refusual [player: player]", "拒绝 player 或者 最后一个向你申请传送的玩家 的传送请求", sets.refusual)
  .regist("list [object: string]", "查看对象 object", sets.list)
  .regist("kill", "自杀", function(args, event, param) {
    Commands.execute("kill", event.sender.name);
    Commands.log(`让我们恭喜 ${event.sender.name} 回到天国~\n少年你回天国吗？只需要在聊天框输入：?kill`, "@a");
  })
  .regist("back [number: number]", "返回倒数第 number 个死亡地点", sets.back)
  .regist("home set/to/del <name: string>", "创建/传送/删除名为 name 的传送点", sets.home)
  .regist("ban <player: player>", "加入/取消黑名单", function(args, event, param) {
    if(args.length > 1){
      let a = args.slice(1);
      for (let b in a){
        if(param.black.indexOf(a[b]) > -1){
          param.black.splice(param.black.indexOf(a[b]), 1);
        } else {
          param.black.push(a[b]);
          try {
            Commands.run(`kick ${a[b]}`);
          }
          catch(err){
            Commands.error(err);
          }
        }
      }
    } else {
      Commands.error("缺少参数", event.sender.name);
    }
  })
  // .regist("menu", "打开菜单", menu) // 注释原因详见menu函数定义注释
  .regist("test [param]...", "测试函数", test)
  .replace("%health", "当前血量", function(args, event, param){
    return `(§c${event.sender.getComponent('health').current}§r)`;
  })
  .replace("%location", "当前位置", function(args, event, param){
    return `(§6${event.sender.location.x | 0}, ${event.sender.location.y | 0}, ${event.sender.location.z | 0}§r)`;
  })
  .trigger("自杀", function(args, event, param){
    Commands.echo("§a别想不开啊§r，伤心的少年！ ?kill 可以帮你解决烦恼！", event.sender.name)
  })
  .trigger("传送点", function(args, event, param){
    Commands.echo("使用 ?home 命令可以设置传送点哦！", event.sender.name);
  })
  .cancel = true; // 取消消息的发送

Events.weatherChange.subscribe(function(event){
  Commands.titleraw("subtitle", {
    "rawtext": [
      {
        "text": "§l§a——MC天气通知系统"
      }
    ]
  });
  if(event.lightning && event.raining){
    Commands.titleraw("title", {
      "rawtext": [
        {
          "text": "下雷震雨了~快回家！"
        }
      ]
    });
  } else if(event.raining){
    Commands.titleraw("title", {
      "rawtext": [
        {
          "text": "下雨了~衣服收了吗？"
        }
      ]
    });
  } else {
    Commands.titleraw("title", {
      "rawtext": [
        {
          "text": "天晴了！！！空气清新！"
        }
      ]
    });
  }
});

let version = "1.0.0";
console.log(`[xireiki]生存辅助脚本加载完成，版本: ${version}, 作者: xireiki, GitHub: xireiki`);
