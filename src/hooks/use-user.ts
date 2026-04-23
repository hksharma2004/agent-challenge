"use client";

import { useState, useEffect } from "react";

export function useUser() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user session
    setUser({
      id: "00000000-0000-0000-0000-000000000000",
      email: "guest@example.com",
      user_metadata: {
        full_name: "Guest User",
        avatar_url: "/placeholder-user.jpg"
      }
    });
    setLoading(false);
  }, []);

  return { user, loading };
}
