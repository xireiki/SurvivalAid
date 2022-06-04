import { Commands, data } from "../core/index.js";

export function kill(args, event, param) {
  Commands.execute("kill", event.sender.name);
  Commands.log(`让我们恭喜${event.sender.name}回到天国~\n少年你回天国吗？只需要在聊天框输入： ? kill`, "@a");
}