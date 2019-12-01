class SearchCache {
  constructor(redis) {
    this._redis = redis
    this._TTL = 60 // 1 minute
  }

  /*
   * Для нагруженного сервиса тут лучше сделать cacheLayer систему, которая будет ждать "подогрева" для всех
   * запросов после первого промаха мимо редиса
   */
  async getOrSave(key, cb) {
    const data = await this._redis.get(key);

    if (data) {
      return JSON.parse(data)
    }

    const newData = await cb()

    await this._redis.set(key, JSON.stringify(newData), "EX", this._TTL)

    return newData
  }
}

module.exports.SearchCache = SearchCache
