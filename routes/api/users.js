const Router = require('koa-router')
const router = new Router()
const gravatar = require('gravatar')
const tools = require('../../config/tools')
const bcrypt = require('bcryptjs') 
//引入User
const User = require('../../models/User')
const jwt = require('jsonwebtoken') //用于生成token
const keys = require('../../config/keys')
const validateInput = require('../../vailidation/regestier')

/**
 * @route GET api/user/test
 * @desc 测试接口
 * @access 接口是公开的
 */
router.get('/test', async ctx =>{
    ctx.status = 200
    ctx.body = {msg: 'users works...'}
})

/**
 * @route POST api/user/register
 * @desc 注册接口
 * @access 接口是公开的
 */
router.post('/register', async ctx =>{
    const validatedResults = validateInput(ctx.request.body)
    const result = Object.values(validatedResults)
    for(let i = 0;i<result.length;i++){
        if(result[i] !== true){
            ctx.body = validatedResults
            return
        }
    }
    //查找当前注册信息是否存在在数据库中
    const findResult = await User.find({email:ctx.request.body.email})
    //存到数据库
    if(findResult.length > 0){
        ctx.status = 500,
        ctx.body = {email: '邮箱已注册'}
    }else{
        const avatar = gravatar.url(ctx.request.body.email, {s:'200', r:'pg', d:'mm'}) //r:'pg'头像格式,d:404会跳转一个404页面，但是我们想给一个默认头像，所以用mm     
        const newUser = new User({
            name:ctx.request.body.name,
            email:ctx.request.body.email,
            avatar,
            password: tools.enbcrypt(ctx.request.body.password),
        })

        await newUser.save().catch(error=>{
            console.log(error)
        })

        ctx.body = newUser
    }
})
/**
 * @router POST api/users/login
 * @desc 登录接口地址 返回token
 * @access 接口是公开的
 */
router.post('/login',async ctx =>{
    const validatedResults = validateInput(ctx.request.body)
    const result = Object.values(validatedResults)
    for(let i = 0;i<result.length;i++){
        if(result[i] !== true){
            ctx.body = validatedResults
            return
        }
    }
    //查询是否已经注册
    const findResult = await User.find({email:ctx.request.body.email})
    const password = ctx.request.body.password
    const user = findResult[0]
    if(findResult.length === 0){
        ctx.status = 404
        ctx.body = {msg:'email 不存在 请先注册'}
    }else{
        //验证密码
        const result = bcrypt.compareSync(password, user.password)
        if(result){
            //返回token
            const payload = {id:user.id, name: user.name, avatar: user.avatar}
            const token = jwt.sign(payload, keys.keyOrSecret, {expiresIn:3600}) //内容 加密方式 过期时间

            ctx.status = 200
            ctx.body = {msg:'success',token: "Bearer " + token}
        }else{
            ctx.status = 400
            ctx.body = {msg:'密码错误'}    
        }
    }
})

/**
 * @router POST api/users/current
 * @desc 用户信息接口地址 返回用户信息
 * @access 接口是私有的
 */                         //验证token
router.get('/current', async ctx =>{
    const token = ctx.request.headers.authorization.split(' ')[1] //要把前面的Bearer 去掉
    const decode = jwt.verify(token,keys.keyOrSecret)
    const user = await User.findById(decode.id)
    ctx.body = {
        id:user.id,
        name:user.name,
        avatar:user.avatar,
        date:user.date
    }
})


module.exports = router.routes()