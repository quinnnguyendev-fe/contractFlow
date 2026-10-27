"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        aria-label="Change theme"
      >
        <Monitor className="size-5" />
      </Button>
    );
  }

  const nextTheme =
    theme === "light"
      ? "dark"
      : theme === "dark"
        ? "system"
        : "light";

  const Icon =
    theme === "light"
      ? Sun
      : theme === "dark"
        ? Moon
        : Monitor;

  const label =
    theme === "light"
      ? "Light theme"
      : theme === "dark"
        ? "Dark theme"
        : "System theme";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Current theme: ${label}. Click to change theme.`}
      title={`Current theme: ${label}`}
      onClick={() => setTheme(nextTheme)}
    >
      <Icon className="size-5" />
    </Button>
  );
}