import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { getMyProfile, getUserProfile } from "@/services/users.service";

export function useMyProfile() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["users", "me"],
    queryFn: getMyProfile,
    enabled: Boolean(token),
  });
}

export function usePublicProfile(username: string, enabled = true) {
  return useQuery({
    queryKey: ["users", username],
    queryFn: () => getUserProfile(username),
    enabled: Boolean(username) && enabled,
  });
}
