import { mutableHandlers, ReactiveFlags } from "./baseHandler"
// 将数据转换成响应式数据，只能做对象代理
const reactiveMap = new WeakMap() // 不会造成内存泄露，key只能是对象，不被垃圾回收
// 实现同一个对象，代理多次，返回一个代理
// 代理对象再次代理直接返回
export function reactive(target) {
    if (typeof target !== 'object') {
        return
    }
    // 因为第二次是Proxy，去Proxy上取值会触发get
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target
    }
    // 映射表，这是操作是直接代理同一个对象
    let existingProsy = reactiveMap.get(target)
    if (reactiveMap.has(target)) {
        return existingProsy
    }
    // 第一次普通对象代理通过new Proxy代理一次
    // 下一次传递的是proxy，我们就可以看一下他有没有代理过，如果有，则get方法的时候说明已经访问过
    const proxy = new Proxy(target, mutableHandlers)
    // 映射表添加属性
    reactiveMap.set(target, proxy)
    return proxy
}

//第一次代理时，这个对象身上没有Proxy，就会创建一个Proxy。在第二次又代理时，当我访问这个属性时，就会进入get，执行后发现有key这个字段。就直接返回target