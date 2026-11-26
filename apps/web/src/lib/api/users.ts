import { apiClient } from "./client";

export type UserRole = "ADMIN" | "OWNER" | "MEMBER" | "VIEWER";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type CreateUserPayload = {
  email: string;
  name: string;
  password: string;
  role: UserRole;
};

export async function getUsers(): Promise<User[]> {
  const users = await apiClient<
    {
      id: string;
      email: string;
      name: string;
      memberships: {
        role: UserRole;
        organizationId: string;
      }[];
    }[]
  >("/users");

  return users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name ?? "",
    role: user.memberships[0]?.role ?? "MEMBER",
  }));
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const user = await apiClient<{
    id: string;
    email: string;
    name: string;
    memberships: {
      role: UserRole;
      organizationId: string;
    }[];
  }>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name ?? "",
    role: user.memberships[0]?.role ?? "MEMBER",
  };
}
