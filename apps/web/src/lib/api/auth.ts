import { apiClient } from "./client"

export type LoginResponse = {
    accessToken: string
}

export type LoginPayload = {
    email: string,
    password: string
}

export async function login(
  payload: LoginPayload,
): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}