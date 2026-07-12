import { api } from "@/api/axios";
import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  SessionUser,
} from "@/types/auth";

type AuthMeResponse = SessionUser & {
  hashed_password?: string;
};

export async function registerUser(payload: RegisterInput) {
  const response = await api.post<{ message: string }>("/auth/register", payload);
  return response.data;
}

export async function loginUser(payload: LoginInput) {
  const body = new URLSearchParams();
  body.set("username", payload.email);
  body.set("password", payload.password);

  const response = await api.post<LoginResponse>("/auth/login", body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

export async function getSessionUser() {
  const response = await api.get<AuthMeResponse>("/auth/me");
  const { hashed_password: _hashedPassword, ...user } = response.data;
  return user;
}
