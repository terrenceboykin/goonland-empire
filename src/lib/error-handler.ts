/**
 * Centralized error handling - prevents crashes
 */

export function handleError(error: unknown, context: string): string {
  // Log error for debugging (but don't crash)
  console.error(`Error in ${context}:`, error);

  // Return user-friendly message
  if (error instanceof Error) {
    // Don't expose technical errors to users
    if (error.message.includes("API")) {
      return "Service temporarily unavailable. Please try again in a moment.";
    }
    if (error.message.includes("network") || error.message.includes("fetch")) {
      return "Connection issue. Please check your internet connection and try again.";
    }
    if (error.message.includes("timeout")) {
      return "Request took too long. Please try again.";
    }
    return "Something went wrong. Please try again.";
  }

  return "An unexpected error occurred. Please try again.";
}

export function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  context: string
): Promise<T> {
  return fn().catch((error) => {
    handleError(error, context);
    return fallback;
  });
}

