import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCheckoutSession, createCustomerPortalSession } from '../polar';
import { currentUser, auth, type User } from '@clerk/nextjs/server';

// 1. Define stable top-level mock functions with default Promise resolvers
const mockQuery = vi.fn().mockResolvedValue(null);
const mockMutation = vi.fn().mockResolvedValue(undefined);
const mockCustomersCreate = vi.fn().mockResolvedValue({ id: 'polar_cust_123' });
const mockCheckoutsCreate = vi
  .fn()
  .mockResolvedValue({ url: 'https://checkout.polar.sh/sess' });
const mockCustomerSessionsCreate = vi
  .fn()
  .mockResolvedValue({ customerPortalUrl: 'https://portal.polar.sh/sess' });

// Mock Clerk
vi.mock('@clerk/nextjs/server', () => ({
  currentUser: vi.fn(),
  auth: vi.fn(),
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url) => {
    throw new Error(`REDIRECT_TO: ${url}`);
  }),
}));

// Mock Next.js headers (mirrors async headers() returning Headers-like object)
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({
    get: (key: string) => (key === 'host' ? 'localhost:3000' : null),
  }),
}));

// Mock Convex HTTP Client
vi.mock('convex/browser', () => {
  return {
    ConvexHttpClient: class {
      setAuth = vi.fn();
      query = mockQuery;
      mutation = mockMutation;
    },
  };
});

// Mock Polar SDK
vi.mock('@polar-sh/sdk', () => {
  return {
    Polar: class {
      customers = { create: mockCustomersCreate };
      checkouts = { create: mockCheckoutsCreate };
      customerSessions = { create: mockCustomerSessionsCreate };
    },
  };
});

describe('Polar Server Actions Integration', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock environment variables for validation
    process.env.POLAR_ACCESS_TOKEN = 'dummy_token';
    process.env.POLAR_ENVIRONMENT = 'sandbox';
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
    process.env.NEXT_PUBLIC_CONVEX_URL = 'https://dummy.convex.cloud';

    // Setup Clerk current user mock
    vi.mocked(currentUser).mockResolvedValue({
      id: 'clerk_123',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
      fullName: 'Test User',
    } as unknown as User);

    // Setup Clerk auth token mock
    vi.mocked(auth).mockResolvedValue({
      getToken: vi.fn().mockResolvedValue('convex_jwt_token'),
    } as unknown as Awaited<ReturnType<typeof auth>>);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('createCheckoutSession', () => {
    it('uses existing polarCustomerId from database when present', async () => {
      // Arrange
      mockQuery.mockResolvedValue('polar_cust_existing');
      mockCheckoutsCreate.mockResolvedValue({
        url: 'https://checkout.polar.sh/existing_sess',
      });

      // Act
      let redirectUrl = '';
      try {
        await createCheckoutSession();
      } catch (err) {
        const error = err as Error;
        if (error.message.startsWith('REDIRECT_TO:')) {
          redirectUrl = error.message.replace('REDIRECT_TO: ', '');
        }
      }

      // Assert
      expect(mockQuery).toHaveBeenCalled();
      expect(mockCustomersCreate).not.toHaveBeenCalled();
      expect(mockCheckoutsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: 'polar_cust_existing',
        }),
      );
      expect(redirectUrl).toBe('https://checkout.polar.sh/existing_sess');
    });

    it('creates Polar customer on-demand and saves to Convex when missing', async () => {
      // Arrange
      mockQuery.mockResolvedValue(null);
      mockCustomersCreate.mockResolvedValue({
        id: 'polar_cust_created_ondemand',
      });
      mockCheckoutsCreate.mockResolvedValue({
        url: 'https://checkout.polar.sh/new_sess',
      });

      // Act
      let redirectUrl = '';
      try {
        await createCheckoutSession();
      } catch (err) {
        const error = err as Error;
        if (error.message.startsWith('REDIRECT_TO:')) {
          redirectUrl = error.message.replace('REDIRECT_TO: ', '');
        }
      }

      // Assert
      expect(mockQuery).toHaveBeenCalled();
      expect(mockCustomersCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          name: 'Test User',
          externalId: 'clerk_123',
          metadata: { clerkId: 'clerk_123' },
        }),
      );
      expect(mockMutation).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          polarCustomerId: 'polar_cust_created_ondemand',
        }),
      );
      expect(mockCheckoutsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: 'polar_cust_created_ondemand',
        }),
      );
      expect(redirectUrl).toBe('https://checkout.polar.sh/new_sess');
    });

    it('falls back safely to externalCustomerId if Polar Customer creation fails', async () => {
      // Arrange
      mockQuery.mockResolvedValue(null);
      mockCustomersCreate.mockRejectedValue(new Error('Polar API down'));
      mockCheckoutsCreate.mockResolvedValue({
        url: 'https://checkout.polar.sh/fallback_sess',
      });

      // Act
      let redirectUrl = '';
      try {
        await createCheckoutSession();
      } catch (err) {
        const error = err as Error;
        if (error.message.startsWith('REDIRECT_TO:')) {
          redirectUrl = error.message.replace('REDIRECT_TO: ', '');
        }
      }

      // Assert
      expect(mockQuery).toHaveBeenCalled();
      expect(mockCustomersCreate).toHaveBeenCalled();
      expect(mockMutation).not.toHaveBeenCalled();
      expect(mockCheckoutsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          externalCustomerId: 'clerk_123',
          customerEmail: 'test@example.com',
        }),
      );
      expect(redirectUrl).toBe('https://checkout.polar.sh/fallback_sess');
    });
  });

  describe('createCustomerPortalSession', () => {
    it('uses existing polarCustomerId to create portal session', async () => {
      // Arrange
      mockQuery.mockResolvedValue('polar_cust_existing');
      mockCustomerSessionsCreate.mockResolvedValue({
        customerPortalUrl: 'https://portal.polar.sh/existing_portal',
      });

      // Act
      let redirectUrl = '';
      try {
        await createCustomerPortalSession();
      } catch (err) {
        const error = err as Error;
        if (error.message.startsWith('REDIRECT_TO:')) {
          redirectUrl = error.message.replace('REDIRECT_TO: ', '');
        }
      }

      // Assert
      expect(mockQuery).toHaveBeenCalled();
      expect(mockCustomersCreate).not.toHaveBeenCalled();
      expect(mockCustomerSessionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: 'polar_cust_existing',
        }),
      );
      expect(redirectUrl).toBe('https://portal.polar.sh/existing_portal');
    });
  });
});
