'use strict'

const {pipe, concat, mergeWith, compose, flip, defaultTo, map, mapAccum} = require('ramda')

const update = flip(mergeWith(concat))

const before = (before) => update({
  where: ['`published_at` <= ?'],
  params: [before]
})

const after = (after) => update({
  where: ['`published_at` >= ?'],
  params: [after]
})

const byWord = (word) => update({
  where: ['MATCH(title, description) AGAINST(?)'],
  params: [word]
})

const byDate = (dateBefore, dateAfter) => pipe(before(dateBefore), after(dateAfter))

const sortBy = ({field, isDesc}) => update({
  sortBy: [`?? ${isDesc ? 'DESC' : 'ASC'}`],
  params: [field]
})

const sortAll = (fields) => pipe(defaultTo({}), ...map(sortBy, fields))

const offset = (offset) => update({ offset: true, params: [offset] })
const limit = (limit) => update({ limit: true, params: [limit] })

module.exports = {
  before,
  after,
  byDate,
  byWord,
  sortBy,
  sortAll,
  offset,
  limit,
}
