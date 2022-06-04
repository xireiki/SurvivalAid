import { Commands, data, enu } from "../core/index.js";

export function tpa(args, event, param) {
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
}
export function accept(args, event, param) {
  if (args.length > 1) {
    let TeleportList = args.slice(1);
    for (var i in TeleportList) {
      if(TeleportList[i].slice(0, 1) == "@"){
        TeleportList[i] = TeleportList[i].slice(1);
      }
      if (param.tplist[event.sender.name] != undefined && param.tplist[event.sender.name] != [] && param.tplist[event.sender.name].indexOf(TeleportList[i]) > -1) {
        Commands.log(`§l§a${event.sender.name}§r, 正在为你将玩家 @${TeleportList[i]} 传送至你的位置`, event.sender.name);
        Commands.log(`§l§a${TeleportList[i]}§r, @${event.sender.name} 同意了你的传送请求，正在为你传送`, TeleportList[i]);
        Commands.run(`tp ${TeleportList[i]} ${event.sender.name}`);
        param.tplist[event.sender.name].splice(param.tplist[event.sender.name].indexOf(i), 1);
      } else {
        Commands.error(`§l§a${event.sender.name}§r, @${TeleportList[i]} 不在你的申请列表中`, event.sender.name)
      }
    }
  } else {
    if (!enu.isEmpty(param.tplist[event.sender.name])) {
      var transmittee = param.tplist[event.sender.name].shift();
      Commands.log(`§l§a${event.sender.name}§r, 正在为你将玩家 ${transmittee} 传送至你的位置`, event.sender.name);
      Commands.log(`§l§a${transmittee}§r, @${event.sender.name} 同意了你的传送请求，正在为你传送`, transmittee);
      Commands.run(`tp ${transmittee} ${event.sender.name}`);
    } else {
      Commands.error(`§l§a${event.sender.name}§r, 你的申请列表为空`, event.sender.name)
    }
  }
}
export function refusual(args, event, param) {
  if(!enu.isEmpty(param.tplist[event.sender.name])){
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
}