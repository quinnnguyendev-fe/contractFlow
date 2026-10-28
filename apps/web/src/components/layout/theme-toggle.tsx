"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

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