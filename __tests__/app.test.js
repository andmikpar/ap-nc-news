const request = require('supertest');
const sorted = require('jest-sorted');
const app = require('../app/app');

const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

const db = require('../db/connection');
const { expect } = require('@jest/globals');

afterAll(() => db.end());

beforeEach(() => seed(testData));

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

  test('status 404 and message not found when path incorrect', () => {
    return request(app)
      .get('/api/topical')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('Not Found');
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
        expect(article[0]).toEqual(
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
