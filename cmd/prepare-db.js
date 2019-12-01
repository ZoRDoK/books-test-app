'use strict'

const {promisify} = require('util')
const { db } = require('../src/utils/db')
const faker = require('faker')

const query = promisify(db.query).bind(db);

const fill = async () => {
  const [{cnt}] = await query(`
    SELECT COUNT(*) as cnt
    FROM information_schema.tables 
    WHERE table_schema = '[myapp]' 
    AND table_name = '[authors]';
  `)

  if (cnt) {
    console.log('all databases already exists: ', cnt)
    // All tables already imported
    return process.exit()
  }

  await query(`
    DROP TABLE IF EXISTS books;
    DROP TABLE IF EXISTS authors;
    
    CREATE TABLE IF NOT EXISTS authors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullname VARCHAR(255)
    );
  
    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      published_at DATE,
      author_id INT,
      description TEXT,
      image_url TEXT,     
      FOREIGN KEY (author_id)
        REFERENCES authors (id)
        ON UPDATE CASCADE ON DELETE CASCADE
    );
    CREATE FULLTEXT INDEX books_title_description_idx ON books (title, description);
    CREATE INDEX books_date_idx ON books (published_at);
    CREATE FULLTEXT INDEX authors_fullname_idx ON authors (fullname);
  `);


  const valueAuthor = () => `(${db.escape(faker.name.findName())})`

  const authorsSQL = [...Array(1e2)].reduce(
    (acc, _) => `${acc}, ${valueAuthor()}`,
    `INSERT INTO authors (fullname) VALUES ${valueAuthor()}`
  )

  await query(authorsSQL)

  const valueBook = () => `(
    ${db.escape(faker.lorem.words(faker.random.number({max: 3, min: 1})))},
    ${db.escape(faker.date.past().toJSON().slice(0, 10))},    
    ${db.escape(faker.lorem.text())},
    ${faker.random.number({max: 1e2, min: 1})},
    '${faker.image.imageUrl('abstract')}'
  )`

  const getBooksSQL = (count) =>  [...Array(count - 1)].reduce(
    (acc, _) => `${acc}, ${valueBook()}`,
    `INSERT INTO books (title, published_at, description, author_id, image_url) VALUES ${valueBook()}`
  )


  for (let i = 0; i < 1e2; i++) {
    const booksBulkSql = getBooksSQL(1e3)

    await query(booksBulkSql)
  }
}

fill()
  .then(() => console.log('migration done') || process.exit())
  .catch(e => console.error(e))
