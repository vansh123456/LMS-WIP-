"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user?.name}!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>Email:</strong> {user?.email}
                </div>
                {user?.avatar && (
                  <div>
                    <strong>Avatar:</strong>
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-16 h-16 rounded-full mt-2"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
