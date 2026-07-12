import { api } from "@/api/axios";
import type { MyProfile, PublicProfile, UpdateProfileInput } from "@/types/user";

export async function getMyProfile() {
  const response = await api.get<MyProfile>("/users/me");
  return response.data;
}

export async function getUserProfile(username: string) {
  const response = await api.get<PublicProfile>(`/users/${username}`);
  return response.data;
}

export async function updateMyProfile(payload: UpdateProfileInput) {
  const response = await api.put<{
    message: string;
    username: string;
    profile_picture: string | null;
  }>("/users/me", payload);

  return response.data;
}
