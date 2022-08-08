import { track, trigger } from "./effect"
// 响应式的标识
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers = {
    // target：从谁身上取数据
    // receiver：当前代理对象
    // key为属性名
    get(target, key, receiver) {
        //字段来源
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        }
        // debugger
        track(target, key)
        // 去代理对象上取值
        return Reflect.get(target, key, receiver) // 确保取值时this指向代理对象
    },
    set(target, key, value, receiver) {
        let oldValue = target[key];
        let result = Reflect.set(target, key, value, receiver)
        // 进行set操作时需要判断数据是否相同
        if (oldValue !== value) {
            debugger
            trigger(target, key, value, oldValue)
        }
        // 去代理对象上设置值
        // target[key] = value
        return result
    }
}