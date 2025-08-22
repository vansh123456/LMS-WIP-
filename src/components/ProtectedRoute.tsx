"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "teacher";
  allowedRoles?: ("user" | "teacher")[];
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
  fallback,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { isAuthenticated, hasRole, hasAnyRole } = useRoleAccess();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        router.push("/auth/signin");
        return;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        router.push("/dashboard");
        return;
      }

      if (allowedRoles && !hasAnyRole(allowedRoles)) {
        router.push("/dashboard");
        return;
      }
    }
  }, [user, loading, requiredRole, allowedRoles, router, isAuthenticated, hasRole, hasAnyRole]);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated()) {
    return fallback || <div>Redirecting to login...</div>;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || <div>Access denied. Redirecting...</div>;
  }

  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return fallback || <div>Access denied. Redirecting...</div>;
  }

  return <>{children}</>;
}