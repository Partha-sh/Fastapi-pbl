export type MyProfile = {
  id: string;
  username: string;
  email: string;
  profile_picture: string | null;
  total_posts: number;
};

export type PublicProfile = {
  username: string;
  profile_picture: string | null;
  total_posts: number;
};

export type UpdateProfileInput = {
  username?: string;
  profile_picture?: string | null;
};
