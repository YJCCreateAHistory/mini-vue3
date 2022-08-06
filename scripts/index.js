// node scripts/index.js reactivity -f global

const args = require("minimist")(process.argv.slice(2));// 打包
const { build } = require("esbuild");
// 解析路径
const {resolve} = require("path") 
// minimist用来解析命令行参数
// 给定默认参数
const target = args._[0] || "reactivity"; 
// 指定打包格式
const format = args.f || "global"; 
// 取出配置，开发环境只打包一个
const pkg = require(resolve(__dirname,`../packages/${target}/package.json`))
// 输出格式:是global就是life，否则是否为cjs，否则为esm
// iife立即执行函数
const outFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? "cjs" : "esm"
// 输出文件
const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)
build({
    // 告诉打包的入口，这个目录下的index.ts
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.js`)],
    // 输出文件
    outfile,
    // 把所有的包全部打包到一起
    bundle:true,
    // 需要这个sourcemap
    sourcemap:true,
    // 打包格式
    format:outFormat,
    // 打包的全局名字
    globalName:pkg.buildOptions?.name,
    // 平台是浏览器还是node
    platform:format === "cjs" ? "node" : "browser",
    // 监控文件变化
    watch:{
        onRebuild(error) {
            if(!error) console.log("rebuild......")
        }
    }

}).then(()=>{
    console.log("watching.........");
})
