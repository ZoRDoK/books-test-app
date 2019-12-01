class BooksRepository {
  constructor (query, searchBuilder) {
    this._TABLE_BOOKS = 'books'
    this._TABLE_AUTHORS = 'authors'
    this._query = query
    this._searchBuilder = searchBuilder

    this._SQL_ALL = `     
      FROM ${this._TABLE_BOOKS} AS b
      INNER JOIN ${this._TABLE_AUTHORS} AS a
        ON a.id = b.author_id            
    `
  }

  async countAll () {
    const sql = `SELECT COUNT(*) as cnt ${this._SQL_ALL}`

    const [{ cnt }] = await this._query(sql)

    return cnt
  }

  async search (filters, sortBy, limit, offset) {
    const builder = this._searchBuilder(filters, sortBy, offset, limit)

    const sql = `SELECT b.id, title, published_at, description, fullname, image_url ${this._SQL_ALL} ${builder.sql}`

    return this._query(sql, builder.params)
  }

  async add (title, description, date, authorId, imageUrl) {
    const sql = `INSERT INTO ${this._TABLE_BOOKS}
                   (title, description, published_at, author_id, image_url)
                 VALUES (?, ?, ?, ?, ?)`

    return this._query(sql, [title, description, date, authorId, imageUrl])
  }

  async update (id, title, description, date, authorId, imageUrl) {
    const sql = `UPDATE ${this._TABLE_BOOKS}
                 SET title = ?, description = ?, published_at = ?, author_id = ?, image_url = ?
                 WHERE id = ?`

    return this._query(sql, [title, description, date, authorId, imageUrl, id])
  }
}

module.exports.BooksRepository = BooksRepository
