/**
 * GitHub API Client
 */

import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_BASE_URL, API_VERSION, REQUEST_TIMEOUT, DEFAULT_PER_PAGE, MAX_PER_PAGE } from "../constants.js";
import { handleApiError } from "./errorHandler.js";
import { RateLimitInfo } from "../types.js";

class GitHubClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    // Get token from environment
    this.token = process.env.GITHUB_TOKEN || null;

    if (!this.token) {
      console.error("WARNING: GITHUB_TOKEN environment variable not set. Some endpoints may fail or have limited access.");
    }

    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: REQUEST_TIMEOUT,
      headers: {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": API_VERSION,
        ...(this.token ? { "Authorization": `Bearer ${this.token}` } : {})
      }
    });
  }

  /**
   * Make an API request
   */
  async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    data?: any,
    params?: any
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request({
        url: endpoint,
        method,
        data,
        params
      });

      // Check rate limit headers
      this.logRateLimit(response);

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Extract and log rate limit information
   */
  private logRateLimit(response: AxiosResponse): void {
    const limit = response.headers["x-ratelimit-limit"];
    const remaining = response.headers["x-ratelimit-remaining"];
    const reset = response.headers["x-ratelimit-reset"];

    if (limit && remaining && reset) {
      const rateLimitInfo: RateLimitInfo = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
        used: parseInt(limit) - parseInt(remaining)
      };

      const resetDate = new Date(parseInt(reset) * 1000);
      const now = new Date();
      const minutesUntilReset = Math.ceil((resetDate.getTime() - now.getTime()) / 60000);

      if (rateLimitInfo.remaining < 100) {
        console.error(`Rate limit warning: ${rateLimitInfo.remaining}/${rateLimitInfo.limit} remaining. Resets in ${minutesUntilReset} minutes.`);
      }
    }
  }

  /**
   * Validate pagination parameters
   */
  validatePagination(perPage?: number, page?: number): { per_page: number; page: number } {
    return {
      per_page: Math.min(Math.max(perPage || DEFAULT_PER_PAGE, 1), MAX_PER_PAGE),
      page: Math.max(page || 1, 1)
    };
  }
}

// Singleton instance
export const githubClient = new GitHubClient();
