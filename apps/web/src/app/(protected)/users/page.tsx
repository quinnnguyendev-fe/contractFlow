"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser, getUsers, User, UserRole } from "@/lib/api/users";
import { getCurrentUser } from "@/lib/auth/current-user";
import { Search, UserPlus, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const roleStyles: Record<UserRole, string> = {
  OWNER: "border-purple-500/30 bg-purple-500/10 text-purple-600",
  ADMIN: "border-blue-500/30 bg-blue-500/10 text-blue-600",
  MEMBER: "border-green-500/30 bg-green-500/10 text-green-600",
  VIEWER: "border-muted bg-muted text-muted-foreground",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("MEMBER");

  const currentUser = getCurrentUser();
  const canManageUsers =
    currentUser?.role === "OWNER" || currentUser?.role === "ADMIN";

  useEffect(() => {
    async function loadUsers() {
      try {
        setError("");
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load users",
        );
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query),
    );
  }, [users, search]);

  function resetForm() {
    setEmail("");
    setPassword("");
    setName("");
    setRole("MEMBER");
    setCreateError("");
  }

  async function handleCreateUser(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (creating) return;

    try {
      setCreating(true);
      setCreateError("");

      const newUser = await createUser({
        email: email.trim(),
        name: name.trim(),
        password,
        role,
      });

      setUsers((current) => [...current, newUser]);
      resetForm();
      setOpen(false);
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create user",
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="mt-2 text-muted-foreground">
            Manage organization members and access.
          </p>
        </div>

        {canManageUsers && (
          <AlertDialog
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              if (!value) resetForm();
            }}
          >
            <AlertDialogTrigger render={<Button />}>
              <UserPlus className="mr-2 size-4" />
              Add User
            </AlertDialogTrigger>

            <AlertDialogContent size="default">
              <form onSubmit={handleCreateUser}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Create a new member in your organization.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Name</Label>
                    <Input
                      id="user-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Password</Label>
                    <Input
                      id="user-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      minLength={8}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Role</Label>
                    <select
                      id="user-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="VIEWER">VIEWER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>

                  {createError && (
                    <p className="text-sm text-destructive">{createError}</p>
                  )}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={creating}>
                    Cancel
                  </AlertDialogCancel>
                  <Button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create User"}
                  </Button>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total members
            </p>
            <Users className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums">
            {loading ? "_" : users.length}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm font-medium text-muted-foreground">
            Administrators
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums">
            {loading
              ? "—"
              : users.filter(
                  (user) => user.role === "OWNER" || user.role === "ADMIN",
                ).length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex flex-col gap-4 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Organization Members</h2>
            <p className="text-sm text-muted-foreground">
              Users who belong to your organization.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or role..."
              className="pl-9"
            />
          </div>
        </div>

        {loading && (
          <div className="divide-y">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-4 px-6 py-5">
                <div className="size-10 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-48 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Users className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 font-medium">No members yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a user to your organization to get started.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          users.length > 0 &&
          filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No users match "{search}".
            </div>
          )}

        {!loading && !error && filteredUsers.length > 0 && (
          <div className="divide-y">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                    {(
                      user.name?.trim()?.charAt(0) ||
                      user.email?.charAt(0) ||
                      "?"
                    ).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {user.name?.trim() || "Unnamed User"}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-md border px-2.5 py-1 text-xs font-medium ${roleStyles[user.role]}`}
                >
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="border-t px-6 py-3 text-xs text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} members.
          </div>
        )}
      </div>
    </div>
  );
}
