const Redis = require('ioredis')

module.exports.redis = new Redis(6379, 'redis')
