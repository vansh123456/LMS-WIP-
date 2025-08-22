"use client";

import { Bell, BookOpen, LogOut, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NonDashboardNavbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleDashboardRedirect = () => {
    if (user?.role === "teacher") {
      router.push("/dashboard/teacher");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <nav className="nondashboard-navbar">
      <div className="nondashboard-navbar__container">
        <div className="nondashboard-navbar__search">
          <Link href="/" className="nondashboard-navbar__brand" scroll={false}>
            LMS Name
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Link
                href="/search"
                className="nondashboard-navbar__search-input"
                scroll={false}
              >
                <span className="hidden sm:inline">Search Courses</span>
                <span className="sm:hidden">Search</span>
              </Link>
              <BookOpen
                className="nondashboard-navbar__search-icon"
                size={18}
              />
            </div>
          </div>
        </div>
        <div className="nondashboard-navbar__actions">
          <button className="nondashboard-navbar__notification-button">
            <span className="nondashboard-navbar__notification-indicator"></span>
            <Bell className="nondashboard-navbar__notification-icon" />
          </button>
          
          {user ? (
            <div className="relative group">
              <Card className="nondashboard-navbar__user-card bg-customgreys-secondarybg border-gray-700 hover:bg-customgreys-darkerGrey transition-all duration-200 cursor-pointer min-w-[200px]">
                <CardContent className="p-4" onClick={handleDashboardRedirect}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white-100" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white-50 font-medium text-sm">
                        Welcome {user.name}
                      </p>
                      <p className="text-gray-400 text-xs capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="absolute top-full right-0 mt-1 w-full bg-customgreys-darkerGrey hover:bg-red-600 hover:text-white-100 text-gray-400 text-xs"
              >
                <LogOut className="w-3 h-3 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/auth/signin">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="nondashboard-navbar__auth-button--login"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button 
                  size="sm"
                  className="nondashboard-navbar__auth-button--signup"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NonDashboardNavbar;