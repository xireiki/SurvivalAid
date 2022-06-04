import * as MC from "mojang-minecraft";
import * as GT from "mojang-gametest";
import * as UI from "mojang-minecraft-ui";
import { Commands } from "./commands.js";
import { data } from "./storage.js";
import { enu } from "./enu.js";

let mc = {};
enu.extend(true, mc, MC, GT, UI);

export { MC, UI, GT, Commands, data, enu, mc };