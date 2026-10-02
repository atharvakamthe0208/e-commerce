import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';

describe('Express REST API Endpoints & Route Security', () => {
  it('GET /api/health should return status ok', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
    assert.strictEqual(res.body.service, 'e-commerce-backend');
  });

  it('Unknown routes should return 404 with errorMiddleware', async () => {
    const res = await request(app).get('/api/non-existent-endpoint');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.match(res.body.message, /Not Found/);
  });

  describe('Unauthenticated Access Control (401 Unauthorized)', () => {
    it('POST /api/categories without token should return 401', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Gadgets' });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.success, false);
      assert.match(res.body.message, /Not authorized/);
    });

    it('PUT /api/categories/:id without token should return 401', async () => {
      const res = await request(app)
        .put('/api/categories/507f1f77bcf86cd799439011')
        .send({ name: 'Gadgets' });
      assert.strictEqual(res.status, 401);
    });

    it('DELETE /api/categories/:id without token should return 401', async () => {
      const res = await request(app)
        .delete('/api/categories/507f1f77bcf86cd799439011');
      assert.strictEqual(res.status, 401);
    });

    it('POST /api/products without token should return 401', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Laptop' });
      assert.strictEqual(res.status, 401);
    });

    it('POST /api/orders without token should return 401', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ items: [] });
      assert.strictEqual(res.status, 401);
    });

    it('GET /api/orders/my-orders without token should return 401', async () => {
      const res = await request(app).get('/api/orders/my-orders');
      assert.strictEqual(res.status, 401);
    });

    it('GET /api/admin/orders without token should return 401', async () => {
      const res = await request(app).get('/api/admin/orders');
      assert.strictEqual(res.status, 401);
    });

    it('PATCH /api/admin/orders/:id/status without token should return 401', async () => {
      const res = await request(app)
        .patch('/api/admin/orders/507f1f77bcf86cd799439011/status')
        .send({ status: 'Confirmed' });
      assert.strictEqual(res.status, 401);
    });
  });
});
