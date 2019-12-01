'use strict'

const Koa = require('koa')

const { router } = require('./router')
const { error } = require('./middlewares/error')

const app = new Koa()

app
  .use(error())
  .use(router.routes())
  .use(router.allowedMethods())

module.exports.app = app
