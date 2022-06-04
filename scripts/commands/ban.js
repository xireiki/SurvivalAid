import { Commands, data } from "../core/index.js";

export function ban(args, event, param) {
  if (args.length > 1) {
    let a = args.slice(1);
    for (let b in a) {
      if (param.black.indexOf(a[b]) > -1) {
        param.black.splice(param.black.indexOf(a[b]), 1);
      } else {
        param.black.push(a[b]);
        try {
          Commands.run(`kick $ {
            a[b]
          }`);
        } catch (err) {
          Commands.error(err);
        }
      }
    }
  } else {
    Commands.error("缺少参数", event.sender.name);
  }
}