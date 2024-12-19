import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostType, UserType } from "../../../utils/types";
import toast from "react-hot-toast";

const Actions = () => {
  const queryClient = useQueryClient();

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async ({postId}: {postId:string}) => {
      try {
        const res = await fetch(`/api/posts/like/${postId}`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "An error occurred while liking post.");
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onMutate: async ({postId, setIsLiked}: {postId:string, setIsLiked: any}) => {
      const authUser = queryClient.getQueryData<UserType>(["authUser"]);
      const isLiked = authUser?.likedPosts.includes(postId)

      setIsLiked((prev: boolean)=> !prev);

      // Optimistic Update
      await queryClient.cancelQueries();

      queryClient.setQueryData(["posts"], (oldPosts: PostType[]) => {
        if (!oldPosts) return;
        return oldPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likeCount: post.likeCount + (isLiked ? -1 : 1),
            };
          }
          return post;
        });
      });

      queryClient.setQueryData(["posts", postId], (oldPost: PostType) => {
        if (!oldPost) return;
        return { ...oldPost, likeCount: oldPost.likeCount + (isLiked ? -1 : 1)};
      });

      queryClient.setQueryData(["posts", "replies"], (oldPosts: PostType[]) => {
        if (!oldPosts) return;
        return oldPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likeCount: post.likeCount + (isLiked ? -1 : 1),
            };
          }
          return post;
        });
      });

    },
    onSuccess: (res) => {
      // Sunucudan gelen başarı durumunda, cache'i güncelle
      queryClient.setQueryData(["posts"], (oldPosts: PostType[]) => {
        if (!oldPosts) return;
        return oldPosts.map((post) =>
          post._id === res._id ? { ...post, likeCount: res.likeCount, likes: res.likes } : post
        );
      });

      queryClient.setQueryData(["posts", res._id], (oldPost: PostType) => {
        if (!oldPost) return;
        return { ...oldPost, likeCount: res.likeCount, likes: res.likes };
      });

      queryClient.setQueryData(["posts", "replies"], (oldPosts: PostType[]) => {
        if (!oldPosts) return;
        return oldPosts.map((post) =>
          post._id === res._id ? { ...post, likeCount: res.likeCount, likes: res.likes } : post
        );
      });

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
      queryClient.invalidateQueries();
    },
  });

  const { mutate: repost, isPending: isReposting, } = useMutation({
    mutationFn: async ({postId}: {postId: string}) => {
      try {
        const res = await fetch(`/api/posts/repost/${postId}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "An error occurred while reposting.");
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onMutate: async ({
      postId,
      setIsReposted,
    }: {
      postId: string;
      setIsReposted: any;
    }) => {
      const authUser = queryClient.getQueryData<UserType>(["authUser"]);
      const isReposted = authUser?.repostedPosts.includes(postId as any) ?? false
      setIsReposted((prev: boolean) => !prev);
      // Optimistic Update
      await queryClient.cancelQueries();

      queryClient.setQueryData(["posts"], (oldPosts: PostType[]) => {
        if (!oldPosts) return;
        return oldPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              repostCount: post.repostCount + (isReposted ? -1 : 1),
            };
          }
          return post;
        });
      });

      queryClient.setQueryData(["posts", postId], (oldPost: PostType) => {
        if (!oldPost) return;
        return {
          ...oldPost,
          repostCount: oldPost.repostCount + (isReposted ? -1 : 1),
        };
      });

      queryClient.setQueryData(["posts", "replies"], (oldPosts: PostType[]) => {
        if (!oldPosts) return;
        return oldPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              repostCount: post.repostCount + (isReposted ? -1 : 1),
            };
          }
          return post;
        });
      });
    },
    onSuccess: (res) => {
      // Sunucudan gelen başarı durumunda, cache'i güncelle
      queryClient.setQueryData(["posts"], (oldPosts: PostType[]) => {
        if (!oldPosts) return;
        return oldPosts.map((post) =>
          post._id === res._id
            ? { ...post, repostCount: res.repostCount}
            : post
        );
      });

      queryClient.setQueryData(["posts", res._id], (oldPost: PostType) => {
        if (!oldPost) return;
        return { ...oldPost, repostCount: res.repostCount};
      });

      queryClient.setQueryData(["posts", "replies"], (oldPosts: PostType[]) => {
        if (!oldPosts) return;
        return oldPosts.map((post) =>
          post._id === res._id
            ? { ...post, repostCount: res.repostCount}
            : post
        );
      });

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
      queryClient.invalidateQueries();
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link to clipboard!");
      });
  };

  return {
    likePost,
    isLiking,
    repost,
    isReposting,
    copyToClipboard,
  };
}

export default Actions;