const {pipe} = require('ramda')
const {before, after, byWord, byDate, sortBy, sortAll, offset, limit } = require('../../../src/model/books/helpers/where')

const CATCHED = {
  where:
    [ '`published_at` <= ?',
      '`published_at` >= ?',
      'MATCH(title, description) AGAINST(?)' ],
  params: [ '2019-10-01', '2019-09-10',  'pol' ]
}
const CATCHED_OFFSET = {
  where:
    [ '`published_at` <= ?',
      '`published_at` >= ?',
      'MATCH(title, description) AGAINST(?)' ],
  params: [ '2019-10-01', '2019-09-10', 'pol', 10, 1 ],
  offset: true,
  limit: true
}
const SORTED = {
  where:
    [ '`published_at` <= ?',
      '`published_at` >= ?',
      'MATCH(title, description) AGAINST(?)' ],
  params: [ '2019-10-01', '2019-09-10', 'pol', 'title' ],
  sortBy: ['?? DESC']
}

const SORTED_ALL = {
  where:
    [ '`published_at` <= ?',
      '`published_at` >= ?',
      'MATCH(title, description) AGAINST(?)' ],
  params: [ '2019-10-01', '2019-09-10', 'pol', 'title', 'published_at', 'fullname'],
  sortBy: ['?? DESC', '?? ASC', '?? DESC']
}

describe('Books helper `where`', function () {
  it('smoke', () => {
    const addWhere = pipe(byDate('2019-10-01', '2019-09-10'), byWord('pol'))

    expect(addWhere({})).toMatchObject(CATCHED)

    const addWhere2 = pipe(before('2019-10-01'), after('2019-09-10'), byWord('pol'))

    expect(addWhere2({})).toMatchObject(CATCHED)
  })

  it ('sortBy', () => {
    const addWhere = pipe(byDate('2019-10-01', '2019-09-10'), byWord('pol'), sortBy({field: 'title', isDesc: true}))

    expect(addWhere({})).toMatchObject(SORTED)
  })
  it ('sortaLL', () => {
    const addWhere = pipe(byDate('2019-10-01', '2019-09-10'), byWord('pol'), sortAll(
      [
        {field: 'title', isDesc: true},
        {field: 'published_at', isDesc: false},
        {field: 'fullname', isDesc: true}
      ]))

    expect(addWhere({})).toMatchObject(SORTED_ALL)
  })

  it ('offset and limit', () => {
    const addWhere = pipe(byDate('2019-10-01', '2019-09-10'), byWord('pol'), offset(10), limit(1))

    expect(addWhere({})).toMatchObject(CATCHED_OFFSET)
  })
})
