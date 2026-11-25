"use client";

import {
  AlertDialog,
  AlertDialogAction,
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
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  function resetForm() {
    setEmail("");
    setPassword("");
    setName("");
    setRole("MEMBER");
    setCreateError("");
  }

  async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      (setCreating(true), setCreateError(""));

      const newUser = await createUser({ email, name, password, role });

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
            if (!value) {
              resetForm();
            }
          }}
        >
          <AlertDialogTrigger render={<Button />}>Add User</AlertDialogTrigger>
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
                    placeholder="Ngoc Quynh"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="quynh@gmail.com"
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
                <AlertDialogAction type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create User"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="rounded-lg border bg-card">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">Organization Members</h2>
          <p className="text-sm text-muted-foreground">
            Users who belong to your organization.
          </p>
        </div>

        {loading && (
          <div className="px-6 py-8 text-sm text-muted-foreground">
            Loading Users...
          </div>
        )}

        {!loading && error && (
          <div className="px-6 py-8 text-sm text-destructive">{error}</div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="px-6 py-8 text-sm text-muted-foreground">
            No users found.
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="divide-y">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-md border px-2.5 py-1 text-xs font-medium">
                    {user.role}
                  </span>

                  {canManageUsers && (
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
