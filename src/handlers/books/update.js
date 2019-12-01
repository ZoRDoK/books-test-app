'use strict'
const assert = require('assert')

const {reg} = require('../../utils/url-reg')

/**
 * Update book
 *
 * @param {BooksRepository} repository
 * @returns {Function}
 */
module.exports = (repository) => async (ctx) => {
  const {title, description, date, imageUrl, authorId} = ctx.request.body
  const id = +ctx.params.id

  assert(id > 0, 'Id must be valid number')
  assert(title.length > 0, 'Title must be non empty string')
  assert(description.length > 0, 'Description must be non empty string')
  assert(date.length === 10, 'Date must be in `YYYY-MM-DD` format')
  assert(reg.test(imageUrl), 'ImageUrl must be valid url link')
  assert(authorId > 0, 'Author id must be valid number')

  await repository.update(id, title, description, date, authorId, imageUrl)

  ctx.body = { result: true }
}
