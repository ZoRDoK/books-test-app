'use strict'
const assert = require('assert')

/**
 * Add author
 *
 * @param {AuthorsRepository} repository
 * @returns {Function}
 */
module.exports = (repository) => async (ctx) => {
  const {fullname} = ctx.request.body

  assert(fullname.length > 0, 'Fullname must be non empty string')

  await repository.add(fullname)

  ctx.body = { result: true }
}
