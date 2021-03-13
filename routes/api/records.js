const Router = require('koa-router')
const router = new Router()
const Profiles = require('../../models/Profiles')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')

router.get('/test', async ctx => {
    console.log(1)
    ctx.status = 200
    ctx.body = { msg: 'records works...' }
})

module.exports = router.routes()