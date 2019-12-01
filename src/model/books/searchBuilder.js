const { pipe } = require('ramda')

const {
  byWord,
  after,
  before,
  limit,
  offset,
  sortAll
} = require('./helpers/where')

/**
 *
 *
 * @param {{
 *    [word]: string,
 *    [before]: 'string',
 *    [after]: 'string'
 *   }} [filters]
 * @param {{field: string, desc: boolean}[]} [sortBy]
 * @param {number} offsetVal
 * @param {number} limitVal
 *
 * @returns {[string, array]}
 */
module.exports.builder = (filters = {}, sortBy = [], offsetVal, limitVal) => {
  const methods = []

  if (filters.word) methods.push(byWord(filters.word))
  if (filters.after) methods.push(before(filters.after))
  if (filters.before) methods.push(after(filters.before))

  if (sortBy.length) methods.push(sortAll(sortBy))

  if (offsetVal) methods.push(offset(offsetVal))
  if (limitVal) methods.push(limit(limitVal))

  if (!methods.length) {
    return {
      sql: '',
      params: []
    }
  }

  const builder = pipe(...methods)({})

  builder.sql = ''

  if (builder.where && builder.where.length) builder.sql += ` WHERE ${builder.where.join(' AND ')} `
  if (builder.sortBy && builder.sortBy.length) builder.sql += `ORDER BY ${builder.sortBy.join(' , ')} `
  if (builder.limit) builder.sql += 'LIMIT ? '
  if (builder.offset) builder.sql += 'OFFSET ? '

  return builder
}
