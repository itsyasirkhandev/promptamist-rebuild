/// <reference types="vite/client" />
import { convexTest } from 'convex-test';
import { expect, test, vi, beforeEach } from 'vitest';
import { api } from '../_generated/api';
import schema from '../schema';
import { PolarBillingProvider } from './provider';
import { POLAR_CONFIG } from './config';

// Mock Polar SDK
const mockCreateCustomer = vi.fn();
const mockCreateCheckout = vi.fn();
const mockCreatePortalSession = vi.fn();

vi.mock('@polar-sh/sdk', () => {
  return {
    Polar: class MockPolar {
      customers = {
        create: mockCreateCustomer,
      };
      checkouts = {
        create: mockCreateCheckout,
      };
      customerSessions = {
        create: mockCreatePortalSession,
      };
    },
  };
});

const modules = import.meta.glob('../**/*.ts');

beforeEach(() => {
  vi.clearAllMocks();
  process.env.POLAR_ACCESS_TOKEN = 'test_token';
  process.env.POLAR_ENVIRONMENT = 'sandbox';
});

test('PolarBillingProvider ensures customer and handles checkout generation', async () => {
  const t = convexTest(schema, modules);

  // 1. Create a user inside Convex
  await t.mutation(api.users.upsertFromClerk, {
    clerkId: 'clerk_456',
    email: 'bob@example.com',
    name: 'Bob Builder',
  });

  // 2. Set up mock return from Polar API
  mockCreateCustomer.mockResolvedValue({
    id: 'polar_cust_bob_999',
  });

  mockCreateCheckout.mockResolvedValue({
    url: 'https://checkout.polar.sh/success_url_123',
  });

  // 3. Authenticate query client
  const authedT = t.withIdentity({
    subject: 'clerk_456',
    email: 'bob@example.com',
  });

  // 4. Trigger actions to test BillingProvider integration
  const checkoutResult = await authedT.action(
    api.authed.polar.generateCheckoutUrl,
    {
      clientOrigin: 'http://localhost:3000',
    },
  );

  expect(checkoutResult.url).toBe('https://checkout.polar.sh/success_url_123');

  // Verify Polar customer creation SDK parameter checks
  expect(mockCreateCustomer).toHaveBeenCalledWith(
    expect.objectContaining({
      email: 'bob@example.com',
      externalId: 'clerk_456',
    }),
  );

  // Verify Polar checkout SDK parameter checks
  expect(mockCreateCheckout).toHaveBeenCalledWith(
    expect.objectContaining({
      customerId: 'polar_cust_bob_999',
      products: [POLAR_CONFIG.productId],
    }),
  );

  // Verify customer ID is correctly persisted back in Convex
  const userInfo = await t.query(api.private.users.getUserInfoForPolar, {
    clerkId: 'clerk_456',
  });
  expect(userInfo?.polarCustomerId).toBe('polar_cust_bob_999');
}, 30000);

test('PolarBillingProvider handles portal session generation', async () => {
  const t = convexTest(schema, modules);

  // 1. Create user and set existing polarCustomerId (skipping customer creation path)
  await t.mutation(api.users.upsertFromClerk, {
    clerkId: 'clerk_789',
    email: 'alice@example.com',
    name: 'Alice Wonder',
  });

  await t.mutation(api.users.savePolarCustomerIdInternal, {
    clerkId: 'clerk_789',
    polarCustomerId: 'polar_cust_alice_888',
  });

  // Mock portal session retrieval
  mockCreatePortalSession.mockResolvedValue({
    customerPortalUrl: 'https://billing.polar.sh/alice_portal_link',
  });

  // 2. Authenticate
  const authedT = t.withIdentity({
    subject: 'clerk_789',
    email: 'alice@example.com',
  });

  // 3. Trigger portal action
  const portalResult = await authedT.action(
    api.authed.polar.generatePortalUrl,
    {},
  );
  expect(portalResult.url).toBe('https://billing.polar.sh/alice_portal_link');

  // Verify customer create was NOT called because customer ID existed
  expect(mockCreateCustomer).not.toHaveBeenCalled();

  // Verify portal session SDK was called with the existing customer ID
  expect(mockCreatePortalSession).toHaveBeenCalledWith(
    expect.objectContaining({
      customerId: 'polar_cust_alice_888',
    }),
  );
}, 30000);
