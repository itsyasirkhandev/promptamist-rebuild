import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

/**
 * handleError — typed ConvexError → user-facing toast bridge.
 *
 * Returns `true` when the error is a LimitExceeded so callers can
 * trigger the upgrade flow without string-matching on error messages.
 */
export const handleError = (err: unknown): { showUpgradeModal: boolean } => {
  if (err instanceof ConvexError) {
    const data = err.data as { _tag: string; message: string };
    switch (data._tag) {
      case 'Unauthorized':
        toast.error('Unauthorized', {
          description: data.message || 'You must be logged in.',
        });
        break;
      case 'NotFound':
        toast.error('Not Found', {
          description: data.message || 'The requested resource was not found.',
        });
        break;
      case 'ValidationError':
        toast.warning('Validation Error', {
          description: data.message || 'Please check your input.',
        });
        break;
      case 'LimitExceeded':
        toast.warning('Limit Reached', {
          description: data.message || 'You have reached your plan limit.',
        });
        return { showUpgradeModal: true };
      case 'InternalError':
        toast.error('Server Error', {
          description: data.message || 'An unexpected error occurred.',
        });
        break;
      default:
        toast.error('Error', {
          description: data.message || 'An unknown error occurred.',
        });
    }
  } else {
    console.error('Unhandled error:', err);
    toast.error('Critical Failure', {
      description: 'An unexpected error occurred. Please try again later.',
    });
  }
  return { showUpgradeModal: false };
};

