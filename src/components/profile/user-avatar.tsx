import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/format";

type UserAvatarProps = {
  username: string;
  profilePicture?: string | null;
  className?: string;
};

export function UserAvatar({
  username,
  profilePicture,
  className,
}: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage alt={username} src={profilePicture ?? undefined} />
      <AvatarFallback>{getInitials(username)}</AvatarFallback>
    </Avatar>
  );
}
