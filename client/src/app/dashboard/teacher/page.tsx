"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.name}! Manage your courses and students here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Course Management
                  <Badge variant="default">Teacher</Badge>
                </CardTitle>
                <CardDescription>
                  Create and manage your courses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Create new courses</li>
                    <li>Upload course content</li>
                    <li>Manage course settings</li>
                    <li>Track student enrollment</li>
                  </ul>
                </div>
                <Button className="w-full">
                  Manage Courses
                </Button>
              </CardContent>
            </Card>

            {/* Student Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Student Analytics</CardTitle>
                <CardDescription>
                  View student progress and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Student progress tracking</li>
                    <li>Performance analytics</li>
                    <li>Engagement metrics</li>
                    <li>Completion rates</li>
                  </ul>
                </div>
                <Button className="w-full" variant="outline">
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Content Management */}
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>
                  Upload and organize course materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Upload videos and documents</li>
                    <li>Organize course structure</li>
                    <li>Create assignments</li>
                    <li>Set up assessments</li>
                  </ul>
                </div>
                <Button className="w-full" variant="outline">
                  Manage Content
                </Button>
              </CardContent>
            </Card>

            {/* Communication */}
            <Card>
              <CardHeader>
                <CardTitle>Communication</CardTitle>
                <CardDescription>
                  Communicate with your students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Send announcements</li>
                    <li>Respond to questions</li>
                    <li>Provide feedback</li>
                    <li>Schedule office hours</li>
                  </ul>
                </div>
                <Button className="w-full" variant="outline">
                  Open Messages
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your teacher profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Update profile information</li>
                    <li>Change password</li>
                    <li>Notification preferences</li>
                    <li>Privacy settings</li>
                  </ul>
                </div>
                <Button className="w-full" variant="outline">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>
                  Overview of your teaching activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">Active Courses</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  View Detailed Stats
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}