import { api } from "@/api/axios";
import type { CreatePostInput, FeedPost } from "@/types/post";

export async function getPosts(page = 1, limit = 10) {
  const response = await api.get<FeedPost[]>("/posts/", {
    params: { page, limit },
  });

  return response.data;
}

export async function getPost(postId: string) {
  const response = await api.get<FeedPost>(`/posts/${postId}`);
  return response.data;
}

export async function createPost(payload: CreatePostInput) {
  const formData = new FormData();
  formData.set("caption", payload.caption);
  formData.set("image", payload.image);

  const response = await api.post("/posts/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function deletePost(postId: string) {
  const response = await api.delete<{ success: boolean; message: string }>(
    `/posts/${postId}`,
  );

  return response.data;
}

export async function getPostsByUsername(username: string, expectedCount = 0) {
  const pageSize = 50;
  const collected: FeedPost[] = [];
  let page = 1;

  while (page <= 100) {
    const pageItems = await getPosts(page, pageSize);
    const matches = pageItems.filter((post) => post.username === username);
    collected.push(...matches);

    if (pageItems.length < pageSize) {
      break;
    }

    if (expectedCount > 0 && collected.length >= expectedCount) {
      break;
    }

    page += 1;
  }

  return collected;
}
