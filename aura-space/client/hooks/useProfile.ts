import { useEffect, useState } from "react";
import { JoinClassResponse, UserProfile } from "@shared/api";

const KEY = "ecoquest_profile";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setProfile(JSON.parse(raw));
  }, []);

  function save(p: UserProfile) {
    localStorage.setItem(KEY, JSON.stringify(p));
    setProfile(p);
  }

  function clear() {
    localStorage.removeItem(KEY);
    setProfile(null);
  }

  function onJoined(resp: JoinClassResponse) {
    save(resp.user);
  }

  return { profile, save, clear, onJoined };
}
