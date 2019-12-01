const { BooksRepository } = require('../../../../src/model/books/repository')
const { db } = require('../../../../src/utils/db')
const { builder } = require('../../../../src/model/books/searchBuilder')
const { promisify } = require('util')

const query = promisify(db.query).bind(db)

describe('Books repository', function () {
  let repository = new BooksRepository(query, builder)

  it('smoke', async () => {
    const countAll = await repository.countAll()

    expect(countAll).toBe(1e5)
  })

  it('search', async () => {
    const rows = await repository.search({ word: 'autem', before: '2019-11-11' })

    expect(rows.length).toBeGreaterThan(1)
    expect(rows[0]).toHaveProperty('title')
    expect(rows[0]).toHaveProperty('description')
    expect(rows[0]).toHaveProperty('image_url')
    expect(rows[0]).toHaveProperty('fullname')
    expect(rows[0]).toHaveProperty('published_at')
    expect(`${rows[0].title} ${rows[0].description}`).toMatch('autem')
  })
})
