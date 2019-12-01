'use strict'

const Router = require('@koa/router')
const koaBody = require('koa-body');
const {promisify} = require('util')
const {db} = require('./utils/db')
const {redis} = require('./utils/redis')

const {builder} = require('./model/books/searchBuilder')
const {SearchCache} = require('./model/books/searchCache')
const {BooksRepository} = require('./model/books/repository')
const {AuthorsRepository} = require('./model/authors/repository')

const pingPong = require('./handlers/ping-pong')
const search = require('./handlers/books/search')
const bookAdd = require('./handlers/books/add')
const bookUpdate = require('./handlers/books/update')
const authorAdd = require('./handlers/authors/add')
const authorUpdate = require('./handlers/authors/update')

const router = new Router()

const query = promisify(db.query).bind(db);

const bookRep = new BooksRepository(query, builder)
const authorRep = new AuthorsRepository(query)
const searchCache = new SearchCache(redis)

router
  .get('/', pingPong())
  .post('/books/search', koaBody(), search(bookRep, searchCache))
  .post('/books', koaBody(), bookAdd(bookRep))
  .put('/books/:id', koaBody(), bookUpdate(bookRep))
  .post('/authors', koaBody(), authorAdd(authorRep))
  .put('/authors/:id', koaBody(), authorUpdate(authorRep))

module.exports.router = router
