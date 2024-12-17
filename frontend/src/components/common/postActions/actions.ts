import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostType, UserType } from "../../../utils/types";
import useFollow from "../../hooks/useFollow";
import toast from "react-hot-toast";

const Actions = () => {
  const queryClient = useQueryClient();
  const { follow, isPending: isFollowPending } = useFollow();

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async (postId: string) => {
      try {
        const res = await fetch(`/api/posts/delete/${postId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.error || "An error occurred while deleting the post."
          );
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      const post = data.post as PostType;
      queryClient.setQueryData(["posts"], (oldData: PostType[]) => {
        if (post.type === "reply") {
          const updatedData = oldData
            .map((p) => {
              if (p._id === post.parentPost?._id) {
                return { ...p, replyCount: p.replyCount - 1 };
              }
              return p;
            })
            .filter((p) => p._id !== post._id);
          toast.success(`You deleted your reply successfully`);
          return updatedData;
        }
        // Eğer type "original" ise, sadece postu sil
        toast.success("You deleted your post successfully");
        return oldData.filter((p) => p._id !== post._id); // Silinen postu listeden çıkar
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

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
            console.log("asdasdadsad");
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

  const { mutate: repost, isPending: isReposting } = useMutation({
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
      const isReposted = authUser?.repostedPosts.includes(postId); //! Typescript Error here but its right bro idk;
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
            console.log("asdasdadsad");
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
      console.log("Response:", res);
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
    follow,
    isFollowPending,
    deletePost,
    isDeleting,
    likePost,
    isLiking,
    repost,
    isReposting,
    copyToClipboard,
  };
}

export default Actions;