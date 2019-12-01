'use strict'

const crypto = require('crypto')

const keyGen = (data) => crypto
  .createHash("sha256")
  .update(JSON.stringify(data))
  .digest("hex");

/**
 * Search by books database
 *
 * @param {BooksRepository} repository
 * @param {SearchCache} searchCache
 * @returns {Function}
 */
module.exports = (repository, searchCache) => async (ctx) => {
  const {filters, sortBy, offset, limit} = ctx.request.body

  const cacheKey = keyGen({filters, sortBy, offset, limit});
  const cachedData = await searchCache.getOrSave(
    cacheKey,
    async () => {
      const count = await repository.countAll()
      const dataset = await repository.search(filters, sortBy, limit, offset)

      const info = {filters, sortBy, offset, limit, count}

      return {dataset, info}
    }
  )

  ctx.body = cachedData
}
