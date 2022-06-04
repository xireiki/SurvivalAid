import { Commands, UI, MC, data, enu } from "../core/index.js";
import { setting } from "./setting.js";

function tpa(player, players, playerList){
  const menuA = new UI.ModalFormData();
  menuA
  .title("§l§b<- 选择玩家 ->")
  .dropdown("选择", playerList)
  .show(player)
  .then((response1) => {
    if(response1.formValues === undefined){
      return
    }
    let betper = playerList[response1.formValues];
    let wantper = players[response1.formValues];
    if (data.tplist[betper] == undefined) {
      data.tplist[betper] = [player.name];
    } else {
      data.tplist[betper].unshift(player.name);
    }
    Commands.log(`§l§a${player.name}§r, 已为你向 @${betper} 发送请求`, player.name);
    Commands.log(`§l§a${betper}§r, @${player.name} 请求传送到你的位置`, betper);
    const menuB = new UI.MessageFormData();
    menuB
      .title("§l§b<- 传送请求 ->")
      .body(`§l§a${wantper.name}§r, 玩家 §l§e@${player.name}§r 正在申请传送至你的位置，§l是否同意？§r`)
      .button1("同意")
      .button2("拒绝")
      .show(wantper)
      .then((response2) => {
        switch(response2.selection){
          case 1:
            // 同意传送
            Commands.log(`§l§a${wantper.name}§r, @${betper} 同意了你的传送请求，正在为你传送`, wantper.name);
            Commands.run(`tp "${betper}" "${wantper.name}"`);
            data.tplist[betper].shift();
            break;
          default:
            // 拒绝传送
            Commands.log(`§l§a${wantper.name}§r, @${betper} 拒绝了你的传送请求！`, wantper.name);
            data.tplist[betper].shift();
            break
        }
      });
  });
}

function sethome(player, players, playerList){
  const menuA = new UI.ModalFormData();
  menuA
    .title("§l§6<- 创建传送点 ->§r")
    .textField("输入传送点名称", "传送点名称, 不允许为空")
    .show(player)
    .then((res) => {
      let dimension = (player.dimension === MC.world.getDimension("nether")) ? "nether" : (player.dimension === MC.world.getDimension("the end")) ? "the end" : "overworld";
      if (data.homes[player.name] == undefined) {
        data.homes[player.name] = {};
      }
      if(res.formValues == "" || res.formValues === undefined){
        Commands.ui.error("传送点名称不可以为空！！", player);
        return res;
      }
      data.homes[player.name][res.formValues] = [{x: player.location.x, y: player.location.y, z: player.location.z, rotation: player.bodyRotation}, dimension];
      Commands.log(`已创建传送点: §l${res.formValues}§r(§l§6${player.location.x | 0}§r, §l§6${player.location.y | 0}§r, §l§6${player.location.z | 0}§r, §l${dimension}§r)§r`, player.name);
    })
}
function delhome(player, players, playerList){
  let homes = [];
  for (let h in data.homes[player.name]){
    homes.push(h);
  }
  if(enu.isEmpty(homes)){
    Commands.ui.error("你还没有传送点", player)
    return;
  }
  const menuA = new UI.ModalFormData();
  menuA
    .title("§l§6<- 删除传送点 ->§r")
    .dropdown("选择需要删除的传送点", homes)
    .show(player)
    .then((res) => {
      if(res.formValues === undefined){
        return;
      }
      Reflect.deleteProperty(data.homes[player.name], homes[res.formValues]);
      Commands.log(`已删除传送点: ${homes[res.formValues]}`, player.name);
    });
}
function gohome(player, players, playerList){
  let homes = [];
  for (let h in data.homes[player.name]){
    homes.push(h);
  }
  if(enu.isEmpty(homes)){
    Commands.ui.error("你还没有传送点", player)
    return;
  }
  const menuA = new UI.ModalFormData();
  menuA
    .title("§l§6<- 传送 ->§r")
    .dropdown("选择传送点以传送", homes)
    .show(player)
    .then((res) => {
      player.teleport(new MC.Location(data.homes[player.name][homes[res.formValues]][0]['x'], data.homes[player.name][homes[res.formValues]][0]['y'], data.homes[player.name][homes[res.formValues]][0]['z']), MC.world.getDimension(data.homes[player.name][homes[res.formValues]][1]), data.homes[player.name][homes[res.formValues]][0]["rotation"], 0);
    });
}

function home(player, players, playerList){
  let homeList = [];
  for (let home in data.homes){
    homeList.push(home);
  }
  const menuA = new UI.ActionFormData();
  menuA
    .title("§l§6<- 快速传送 ->§r")
    .button("§l创建传送点§r")
    .button("§l删除传送点§r")
    .button("§l前往传送点§r")
    .show(player)
    .then((response1) => {
      switch(response1.selection){
        case 0:
          sethome(player, players, playerList);
          break;
        case 1:
          delhome(player, players, playerList);
          break;
        case 2:
          gohome(player, players, playerList);
          break;
        default:
          break;
      }
    });
}

function deathBack(player, players, playerList){
  if(enu.isEmpty(data.death[player.name])){
    Commands.ui.error("你还没有死亡点", player);
  }
  Commands.run(`tp "${player.name}" ${data.death[player.name][parseInt(args[1])][0]} ${data.death[player.name][parseInt(args[1])][1]} ${data.death[player.name][parseInt(args[1])][2]}`);
}

export function ui(event){
  if(event.source.id == "minecraft:player" && ((event.item.id == "minecraft:stick" && event.item.nameTag == "§l§am§ee§6n§cu§r" && event.item.data == 32000) || (event.item.id == "xireiki:menu" && event.item.data == 0))){
    let player;
    let playerList = [];
    let players = [];
    
    let options = new MC.EntityQueryOptions();
    options.name = event.source.nameTag;
    for (let p of MC.world.getPlayers(options)){
      player = p;
      break;
    }
    
    for(let p of MC.world.getPlayers()){
      playerList.push(p.name);
      players.push(p);
    }
    
    const mainMenu = new UI.ActionFormData();
    mainMenu
      .title("§l<- 主菜单 ->")
      .body("欢迎使用生存辅助脚本!\n作者: §l§6xireiki§r\nGitHub: xireiki\n这是主菜单，请选择")
      .button("§l玩家互传§r")
      .button("§l传送锚点§r")
      .button("§l死亡返回§r")
      .button("§l设置菜单§r")
      .show(player)
      .then((response) => {
        switch(response.selection){
          case undefined:
            break;
          case 0:
            tpa(player, players, playerList);
            break;
          case 1:
            home(player, players, playerList);
            break;
          case 2:
            deathBack(player, players, playerList);
            break;
          case 3:
            setting(player, players, playerList);
            break;
          default:
            break;
        }
      });
  }
}