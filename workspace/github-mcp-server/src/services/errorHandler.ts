/**
 * Error Handler for GitHub API
 */

import axios, { AxiosError } from "axios";

export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 401:
          return "Error: Invalid GitHub token. Please check your GITHUB_TOKEN environment variable.";

        case 403:
          if (data?.message?.includes("rate limit")) {
            const resetTime = error.response.headers["x-ratelimit-reset"];
            const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000).toISOString() : "unknown time";
            return `Error: GitHub API rate limit exceeded. Limit resets at ${resetDate}. Please wait before making more requests.`;
          }
          return "Error: Permission denied. You don't have access to this resource or need additional permissions.";

        case 404:
          return "Error: Resource not found. Please check the owner, repository name, or issue/PR number.";

        case 422:
          const errors = data?.errors || [];
          const errorDetails = errors.map((e: any) => e.message).join(", ");
          return `Error: Validation failed. ${errorDetails}`;

        case 429:
          return "Error: Too many requests. Please slow down and try again later.";

        case 500:
        case 502:
        case 503:
        case 504:
          return "Error: GitHub server error. Please try again later.";

        default:
          const message = data?.message || error.message;
          return `Error: API request failed with status ${status}. ${message}`;
      }
    } else if (error.code === "ECONNABORTED") {
      return "Error: Request timed out. Please try again.";
    } else if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      return "Error: Unable to connect to GitHub. Please check your network connection.";
    }
  }

  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }

  return "Error: An unexpected error occurred. Please try again.";
}
