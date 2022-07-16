import request from 'supertest';
import app from '../../app';

const defaultPort = '5000';
const address = `http://localhost:${defaultPort}`;

describe('Simple Tests', () => {
  app.start(defaultPort);

  const requestApp = request(address);
  let userId: string | undefined;

  it('Shoulde return no users', (done) => {
    requestApp
      .get('/api/users')
      .send()
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ "users": [] });
        return done();
      });
  });

  it('Shoulde create user', async () => {
    const res = await requestApp
      .post('/api/users')
      .send({ username: 'john', hobbies: [], age: 22 })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .expect(201);

    userId = res.body['id'];

    expect(res.body['id']).toEqual(userId);
  });

  it('Shoulde update user', (done) => {
    requestApp
      .put(`/api/users/${userId}`)
      .send({ username: 'john', hobbies: [], age: 30 })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body['age']).toEqual(30);
        return done();
      });
  });

  it('Shoulde get user', (done) => {
    requestApp
      .get(`/api/users/${userId}`)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body['age']).toEqual(30);
        return done();
      });
  });

  it('Shoulde delete user', (done) => {
    requestApp
      .delete(`/api/users/${userId}`)
      .expect('Content-Type', 'none')
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('Shoulde get user after delete', (done) => {
    requestApp
      .get(`/api/users/${userId}`)
      .expect('Content-Type', 'application/json')
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
