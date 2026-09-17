import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import routes from '../src/routes/index.js';

describe('PART 12: API Route Audit', () => {
  const app = express();
  app.use('/api', routes);

  function getRegisteredRoutes() {
    const routeList = [];

    function parseRegex(regexp) {
      if (!regexp) return '';
      const src = regexp.source;
      // If regex is ^\/prefix\/?(?=\/|$)
      const m = src.match(/^\^\\\/([a-zA-Z0-9_\-]+)/);
      if (m) return '/' + m[1];
      return '';
    }

    function extractRoutes(stack, prefix = '') {
      stack.forEach((middleware) => {
        if (middleware.route) {
          let routePath = middleware.route.path;
          if (routePath === '/') routePath = '';
          const fullPath = (prefix + routePath) || '/';
          const methods = Object.keys(middleware.route.methods).map((m) => m.toUpperCase());
          methods.forEach((method) => {
            routeList.push({ method, path: fullPath });
          });
        } else if (middleware.name === 'router' && middleware.handle.stack) {
          const subPrefix = parseRegex(middleware.regexp);
          extractRoutes(middleware.handle.stack, prefix + subPrefix);
        }
      });
    }

    extractRoutes(app._router.stack);
    return routeList;
  }

  const expectedRoutes = [
    // AUTH
    { method: 'POST', path: '/api/auth/register' },
    { method: 'POST', path: '/api/auth/login' },
    { method: 'POST', path: '/api/auth/logout' },
    { method: 'GET', path: '/api/auth/me' },
    { method: 'POST', path: '/api/auth/forgot-password' },
    // PROPERTIES
    { method: 'GET', path: '/api/properties' },
    { method: 'GET', path: '/api/properties/:id' },
    { method: 'POST', path: '/api/properties' },
    { method: 'PUT', path: '/api/properties/:id' },
    { method: 'DELETE', path: '/api/properties/:id' },
    // UNITS
    { method: 'GET', path: '/api/properties/:propertyId/units' },
    { method: 'GET', path: '/api/properties/:propertyId/units/:unitId' },
    { method: 'POST', path: '/api/properties/:propertyId/units' },
    { method: 'PUT', path: '/api/properties/:propertyId/units/:unitId' },
    { method: 'DELETE', path: '/api/properties/:propertyId/units/:unitId' },
    // LEASES
    { method: 'GET', path: '/api/leases' },
    { method: 'GET', path: '/api/leases/:id' },
    { method: 'POST', path: '/api/leases' },
    { method: 'PUT', path: '/api/leases/:id' },
    { method: 'DELETE', path: '/api/leases/:id' },
    { method: 'GET', path: '/api/tenant/lease' },
    // BILLS
    { method: 'POST', path: '/api/bills' },
    { method: 'GET', path: '/api/bills' },
    { method: 'GET', path: '/api/bills/:id' },
    { method: 'GET', path: '/api/tenant/bills' },
    // PAYMENTS
    { method: 'POST', path: '/api/payments' },
    { method: 'GET', path: '/api/payments' },
    { method: 'GET', path: '/api/payments/:id' },
    { method: 'PATCH', path: '/api/payments/:id/verify' },
    { method: 'GET', path: '/api/payments/:id/receipt' },
  ];

  it('All 29 specified routes are properly registered', () => {
    const registered = getRegisteredRoutes();
    for (const exp of expectedRoutes) {
      const match = registered.find(
        (r) => r.method === exp.method && r.path === exp.path
      );
      assert.ok(match, `Expected route not found: ${exp.method} ${exp.path}`);
    }
  });
});
