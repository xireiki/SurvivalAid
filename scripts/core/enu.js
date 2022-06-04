import * as MC from "mojang-minecraft";

let enu = {
  on: function on(event, func){
    return MC.world.events[event].subscribe(func);
  },
  isEmpty: function(obj) {
    switch (typeof obj) {
      case "object":
        if (Array.isArray(obj) && !obj.length) return true;
        else {
          for (let item in obj) {
            if (obj.hasOwnProperty(item)) return false;
          }
          return true;
        }
        break;
      default:
        if (obj === '' || obj === null || obj === false || obj === undefined) return true;
        return false;
        break;
    }
  },
  extend: function(){
    function isPlainObject(obj) {
      var class2type = {};
      var toString = class2type.toString;
      var hasOwn = class2type.hasOwnProperty;
      var proto, Ctor;
      if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
      }
      proto = Object.getPrototypeOf(obj);
      if (!proto) {
        return true;
      }
      Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
      return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
    }
    var deep = false;
    var name, options, src, copy, clone, copyIsArray;
    var length = arguments.length;
    var i = 1;
    var target = arguments[0] || {};
    if (typeof target == 'boolean') {
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (typeof target !== "object" && !isFunction(target)) {
      target = {};
    }
    for (; i < length; i++) {
      options = arguments[i];
      if (options != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Array.isArray(src) ? src : [];
            } else {
              clone = src && isPlainObject(src) ? src : {};
            }
            target[name] = this.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  },
  storage: (function(){
    let space = {};
    return function(key, value){
      if(key === undefined){
        let result = {};
        this.extend(true, result, space);
        return result;
      } else if(value === undefined){
        return space[key];
      } else {
        if(typeof value === "object"){
          value = JSON.stringify(value);
        }
        space[key] = value;
        return true;
      }
    }
  })()
}
export { enu }