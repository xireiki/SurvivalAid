import { Commands, data, enu } from "../core/index.js";

export function list(args, event, param) {
  if (args.length > 1) {
    switch (args[1]) {
      case "tplist":
        if(enu.isEmpty(param.tplist[event.sender.name])){
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
        if(enu.isEmpty(param.death[event.sender.name])){
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
        if(enu.isEmpty(param.homes[event.sender.name])){
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
}