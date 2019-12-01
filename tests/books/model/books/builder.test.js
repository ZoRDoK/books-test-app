const { builder } = require('../../../../src/model/books/searchBuilder')

const BUILDER_CATCHED = {
  where:
    [ 'MATCH(title, description) AGAINST(?)',
      '`published_at` <= ?',
      '`published_at` >= ?' ],
  params: [ 'pol', '2019-09-10', '2019-10-01', 'title', 10, 1 ],
  sortBy: ['?? DESC'],
  offset: true,
  limit: true,
  sql: ' WHERE MATCH(title, description) AGAINST(?) '+
       'AND `published_at` <= ? '+
       'AND `published_at` >= ? '+
       'ORDER BY ?? DESC '+
       'LIMIT ? '+
       'OFFSET ? '
}

describe('Books builder test', function () {
  it ('smoke', () => {
    const builderObj = builder(
      {word: 'pol', before: '2019-10-01', after: '2019-09-10'},
      [{field: 'title', isDesc: true}],
      10,
      1
    );

    expect(builderObj).toMatchObject(BUILDER_CATCHED)
  })
})
