class AuthorsRepository {
  constructor (query) {
    this._TABLE = 'authors'
    this._query = query
  }

  async add (fullname) {
    const sql = `INSERT INTO ${this._TABLE}
                   (fullname)
                 VALUES (?)`

    return this._query(sql, [fullname])
  }

  async update (id, fullname) {
    const sql = `UPDATE ${this._TABLE}
                 SET fullname = ?
                 WHERE id = ? `

    return this._query(sql, [id, fullname])
  }
}

module.exports.AuthorsRepository = AuthorsRepository
