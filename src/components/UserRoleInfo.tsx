"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export default function UserRoleInfo() {
  const { user, upgradeToTeacher } = useAuth();
  const { isTeacher, isUser } = useRoleAccess();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgradeToTeacher = async () => {
    setLoading(true);
    setError("");
    
    try {
      await upgradeToTeacher();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Upgrade failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Role Information
          <Badge variant={isTeacher() ? "default" : "secondary"}>
            {user.role}
          </Badge>
        </CardTitle>
        <CardDescription>
          Your current account permissions and capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Current Role: {user.role}</h4>
          <div className="text-sm text-gray-600">
            {isTeacher() ? (
              <ul className="list-disc list-inside space-y-1">
                <li>Create and manage courses</li>
                <li>Upload course content</li>
                <li>View student progress</li>
                <li>Access teacher dashboard</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                <li>Enroll in courses</li>
                <li>Track learning progress</li>
                <li>Access course content</li>
                <li>View personal dashboard</li>
              </ul>
            )}
          </div>
        </div>

        {isUser() && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Want to create and manage courses? Upgrade to a teacher account.
            </p>
            <Button
              onClick={handleUpgradeToTeacher}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Upgrading..." : "Upgrade to Teacher"}
            </Button>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </div>
        )}

        {isTeacher() && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
            You have full teacher privileges and can create and manage courses.
          </div>
        )}
      </CardContent>
    </Card>
  );
}