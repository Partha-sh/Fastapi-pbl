import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/api/query-client";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getPostsByUsername,
} from "@/services/posts.service";

const FEED_PAGE_SIZE = 10;

export function useFeedPosts() {
  return useInfiniteQuery({
    queryKey: ["posts", "feed"],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam, FEED_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === FEED_PAGE_SIZE ? lastPageParam + 1 : undefined,
  });
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getPost(postId),
    enabled: Boolean(postId),
  });
}

export function useUserPosts(username: string, expectedCount = 0) {
  return useQuery({
    queryKey: ["posts", "by-user", username, expectedCount],
    queryFn: () => getPostsByUsername(username, expectedCount),
    enabled: Boolean(username),
  });
}

export function useCreatePostMutation() {
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });
}

export function useDeletePostMutation() {
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
