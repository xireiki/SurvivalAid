import { Commands, data } from "../core/index.js";

export function back(args, event, param) {
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