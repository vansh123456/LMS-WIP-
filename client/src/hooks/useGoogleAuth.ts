"use client";

import { useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window {
    google: any;
  }
}

export const useGoogleAuth = () => {
  const { googleLogin } = useAuth();

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeGoogleAuth = useCallback(() => {
    if (typeof window !== "undefined" && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            await googleLogin(response.credential);
            // Redirect to dashboard or handle success
            window.location.href = "/dashboard";
          } catch (error) {
            console.error("Google login error:", error);
            alert("Google login failed. Please try again.");
          }
        },
      });
    }
  }, [googleLogin]);

  const renderGoogleButton = useCallback((elementId: string) => {
    if (typeof window !== "undefined" && window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
        }
      );
    }
  }, []);

  return { initializeGoogleAuth, renderGoogleButton };
};
