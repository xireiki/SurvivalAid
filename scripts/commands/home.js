import { Commands, MC, data, enu } from "../core/index.js";

export function home(args, event, param) {
  if (args.length > 1) {
    if (args[1] == "to") {
      if (enu.isEmpty(param.homes[event.sender.name])) {
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
      if (enu.isEmpty(param.homes[event.sender.name])) {
        Commands.error("你没有传送点可以删除", event.sender.name);
      } else {
        if(args[2]){
          var delList = args.slice(2);
          for (var deleteDeliveryPoint in delList){
            Reflect.deleteProperty(param.homes[event.sender.name], delList[deleteDeliveryPoint]);
            Commands.log(`已删除传送点: ${delList[deleteDeliveryPoint]}`, event.sender.name);
          }
        } else {
          Commands.log(`很抱歉，你至少需要输入一个传送点名称`, event.sender.name);
        }
      }
    } else if (args[1] == "list"){
      if(enu.isEmpty(param.homes[event.sender.name])){
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
}
export function sethome(args, event, data){
  
}
