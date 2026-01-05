import { useAuth } from "../contexts/AuthContext";

export const useRoleAccess = () => {
  const { user } = useAuth();

  const isUser = () => {
    return user?.role === "user";
  };

  const isTeacher = () => {
    return user?.role === "teacher";
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]) => {
    return user && roles.includes(user.role);
  };

  return {
    isUser,
    isTeacher,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    userRole: user?.role,
  };
};