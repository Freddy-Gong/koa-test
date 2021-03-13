const Router = require('koa-router')
const router = new Router()
const Profiles = require('../../models/Profiles')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
/**
 * @route GET api/profiles/test
 * @desc 测试接口
 * @access 接口是公开的
 */
router.get('/test', async ctx => {
    ctx.status = 200
    ctx.body = { msg: 'profile works...' }
})

/**
 * @route GET api/profiles
 * @desc 个人信息接口地址
 * @access 接口是公开的
 */
router.get('/', async ctx => {
    const token = ctx.request.headers.authorization.split(' ')[1] //要把前面的Bearer 去掉
    const decode = jwt.verify(token, keys.keyOrSecret)
    if (decode) {
        const profile = await Profiles.find({ user: decode.id }).populate('user', ['name', 'avatar'])

        if (profile) {
            ctx.status = 200
            ctx.body = profile
        } else {
            ctx.status = 404
            ctx.body = { noprofile: '该用户没有任何信息' }
        }
    }
})
/**
 * @route GET api/profiles
 * @desc 添加或者更新信息接口地址
 * @access 接口是私有的
 */
router.post('/', async ctx => {
    const token = ctx.request.headers.authorization.split(' ')[1] //要把前面的Bearer 去掉
    const decode = jwt.verify(token, keys.keyOrSecret)
    if (decode) {

        let profileFiles = {}
        profileFiles.user = decode.id
        const content = ctx.request.body
        console.log(content)
        profileFiles = { ...profileFiles, ...content }
        console.log(profileFiles)
        //查询
        const profile = await Profiles.find({ user: decode.id })
        if (profile.length > 0) {
            const profileUpdate = await Profiles.findOneAndUpdate(
                { user: decode.id },
                { $set: profileFiles },
                { new: true }
            )
            ctx.body = profileUpdate
        } else {
            await new Profiles(profileFiles).save()
            ctx.status = 200
            ctx.body = profileFiles
        }
    }
})

module.exports = router.routes()

