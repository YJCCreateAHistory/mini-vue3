// let target = {
//     name:"xxx",
//     get p1(){
//         console.log(this)
//         return this.name
//     }
// }
// const proxy = new Proxy(target, {
// 	get(target, key, receiver){
//         console.log(1)
//         // 去代理对象上取值
//         return Reflect.get(target, key, receiver)// 这里执行了一个操作，确保取值时的this是指向receiver的
//     },
//     set(target, value, key, receiver) {
// 		// 去代理对象上设置值
//         return Reflect.set(target, value, key, receiver)
//     }
// })
// proxy.p1 // 触发Proxy
let target = {
    name:"xxx",
    get p1(){
        console.log(this)
        return this.name
    }
}
const proxy = new Proxy(target, {
    // 接收三个参数
    // target:数据对象
    // receiver:当前代理对象
	get(target, key, receiver){
        console.log(1)
        return target[key]
    },
    set(target, value, key, receiver) {
        // 设置值
        target[key]=value
        return true
    }
})
proxy.p1 // 触发Proxy