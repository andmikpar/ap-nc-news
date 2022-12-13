const request = require('supertest');
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
        const topics = result.body;
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
