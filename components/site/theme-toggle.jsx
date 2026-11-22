"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Dark / light toggle (optional feature #2). The initial class is set by an inline script in app/layout.jsx to avoid a flash. */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("pizzahub-theme", next ? "dark" : "light"); } catch {}
  };
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
