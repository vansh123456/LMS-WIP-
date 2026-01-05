# Role-Based Access Control (RBAC) Implementation

This document describes the role-based access control system implemented in the LMS application.

## Overview

The system supports two user roles:
- **User**: Default role for regular students/learners
- **Teacher**: Role for course creators and instructors

## Backend Implementation

### User Model Changes

The user model has been updated to include a `role` field:

```typescript
role: {
  type: String,
  required: true,
  default: "user",
  enum: ["user", "teacher"],
}
```

### Authentication Middleware

Three middleware functions are available for role-based access control:

1. **`authenticateToken`**: Verifies JWT token and adds user info to request
2. **`requireTeacher`**: Ensures the authenticated user has teacher role
3. **`requireUser`**: Ensures the authenticated user has either user or teacher role

### JWT Token Updates

JWT tokens now include the user's role:

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}
```

### API Endpoints

#### Authentication Endpoints

- `POST /auth/register` - Register as a regular user
- `POST /auth/register/teacher` - Register as a teacher
- `POST /auth/login` - Login (returns role information)
- `POST /auth/google` - Google OAuth (creates user with default "user" role)
- `POST /auth/upgrade-to-teacher` - Upgrade existing user to teacher role
- `GET /auth/profile` - Get user profile with role information

#### Protected Course Endpoints

The following endpoints require teacher authentication:

- `POST /courses` - Create a new course
- `PUT /courses/:courseId` - Update a course
- `DELETE /courses/:courseId` - Delete a course
- `POST /courses/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url` - Get video upload URL

## Frontend Implementation

### AuthContext Updates

The AuthContext now includes role information and new methods:

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  // ... existing methods
  registerTeacher: (name: string, email: string, password: string) => Promise<void>;
  upgradeToTeacher: () => Promise<void>;
}
```

### Role Access Hook

A custom hook `useRoleAccess` provides utility functions for role checking:

```typescript
const { isUser, isTeacher, isAuthenticated, hasRole, hasAnyRole, userRole } = useRoleAccess();
```

### Protected Route Component

The `ProtectedRoute` component now supports role-based access:

```typescript
<ProtectedRoute requiredRole="teacher">
  <TeacherDashboard />
</ProtectedRoute>

<ProtectedRoute allowedRoles={["user", "teacher"]}>
  <SomeComponent />
</ProtectedRoute>
```

### New Pages

1. **Teacher Registration Page** (`/auth/signup/teacher`)
   - Allows users to register directly as teachers
   - Includes validation and error handling

2. **Teacher Dashboard** (`/dashboard/teacher`)
   - Only accessible to users with teacher role
   - Provides course management, analytics, and content management features

3. **User Role Info Component**
   - Displays current user role and capabilities
   - Provides upgrade option for regular users

## Usage Examples

### Backend Route Protection

```typescript
// Teacher-only route
router.post("/courses", authenticateToken, requireTeacher, createCourse);

// User or teacher route
router.get("/courses", authenticateToken, requireUser, listCourses);
```

### Frontend Role Checking

```typescript
const { isTeacher, isUser } = useRoleAccess();

if (isTeacher()) {
  // Show teacher-specific features
}

if (isUser()) {
  // Show user-specific features
}
```

### Conditional Rendering

```typescript
{user?.role === "teacher" && (
  <Button asChild variant="outline">
    <a href="/dashboard/teacher">Teacher Dashboard</a>
  </Button>
)}
```

## Security Considerations

1. **Server-side validation**: All role checks are performed on the server
2. **JWT token security**: Role information is embedded in JWT tokens
3. **Middleware protection**: Routes are protected at the middleware level
4. **Client-side UX**: Frontend provides appropriate UI based on user role

## Migration Notes

For existing users in the database:
- Users without a role field will need to be updated
- The default role is "user" for new registrations
- Google OAuth users are created with "user" role by default

## Future Enhancements

Potential improvements to consider:
1. **Role hierarchy**: Support for admin roles above teacher
2. **Permission granularity**: Fine-grained permissions within roles
3. **Role approval workflow**: Admin approval for teacher role upgrades
4. **Audit logging**: Track role changes and access attempts