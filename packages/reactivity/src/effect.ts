// 9. 当前正在运行的effect实例
export let activeEffect = undefined
class ReactiveEffect {
    // 给effect嵌套情况下的区分
    public parent = null
    // 属性与effect双向记录
    public deps = []


    // 5. 在实例上新增属性active
    public active = true // 4. 这个表明effect是激活状态
    constructor(public fn) { // 6. 用户传递的参数也会在this上

    }
    run() {// 3. run执行effect
        if (!this.active) {// 7. 处于激活态才执行，只需要执行函数，不执行依赖收集：相当于执行一次effect函数
            this.fn()
        }
        // 8. 进行依赖收集，把effect设置为一个全局变量，将它与属性关联起来，将自己暴露在全局上，将当前的effect与稍后渲染的属性关联在一起
        try {
            debugger
            this.parent = activeEffect
            // 13. 需要知道将get里的key与哪个effect关联起来
            activeEffect = this // 10. 一运行就将effect保存在activeEffect上
            return this.fn() // 11. 当稍后调用进行取值时，就可以获取到这个全局的activeEffect
        } finally {
            activeEffect = this.parent // 12. 重置
        }
    }
    stop(){
        this.active = false
    }
}

export function effect(fn) {
    // fn可以根据状态变化重新执行
    const _effect = new ReactiveEffect(fn) //1. 创建响应式的effect
    _effect.run() // 2. 默认先执行一次
}
// 13. 用于存储依赖收集
let targetMap = new WeakMap();
// WeakMap={对象：Map{data:Set}}
export function track(target, key) {
    // debugger
    // 1. 需要判断是不是需要进行依赖收集的属性
    if(!activeEffect) return;
    // 2. 判断target是否存在
    let depsMap = targetMap.get(target)
    if(!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    // 3. 判断key是否存在
    let dep = depsMap.get(key) // key为属性
    if(!dep) {
        depsMap.set(key, (dep = new Set())) // 因为去重属性，可以避免每次都重新进行依赖收集
    }
    // 性能优化，确定是否进行收集(确定是否存在activeEffect)
    let shouldTrack = !dep.has(activeEffect)
    if(shouldTrack) {
        dep.add(activeEffect) // activeEffect是进行收集的依赖（effect实例）
        // 存放属性对应的Set
        activeEffect.deps.push(dep) // 让effect记录对应的dep，上面把activeEffect赋值给了this
    }
}
export function trigger(target, key, value, oldValue) {
    debugger
    // 从身上拿到原值
    let depsMap = targetMap.get(target)
    if(!depsMap) return; // 如果没有target，说明属性与它无关，不执行
    let effects = depsMap.get(key) // 拿到effect
    effects && effects.forEach(effect => {
        // 判断避免无限调用
        if(effect !== activeEffect) {
            effect.run() // 触发就在执行run，等于重新收集依赖
        }
    });
}