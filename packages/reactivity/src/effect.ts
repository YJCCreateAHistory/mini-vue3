// 9. 当前正在运行的effect实例
export let activeEffect = undefined
class ReactiveEffect {
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
            // 13. 需要知道将get里的key与哪个effect关联起来
            activeEffect = this // 10. 一运行就将effect保存在activeEffect上
            return this.fn() // 11. 当稍后调用进行取值时，就可以获取到这个全局的activeEffect
        } finally {
            activeEffect = undefined // 12. 重置
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

// effect(()=>{
//     console.log(11)
// })

// fn = ()=>{
//     console.log(11)

// effect.run = function(){
//     if (!this.active) {
//         this.fn()
//     }
//     try {
//         // this指向effect，将effect赋值给activeEffect
//         activeEffect = this // 10. 一运行就将effect保存在activeEffect上
//         // 返回出去再调用fn()，相当于执行了一次
//         return this.fn() // 11. 当稍后调用进行取值时，就可以获取到这个全局的activeEffect
//     } finally {
//         activeEffect = undefined
//     }
// }

// 第一次调用fn的时候走到用户逻辑，渲染数据，执行到了state.name，取数据就进入到了get，get发现用到了name属性，也就拿到了当前这个fn的aciveEffect，这样就关联了起来（因为activeEffect是一个effect）