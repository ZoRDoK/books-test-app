**Overview**

Api REST service is able to add and update database of authors and books. 
You can search the book table

Database contains two tables:

* authors: id, fullname
* books: id, author_id, title, description, published_at, image_url

**Install**

Docker and docker-compose can be installed by
these links:

* https://docs.docker.com/install/
* https://docs.docker.com/compose/install/

**Start**

```shell
npm i
sudo docker-compose up
```

Or you can start it up as a daemon

```shell
npm i
sudo docker-compose up
```

Containers will start, after that docker-compose will run database generation which takes a few seconds. 
After this tests will be run.
When tests pass, the REST API service will be established on port 3000

You'll be able to connect to database after the service starts. Mysql will listen on port 13306.

**Routes**

* GET / 
> returns 200, for a checking purpose
* POST /books/search
```
 {
   "filters": {
     "word": string, // by title and description in the books
     "after": string, // '2010-10-01'
     "before": string, // '2019-10-01'
   },
   "sortBy": [{field: string, isDesc: boolean}...], // Array of sorting params
   "offset": number,
   "limit": number
}
```
* POST /books
* PUT /books/:id
* POST /authors
* PUT /authors/:id

**Troubleshooting**

Check if you have services running on ports 3000 and 13306.
Shutdown them or change ports in docker-compose.yml
 
