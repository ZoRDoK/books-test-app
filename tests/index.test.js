const st = require('supertest')
const http = require('http')
const { app } = require('../src/app')

const req = st(http.createServer(app.callback()))

const TEST_BOOK = {
  title: 'blablabla',
  description: 'descdescdesc',
  imageUrl: 'http://lorempixel.com/abstract/480',
  date: '2019-02-02',
  authorId: 1,
}

const TEST_AUTHOR = {
  fullname: 'abracadabra'
}

describe ('Routes', () => {
  it('GET /', async () => {
    const response = await req.get('/').expect(200);

    expect(response.body.result).toBeTruthy()
  });

  it('POST /books/search', async () => {
    const response = await req
      .post('/books/search', )
      .send({ limit: 1 })
      .expect(200);

    const result = response.body

    expect(result).toHaveProperty('dataset')
    expect(result).toHaveProperty('info')
    expect(result.info.limit).toBe(1)

    const [row] = result.dataset

    expect(row).toHaveProperty('title')
  })

  it('POST /books', async () => {
    const responsePost = await req
      .post('/books')
      .send(TEST_BOOK)
      .expect(200);

    const response = await req
      .post('/books/search', )
      .send({ limit: 1, filters: { word: TEST_BOOK.title } })
      .expect(200);

    const result = response.body

    expect(result).toHaveProperty('dataset')
    expect(result).toHaveProperty('info')
    expect(result.info.limit).toBe(1)

    const [row] = result.dataset

    expect(row.title).toBe(TEST_BOOK.title)
    expect(row.description).toBe(TEST_BOOK.description)
    expect(row.published_at).toBe("2019-02-02T00:00:00.000Z")
    expect(row.image_url).toBe(TEST_BOOK.imageUrl)
  })

  it('PUT /books/4', async () => {
    const responsePut = await req
      .put('/books/4')
      .send(Object.assign({}, TEST_BOOK, {title: 'updating'}))
      .expect(200);

    const response = await req
      .post('/books/search', )
      .send({ limit: 1, filters: {word: 'updating'} })
      .expect(200);

    const result = response.body

    expect(result).toHaveProperty('dataset')
    expect(result).toHaveProperty('info')
    expect(result.info.limit).toBe(1)

    const [row] = result.dataset

    expect(row.id).toBe(4)
    expect(row.title).toBe('updating')
    expect(row.description).toBe(TEST_BOOK.description)
    expect(row.published_at).toBe("2019-02-02T00:00:00.000Z")
    expect(row.image_url).toBe(TEST_BOOK.imageUrl)
  })

  it('POST /authors', async () => {
    await req
      .post('/authors')
      .send(TEST_AUTHOR)
      .expect(200);
  });

  it('PUT /authors/4', async () => {
    await req
      .put('/authors/4')
      .send(TEST_AUTHOR)
      .expect(200);
  });

  it('Checked cached data POST /books/search', async () => {
    const get = async () =>  req
      .post('/books/search', )
      .send({ limit: 1 })
      .expect(200);

    await get()
    const response = await get()

    const result = response.body

    expect(result).toHaveProperty('dataset')
    expect(result).toHaveProperty('info')
    expect(result.info.limit).toBe(1)

    const [row] = result.dataset

    expect(row).toHaveProperty('title')

  })
})
