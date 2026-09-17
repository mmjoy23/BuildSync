import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../src/services/auth.service.js';
import { requireRole } from '../src/middleware/auth.middleware.js';
import prisma from '../src/config/prisma.js';

describe('PART 3: Authentication & Authorization Tests', () => {
  const testEmail = `test.user.${Date.now()}@buildsync.com`;
  let createdUserId = null;

  it('1. Register creates a user with a hashed password', async () => {
    const res = await AuthService.register({
      name: 'Test Tenant User',
      email: testEmail,
      password: 'password123',
      phone: '01700000999',
      role: 'TENANT',
    });

    assert.ok(res.token, 'Expected JWT token to be generated');
    assert.ok(res.user, 'Expected user object in response');
    assert.equal(res.user.email, testEmail);
    createdUserId = res.user.id;

    const dbUser = await prisma.user.findUnique({ where: { id: createdUserId } });
    assert.ok(dbUser.passwordHash.startsWith('$2'), 'Password hash must be a bcrypt hash');
    assert.notEqual(dbUser.passwordHash, 'password123', 'Password must not be stored in plain text');
  });

  it('2. Password is not returned in the API response', async () => {
    const res = await AuthService.login({
      email: testEmail,
      password: 'password123',
    });
    assert.strictEqual(res.user.passwordHash, undefined, 'passwordHash must not exist on user object');
    assert.strictEqual(res.user.password, undefined, 'password must not exist on user object');
  });

  it('3. Login succeeds with valid credentials', async () => {
    const res = await AuthService.login({
      email: testEmail,
      password: 'password123',
    });
    assert.ok(res.token, 'Login should return a valid JWT token');
    assert.equal(res.user.email, testEmail);
  });

  it('4. Login rejects invalid credentials', async () => {
    await assert.rejects(
      async () => {
        await AuthService.login({
          email: testEmail,
          password: 'wrongpassword',
        });
      },
      (err) => {
        assert.equal(err.statusCode, 401);
        assert.equal(err.message, 'Invalid email or password');
        return true;
      }
    );
  });

  it('5. /me (getCurrentUser) requires valid user session', async () => {
    const currentUser = await AuthService.getCurrentUser(createdUserId);
    assert.equal(currentUser.id, createdUserId);
    assert.equal(currentUser.passwordHash, undefined);

    await assert.rejects(
      async () => {
        await AuthService.getCurrentUser('00000000-0000-0000-0000-000000000000');
      },
      (err) => {
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });

  it('6. Role middleware blocks unauthorized roles', () => {
    const ownerMiddleware = requireRole('OWNER');
    const mockReq = { user: { id: createdUserId, role: 'TENANT' } };
    let statusSent = null;
    let jsonSent = null;
    const mockRes = {
      status: (code) => {
        statusSent = code;
        return {
          json: (data) => {
            jsonSent = data;
          },
        };
      },
    };
    let nextCalled = false;
    ownerMiddleware(mockReq, mockRes, () => { nextCalled = true; });

    assert.equal(nextCalled, false, 'next() must NOT be called for unauthorized role');
    assert.equal(statusSent, 403, 'Role check should return 403 Forbidden');
    assert.equal(jsonSent.success, false);
  });

  it('7. Admin registration restriction remains intact', async () => {
    await assert.rejects(
      async () => {
        await AuthService.register({
          name: 'Hacker Admin',
          email: `fakeadmin.${Date.now()}@buildsync.com`,
          password: 'password123',
          role: 'ADMIN',
        });
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.equal(err.message, 'Administrator accounts cannot be registered publicly.');
        return true;
      }
    );
  });

  // Cleanup created test user
  it('Cleanup temporary test auth user', async () => {
    if (createdUserId) {
      await prisma.user.delete({ where: { id: createdUserId } });
    }
  });
});
