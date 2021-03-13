const koa = require("koa")
const Router = require("koa-router")
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser') //用来获取前端数据的 
const passport = require('koa-passport') //解析token

//实例化
const app = new koa()
const router = new Router()

app.use(bodyParser())

//引入users.js
const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')
const records = require('./routes/api/records')
//路由
router.get('/', ctx => {
    ctx.body = { msg: 'Hello koa interface' }
})

//config
const db = require('./config/keys').mongoURI

//配置路由 地址 users里面的router.get 作用是写返回的内容
router.use('/api/users', users)
router.use('/api/profiles', profiles)
router.use('./api/records', records)
//连接数据库
// mongoose
//     .connect(
//         db,
//         {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         })
//     .then(() => {
//         console.log('db connetced')
//     })
//     .catch((error) => {
//         console.log(error)
//     })

app.use(passport.initialize())
app.use(passport.session())

//回调到config文件中 passport.js文件中
require('./config/passport')(passport)

//配置路由
app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`server started on ${port}`)
})