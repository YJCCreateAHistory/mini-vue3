var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    effect: () => effect,
    reactive: () => reactive
  });

  // packages/reactivity/src/effect.ts
  var activeEffect = void 0;
  var ReactiveEffect = class {
    constructor(fn) {
      this.fn = fn;
      this.active = true;
    }
    run() {
      if (!this.active) {
        this.fn();
      }
      try {
        debugger;
        activeEffect = this;
        return this.fn();
      } finally {
        activeEffect = void 0;
      }
    }
  };
  function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
  }

  // packages/reactivity/src/baseHandler.ts
  var mutableHandlers = {
    get(target, key, receiver) {
      if (key === "__v_isReactive" /* IS_REACTIVE */) {
        return true;
      }
      debugger;
      activeEffect;
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      return Reflect.set(target, key, value, receiver);
    }
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (typeof target !== "object") {
      return;
    }
    if (target["__v_isReactive" /* IS_REACTIVE */]) {
      return target;
    }
    let existingProsy = reactiveMap.get(target);
    if (reactiveMap.has(target)) {
      return existingProsy;
    }
    const proxy = new Proxy(target, mutableHandlers);
    reactiveMap.set(target, proxy);
    return proxy;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map