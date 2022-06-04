import { mc, Commands, data, enu } from "../core/index.js";

function setItem({test, args, event, param} = {}){
  let Component = event.sender.getComponent("minecraft:inventory");
  let item = new MC.ItemStack(MC.items.get("stick"), 33, 0);
  // item.nameTag = "§o§l扩肛器~"
  Component.container.setItem(8, item);
}

function main({test, args, event, param} = {}){
  if(args[1] == "start"){
    
  }
}

export function test(args, event, param){
  main({args: args, event: event, param: param});
}

export function gtest(test){
  main({test: test});
}
