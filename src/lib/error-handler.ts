import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

export const handleError = (err: unknown) => {
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
};
