import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { ToastService } from '../services/toast-service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';
      let userFriendlyMessage = '';
      let shouldRedirect = false;
      let redirectTo = '';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
        userFriendlyMessage =
          'A client-side error occurred. Please check your connection.';
        console.error('Client-side error:', error.error);
      } else {
        // Server-side error
        const serverError = error.error;

        switch (error.status) {
          case 0:
            errorMessage = 'Network error. Server might be down.';
            userFriendlyMessage =
              'Unable to connect to server. Please check your internet connection.';
            console.error('Network error - server might be down');
            break;

          case 400:
            errorMessage = serverError?.message || 'Bad Request';
            userFriendlyMessage = 'Invalid request. Please check your input.';
            console.error('Bad Request:', serverError);
            break;

          case 401:
            errorMessage = 'Unauthorized access';
            userFriendlyMessage =
              'Your session has expired. Please login again.';
            shouldRedirect = true;
            redirectTo = '/login';
            console.warn('Unauthorized access:', req.url);
            break;

          case 403:
            errorMessage = 'Forbidden';
            userFriendlyMessage =
              'You do not have permission to access this resource.';
            console.warn('Forbidden access:', req.url);
            break;

          case 404:
            errorMessage = serverError?.message || 'Resource not found';
            userFriendlyMessage = 'The requested resource was not found.';
            console.error('Not Found:', req.url);
            break;

          case 409:
            errorMessage = serverError?.message || 'Conflict';
            userFriendlyMessage = 'A conflict occurred. Please try again.';
            console.error('Conflict:', serverError);
            break;

          case 422:
            errorMessage = serverError?.message || 'Validation failed';
            userFriendlyMessage = 'Please check your input data.';
            console.error('Validation Error:', serverError);
            break;

          case 429:
            errorMessage = 'Too many requests';
            userFriendlyMessage =
              'Too many requests. Please try again in a few minutes.';
            console.warn('Rate limit exceeded:', req.url);
            break;

          case 500:
            errorMessage = 'Internal Server Error';
            userFriendlyMessage =
              'Something went wrong on our end. Please try again later.';
            console.error('Server Error:', serverError);
            break;

          case 502:
            errorMessage = 'Bad Gateway';
            userFriendlyMessage =
              'Server is temporarily unavailable. Please try again later.';
            console.error('Bad Gateway:', req.url);
            break;

          case 503:
            errorMessage = 'Service Unavailable';
            userFriendlyMessage =
              'Service is temporarily unavailable. Please try again later.';
            console.error('Service Unavailable:', req.url);
            break;

          case 504:
            errorMessage = 'Gateway Timeout';
            userFriendlyMessage =
              'The request took too long. Please try again.';
            console.error('Gateway Timeout:', req.url);
            break;

          default:
            errorMessage = serverError?.message || `HTTP ${error.status}`;
            userFriendlyMessage = `An error occurred (${error.status}). Please try again.`;
        }
      }

      // Show user-friendly notification
      toastService.error(userFriendlyMessage, 10);

      // Log detailed error for debugging
      logErrorDetails(req, error, errorMessage);

      // Return a structured error object
      return throwError(() => ({
        message: userFriendlyMessage,
        technicalMessage: errorMessage,
        status: error.status,
        originalError: error,
        timestamp: new Date().toISOString(),
        url: req.url,
      }));
    }),
  );
};

function logErrorDetails(
  req: any,
  error: HttpErrorResponse,
  errorMessage: string,
): void {
  const errorDetails = {
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    status: error.status,
    statusText: error.statusText,
    message: errorMessage,
    requestBody: req.body,
    responseBody: error.error,
    headers: req.headers,
  };

  console.group('HTTP Error Details');
  console.log('Request:', {
    url: errorDetails.url,
    method: errorDetails.method,
    body: errorDetails.requestBody,
  });
  console.log('Response:', {
    status: errorDetails.status,
    statusText: errorDetails.statusText,
    body: errorDetails.responseBody,
  });
  console.groupEnd();
}
