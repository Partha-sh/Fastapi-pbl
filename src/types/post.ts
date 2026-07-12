export type FeedPost = {
  id: string;
  caption: string;
  image_url: string;
  created_at: string;
  username: string;
  profile_picture: string | null;
};

export type CreatePostInput = {
  caption: string;
  image: File;
};
