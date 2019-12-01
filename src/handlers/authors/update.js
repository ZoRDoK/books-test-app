'use strict'
const assert = require('assert')

/**
 * Update author
 *
 * @param {AuthorsRepository} repository
 * @returns {Function}
 */
module.exports = (repository) => async (ctx) => {
  const {fullname} = ctx.request.body
  const  id = +ctx.params.id

  assert(id > 0, 'Id must be number')
  assert(fullname.length > 0, 'Fullname must be non empty string')

  await repository.update(id, fullname)

  ctx.body = { result: true }
}
