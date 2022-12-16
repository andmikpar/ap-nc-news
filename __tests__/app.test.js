const request = require('supertest');
const sorted = require('jest-sorted');
const app = require('../app/app');

const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

const db = require('../db/connection');
const { expect } = require('@jest/globals');

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe('app.all Bad Path', () => {
  test('status 404 and message not found when path incorrect', () => {
    return request(app)
      .get('/api/articled')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('Not Found');
      });
  });
});

describe('GET/api/topics', () => {
  test('status 200, returns an array of object in correct format', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((result) => {
        const topics = result.body.topics;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe('GET/api/articles', () => {
  test('status 200, returns an array of article objects in correct format', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((result) => {
        const articles = result.body.articles;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test('results should be sorted by date in descending order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((results) => {
        const articles = results.body.articles;
        expect(articles).toBeSortedBy('created_at', { descending: true });
      });
  });

  test('should return status 404 and error message when path is incorrect', () => {
    return request(app)
      .get('/api/articled')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('Not Found');
      });
  });
});

describe('GET/api/articles/:article_id', () => {
  test('status 200, responds with article object', () => {
    return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 3,
          })
        );
      });
  });
  test('status 400 when article_id is invalid ', () => {
    return request(app)
      .get('/api/articles/three')
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Bad Request');
      });
  });
  test('status 404 when article_id is valid but not in database', () => {
    return request(app)
      .get('/api/articles/300')
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Not Found');
      });
  });
});

describe('GET/api/articles/:article_id/comments', () => {
  test('status 200, returns an array of comments with correct properties', () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(2);
        expect(comments[0]).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          })
        );
      });
  });
  test('comments are ordered by most recent', () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy('created_at', { descending: true });
      });
  });
  test('status 200 and empty array when article has no comments', () => {
    return request(app)
      .get('/api/articles/11/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test('status 400 when article_id is invalid ', () => {
    return request(app)
      .get('/api/articles/one/comments')
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Bad Request');
      });
  });

  test('status 404 when article_id is valid but not in database', () => {
    return request(app)
      .get('/api/articles/56/comments')
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Not Found');
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('status 200, returns posted comment', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'Really good article',
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(200)
      .then(({ body }) => {
        const { addedComment } = body;
        expect(addedComment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: 'Really good article',
            votes: expect.any(Number),
            author: 'butter_bridge',
            article_id: 3,
            created_at: expect.any(String),
          })
        );
      });
  });

  test('status 400, when article_id is invalid', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'Really good article',
    };
    return request(app)
      .post('/api/articles/banana/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Bad Request');
      });
  });
  test('status 404, when article_id is valid but not in database', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'Really good article',
    };
    return request(app)
      .post('/api/articles/32/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Not Found');
      });
  });
  test('status 400 when request has invalid key', () => {
    const newComment = {
      usedname: 'butter_bridge',
      body: 'Really good article',
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Bad Request');
      });
  });
  test('status 400 when request body contains invalid value', () => {
    const newComment = {
      username: 'butter_bridge',
      body: undefined,
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Bad Request');
      });
  });

  test('status 404 when given username not found', () => {
    const newComment = {
      username: 'johnSmith',
      body: 'Really good article',
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Not Found');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('status 200, returns updated article when votes are being added', () => {
    const patchBody = { inc_votes: 10 };
    return request(app)
      .patch('/api/articles/1')
      .send(patchBody)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: 110,
          })
        );
      });
  });

  test('status 200, returns updated article when votes are being taken away', () => {
    const patchBody = { inc_votes: -10 };
    return request(app)
      .patch('/api/articles/1')
      .send(patchBody)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: 90,
          })
        );
      });
  });

  test('status 400 when article_id is invalid', () => {
    const patchBody = { inc_votes: 10 };
    return request(app)
      .patch('/api/articles/bananas')
      .send(patchBody)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Bad Request');
      });
  });

  test('status 404 when article_id is valid but not in database', () => {
    const patchBody = { inc_votes: 10 };
    return request(app)
      .patch('/api/articles/93')
      .send(patchBody)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Not Found');
      });
  });

  test('status 400 and error message when request body has invalid key', () => {
    const patchBody = { add_votes: 10 };
    return request(app)
      .patch('/api/articles/1')
      .send(patchBody)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Bad Request');
      });
  });

  test('status 400 and error message when request body has invalid value', () => {
    const patchBody = { inc_votes: 'twelve' };
    return request(app)
      .patch('/api/articles/1')
      .send(patchBody)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Bad Request');
      });
  });
});

describe('GET/api/users', () => {
  test('status 200, returns an array of user objects', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe('10. GET /api/articles (queries)', () => {
  test('status 200, returns array of articles with topic specified in query', () => {
    return request(app)
      .get('/api/articles?topic=cats')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: 'cats',
            })
          );
        });
      });
  });

  test('status 200 and empty array when topic exists but no articles match', () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual([]);
      });
  });

  test('status 200, returns articles sorted by specified column', () => {
    return request(app)
      .get('/api/articles?sorted_by=article_id')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy('article_id', { descending: true });
      });
  });
  test('status 200, returns appropriate items when given query and sort by ', () => {
    return request(app)
      .get('/api/articles?topic=mitch&sorted_by=article_id')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(11);
        expect(articles).toBeSortedBy('article_id', { descending: true });

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: 'mitch',
            })
          );
        });
      });
  });
  test('status 200, results are ordered by ascending when specified', () => {
    return request(app)
      .get('/api/articles?sorted_by=article_id&ordered_by=asc')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy('article_id', { ascending: true });
      });
  });
  test('status 200, results are ordered by descending by default', () => {
    return request(app)
      .get('/api/articles?sorted_by=article_id')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy('article_id', { descending: true });
      });
  });
  test('status 404 and error message when query topic doesnt exist', () => {
    return request(app)
      .get('/api/articles/?topic=sport')
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Not Found');
      });
  });
  test('status 400 and error message when sort_by column doesnt exist', () => {
    return request(app)
      .get('/api/articles/?sorted_by=length')
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Bad Request');
      });
  });
  test('status 400 and error messge when order is invalid', () => {
    return request(app)
      .get('/api/articles/?ordered_by=alphabetical')
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Bad Request');
      });
  });
});

describe(' GET /api/articles/:article_id (comment count)', () => {
  test('status 200, responds with correct article and includes comment count when article has comments', () => {
    return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 3,
            comment_count: '2',
          })
        );
      });
  });
  test('status 200, responds with correct article and includes comment count when comment count is 0', () => {
    return request(app)
      .get('/api/articles/7')
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 7,
            comment_count: '0',
          })
        );
      });
  });
});
