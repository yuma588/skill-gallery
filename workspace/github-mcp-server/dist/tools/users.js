/**
 * User Tools
 */
import { z } from "zod";
import { githubClient } from "../services/githubClient.js";
import { formatUser, ResponseFormat } from "../services/formatters.js";
// ============== Get User ==============
const GetUserSchema = z.object({
    username: z.string()
        .min(1, "Username is required")
        .max(39, "Username must not exceed 39 characters")
        .describe("GitHub username"),
    response_format: z.nativeEnum(ResponseFormat)
        .default(ResponseFormat.MARKDOWN)
        .describe("Output format: 'markdown' or 'json'")
}).strict();
// ============== Register Tools ==============
export function registerUserTools(server) {
    // Get User
    server.registerTool("github_get_user", {
        title: "Get User Profile",
        description: `Get detailed profile information about a GitHub user.

This tool retrieves complete information about a GitHub user, including bio, stats, and profile details.

Args:
  - username (string): GitHub username (required, max 39 characters)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Complete user object with fields:
  {
    "login": string,
    "id": number,
    "node_id": string,
    "avatar_url": string,
    "type": "User" | "Organization",
    "name": string | null,
    "bio": string | null,
    "company": string | null,
    "blog": string | null,
    "location": string | null,
    "email": string | null,
    "twitter_username": string | null,
    "public_repos": number,
    "public_gists": number,
    "followers": number,
    "following": number,
    "created_at": string,
    "updated_at": string,
    "site_admin": boolean,
    ...
  }

Examples:
  - Get user profile: username='facebook'
  - Get developer profile: username='torvalds'
  - Get organization profile: username='microsoft'

Error Handling:
  - Returns "Error: Resource not found" if user doesn't exist (404)`,
        inputSchema: GetUserSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        try {
            const user = await githubClient.request(`/users/${params.username}`);
            const textContent = params.response_format === ResponseFormat.MARKDOWN
                ? formatUser(user)
                : JSON.stringify(user, null, 2);
            const response = {
                content: [{ type: "text", text: textContent }]
            };
            if (params.response_format === ResponseFormat.JSON) {
                response.structuredContent = user;
            }
            return response;
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: error instanceof Error ? error.message : "An unknown error occurred"
                    }]
            };
        }
    });
}
//# sourceMappingURL=users.js.map