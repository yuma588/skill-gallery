/**
 * GitHub API Client
 */
declare class GitHubClient {
    private client;
    private token;
    constructor();
    /**
     * Make an API request
     */
    request<T>(endpoint: string, method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", data?: any, params?: any): Promise<T>;
    /**
     * Extract and log rate limit information
     */
    private logRateLimit;
    /**
     * Validate pagination parameters
     */
    validatePagination(perPage?: number, page?: number): {
        per_page: number;
        page: number;
    };
}
export declare const githubClient: GitHubClient;
export {};
//# sourceMappingURL=githubClient.d.ts.map