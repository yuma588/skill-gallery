---
name: frontend-frameworks
description: Modern frontend frameworks and libraries for web development.
tool_name: frontend-frameworks
category: development
priority: 7
tags: ["development", "tool", "automation", "react", "vue", "angular"]
version: 1.0
---

# Frontend Frameworks

Comprehensive support for modern frontend frameworks and libraries including React, Vue.js, Angular, and more.

## Description

This skill provides expert assistance for frontend development using modern frameworks. It can help with:
- Creating components and pages
- Setting up project architecture
- Implementing state management
- Handling routing and navigation
- Optimizing performance
- Writing tests and debugging

## Features

### Framework Support
- **React** - Hooks, Context API, Redux Toolkit, Next.js
- **Vue.js** - Composition API, Pinia, Vue Router, Nuxt.js
- **Angular** - Components, Services, Modules, RxJS
- **Svelte** - Components, Stores, SvelteKit
- **Other Libraries** - TypeScript, Tailwind CSS, Vite

### Capabilities
- Create project scaffolding and boilerplate
- Generate reusable components
- Implement state management patterns
- Set up routing systems
- Configure build tools and bundlers
- Write unit and integration tests
- Optimize for performance and accessibility

## Usage

### Basic Usage

```json
{
  "action": "use_frontend-frameworks",
  "parameters": {
    "framework": "react",
    "task": "create_component",
    "component_name": "UserProfile",
    "features": ["typescript", "hooks"]
  }
}
```

### Parameter Reference

| Parameter | Type | Description |
|-----------|------|-------------|
| `framework` | string | Framework name: "react", "vue", "angular", "svelte" |
| `task` | string | Task type: "create_component", "setup_project", "implement_feature" |
| `component_name` | string | Name of the component (for component-related tasks) |
| `features` | array | Additional features: ["typescript", "testing", "styling"] |

## Examples

### Example 1: Create React Component with Hooks

```json
{
  "action": "use_frontend-frameworks",
  "parameters": {
    "framework": "react",
    "task": "create_component",
    "component_name": "UserProfile",
    "features": ["typescript", "hooks"],
    "props": ["name", "email", "avatar"]
  }
}
```

**Result:**
```tsx
import React, { useState, useEffect } from 'react';

interface UserProfileProps {
  name: string;
  email: string;
  avatar?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  name,
  email,
  avatar
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Component initialization logic
  }, []);

  return (
    <div className="user-profile">
      {avatar && <img src={avatar} alt={name} />}
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
};
```

### Example 2: Setup Vue 3 Project with Composition API

```json
{
  "action": "use_frontend-frameworks",
  "parameters": {
    "framework": "vue",
    "task": "setup_project",
    "vue_version": "3",
    "typescript": true,
    "router": true,
    "state_management": "pinia"
  }
}
```

**Result:**
- Project structure with Vue 3 Composition API
- TypeScript configuration
- Vue Router setup
- Pinia state management
- ESLint and Prettier configuration

### Example 3: Implement Redux Toolkit in React

```json
{
  "action": "use_frontend-frameworks",
  "parameters": {
    "framework": "react",
    "task": "implement_feature",
    "feature": "state_management",
    "library": "redux_toolkit",
    "slices": ["user", "posts", "comments"]
  }
}
```

**Result:**
- Redux Toolkit store configuration
- Slice definitions for user, posts, and comments
- Action creators and reducers
- Async thunk setup for API calls
- Integration with React components

### Example 4: Create Angular Service

```json
{
  "action": "use_frontend-frameworks",
  "parameters": {
    "framework": "angular",
    "task": "create_service",
    "service_name": "AuthService",
    "http_client": true,
    "observables": true
  }
}
```

**Result:**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post('/api/auth/login', credentials);
  }

  logout(): void {
    // Logout logic
  }

  get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }
}
```

### Example 5: Svelte Component with Stores

```json
{
  "action": "use_frontend-frameworks",
  "parameters": {
    "framework": "svelte",
    "task": "create_component",
    "component_name": "TodoList",
    "store": true,
    "typescript": true
  }
}
```

**Result:**
```svelte
<script lang="ts">
  import { writable } from 'svelte/store';

  interface Todo {
    id: number;
    text: string;
    completed: boolean;
  }

  export let todos = writable<Todo[]>([]);
  
  function addTodo(text: string) {
    todos.update(current => [...current, { id: Date.now(), text, completed: false }]);
  }
</script>

<div class="todo-list">
  <!-- Component template -->
</div>
```

## Task Types

### create_component
Creates a new component with specified features.

**Parameters:**
- `component_name` (required): Name of the component
- `features` (optional): ["typescript", "testing", "styling", "hooks"]

### setup_project
Initializes a new project with framework-specific configuration.

**Parameters:**
- `framework` (required): Framework name
- `typescript` (optional): Enable TypeScript (default: false)
- `router` (optional): Include routing setup
- `state_management` (optional): State management library name

### implement_feature
Implements a specific feature or pattern.

**Parameters:**
- `feature` (required): Feature name ("state_management", "routing", "forms", "authentication")
- `library` (optional): Specific library to use
- Additional parameters based on the feature

### create_service
Creates a service for Angular or similar frameworks.

**Parameters:**
- `service_name` (required): Name of the service
- `http_client` (optional): Include HttpClient
- `observables` (optional): Use Observable patterns

## Best Practices

### Performance Optimization
- Use React.memo and useMemo for expensive computations
- Implement virtual scrolling for large lists
- Lazy load routes and components
- Optimize images and assets

### Code Organization
- Separate concerns (UI, logic, styles)
- Use barrel exports for cleaner imports
- Follow framework-specific conventions
- Keep components focused and reusable

### Testing
- Write unit tests for components
- Test services and utilities
- Use mocking for external dependencies
- Aim for high code coverage

## Common Patterns

### HOC Pattern (React)
```tsx
function withAuth<P>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const auth = useAuth();
    return auth.isAuthenticated ? <Component {...props} /> : <Login />;
  };
}
```

### Composable Pattern (Vue)
```typescript
export function useCounter(initialValue: number = 0) {
  const count = ref(initialValue);
  const increment = () => count.value++;
  const decrement = () => count.value--;
  return { count, increment, decrement };
}
```

### Guard Pattern (Angular)
```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
```

## Notes

- This skill supports the latest stable versions of all frameworks
- Always check framework documentation for best practices
- Use TypeScript for better type safety and developer experience
- Follow accessibility guidelines (WCAG 2.1)
- Consider SEO implications for server-side rendering

## Resources

- [React Documentation](https://react.dev)
- [Vue.js Guide](https://vuejs.org/guide/)
- [Angular Docs](https://angular.io/docs)
- [Svelte Documentation](https://svelte.dev/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
