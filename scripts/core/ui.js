import * as MC from "mojang-minecraft";
import * as UI from "mojang-minecraft-ui";

export const ui = {
  error: function(error, player) {
    const menuA = new UI.MessageFormData();
    menuA
      .title("§l§c<- Error ->§r")
      .body(error)
      .button1("确认")
      .button2("取消")
      .show(player)
      .then((res) => {
        return res;
      });
  },
  log: function(log, player) {
    const menuA = new UI.MessageFormData();
    menuA
      .title("§l§<- Log ->§r")
      .body(log)
      .button1("确认")
      .button2("取消")
      .show(player)
      .then((res) => {
        return res;
      })
  },
  confirm: function(player, content, {title = "<- 确认 ->", t = "确认", f = "取消"} = {}){
    const menuA = new UI.MessageFormData();
    menuA
      .title(title)
      .body(content)
      .button1(t)
      .button2(f)
      .show(player)
      .then((res) => {
        if(res.formValues === 0){
          return true;
        } else {
          return false;
        }
      })
  },
  alert: function(player, content, {title = "<- 确认 ->", t = "确认", f = "取消"} = {}){
    const menuA = new UI.MessageFormData();
    menuA
      .title(title)
      .body(content)
      .button1(t)
      .show(player)
  }
}