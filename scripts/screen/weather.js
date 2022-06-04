import { Commands } from "../core/index.js";

export function weather(event) {
  Commands.titleraw("subtitle", {
    "rawtext": [{
      "text": "§l§a——MC天气通知系统"
    }]
  });
  if (event.lightning && event.raining) {
    Commands.titleraw("title", {
      "rawtext": [{
        "text": "下雷震雨了~快回家！"
      }]
    });
  } else if (event.raining) {
    Commands.titleraw("title", {
      "rawtext": [{
        "text": "下雨了~衣服收了吗？"
      }]
    });
  } else {
    Commands.titleraw("title", {
      "rawtext": [{
        "text": "天晴了！！！空气清新！"
      }]
    });
  }
}