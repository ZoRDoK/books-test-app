'use strict'
const assert = require('assert')
const {reg} = require('../../utils/url-reg')

/**
 * Add one book
 *
 * @param {BooksRepository} repository
 * @returns {Function}
 */
module.exports = (repository) => async (ctx) => {
  const {title, description, date, imageUrl, authorId} = ctx.request.body

  assert(title.length > 0, 'Title must be non empty string')
  assert(description.length > 0, 'Description must be non empty string')
  assert(date.length === 10, 'Date must be in `YYYY-MM-DD` format')
  assert(reg.test(imageUrl), 'ImageUrl must be valid url link')
  assert(authorId > 0, 'Author if must be valid number')

  await repository.add(title, description, date, authorId, imageUrl)

  ctx.body = { result: true }
}
