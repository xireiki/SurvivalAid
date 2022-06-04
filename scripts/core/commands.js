import * as MC from "mojang-minecraft";
import * as UI from "mojang-minecraft-ui";
import { ui } from "./ui.js";

export var Commands = {
  cancel: false,
  data: {},
  help: {
    "help": [
      " [page: number]",
      "显示本信息"
    ]
  },
  keyword: {},
  trigger: {},
  run: function(command, dimension = "overworld") {
    try {
      return MC.world.getDimension(dimension).runCommand(command);
    }
    catch(error) {
      return error;
    }
  },
  execute: function(command, player, dimension = "overworld") {
    try {
      return MC.world.getDimension(dimension).runCommand(`execute ${player} ~ ~ ~ ${command}`);
    }
    catch(error){
      return error;
    }
  },
  tellraw: function(jsonMessage, player = "@a", dimension = "overworld") {
    MC.world.getDimension(dimension).runCommand("tellraw " + player + " " + JSON.stringify(jsonMessage));
  },
  log: function(message, player = "@a", dimension = "overworld") {
    let jsonMessage = {
      "rawtext": [
        {
          "text": `§l[Server]§r ${message}`
        }
      ]
    }
    MC.world.getDimension("overworld").runCommand("tellraw " + player + " " + JSON.stringify(jsonMessage))
  },
  echo: function(message, player = "@a", prefix = "", dimension = "overworld") {
    let jsonMessage = {
      "rawtext": [
        {
          "text": `${prefix}${message}`
        }
      ]
    }
    MC.world.getDimension("overworld").runCommand("tellraw " + player + " " + JSON.stringify(jsonMessage))
  },
  error: function(message, player = "@a", dimension = "overworld") {
    let jsonMessage = {
      "rawtext": [
        {
          "text": "§l§c§n[Error]§r " + message
        }
      ]
    }
    MC.world.getDimension("overworld").runCommand("tellraw " + player + " " + JSON.stringify(jsonMessage))
  },
  titleraw: function(type, jsonMessage, player = "@a", dimension = "overworld") {
    switch (type){
      case "reset":
        MC.world.getDimension(dimension).runCommand(`titleraw ${player} ${type}`);
        break;
      case "clear":
        MC.world.getDimension(dimension).runCommand(`titleraw ${player} ${type}`);
        break;
      default:
        MC.world.getDimension(dimension).runCommand(`titleraw ${player} ${type} ${JSON.stringify(jsonMessage)}`);
        break;
    }
  },
  cmds: {
    help: function(args, event){
      MC.world.getDimension("overworld").runCommand(`tellraw ${event.sender.name} ` + JSON.stringify({
        "rawtext": [
          {
            "text": "§lHelp: "
          }
        ]
      }));
      for (var m in Commands.help){
        var message = {
          "rawtext": [
            {
              "text": "§l" + m
            },
            {
              "text": "§l" + Commands.help[m][0]
            },
            {
              "text": "§l\n                "
            },
            {
              "text": "§l" + Commands.help[m][1]
            }
          ]
        }
        MC.world.getDimension("overworld").runCommand(`tellraw ${event.sender.name} ${JSON.stringify(message)}`);
      }
    }
  },
  setStorage: function(data){
    this.data = data;
    return this;
  },
  setCancel(cancel){
    this.cancel = cancel;
    return this;
  },
  regist: function(name, help, func){
    var n = name.split(" ");
    this.help[n[0]] = [];
    if(n.length > 1){
      var o = "";
      var q = n.slice(1);
      for (var m in q){
        o += " " + q[m];
      }
      this.help[n[0]][0] = o;
    } else {
      this.help[n[0]][0] = "";
    }
    this.help[n[0]][1] = help;
    this.cmds[n[0]] = func;
    return this;
  },
  replace: function(name, help, func){
    this.keyword[name] = {func: func, help: help};
    return this;
  },
  trigger: function(key, func){
    this.trigger[key] = func;
    return this;
  },
  ui: ui
}

MC.world.events.beforeChat.subscribe(function(event){
  const args = event.message.slice(1).split(" ");
  if(["?", "？", "+", "/"].indexOf(event.message[0]) > -1){
    if(args[0] == "" || Commands.cmds[args[0]] == undefined){
      args[0] = "help";
    }
    Commands["cmds"][args[0]](args, event, Commands.data);
    event.cancel = Commands.cancel;
  } else {
    for (let key in Commands.keyword){
      event.message = event.message.replace(new RegExp(key, "g"), Commands.keyword[key]["func"](args, event, Commands.data));
    }
    for (let trigger in Commands.trigger){
      if(event.message.indexOf(trigger) > -1){
        Commands.trigger[trigger](args, event, Commands.data);
      }
    }
  }
});
