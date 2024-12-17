import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostType } from "./types";
import useFollow from "../components/hooks/useFollow";
import toast from "react-hot-toast";

const postActions = () => {
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
    mutationFn: async (postId: string) => {
      try {
        const res = await fetch(`/api/posts/like/${postId}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "An error occurred while liking post.");
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: (res, postId) => {
      const updatedLikeCount = res.updatedLikeCount;
      const updatedLikes = res.updatedLikes;
      queryClient.setQueryData(["posts"], (oldData: PostType[]) => {
        return oldData.map((p) => {
          if (p._id === postId) {
            return { ...p, likes: updatedLikes, likeCount: updatedLikeCount };
          }
          return p;
        });
      });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const { mutate: repost, isPending: isReposting } = useMutation({
    mutationFn: async (postId: string) => {
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
    onSuccess: (res, postId) => {
      queryClient.setQueryData(["posts"], (oldData: PostType[]) => {
        return oldData.map((p) => {
          if (p._id === postId) {
            return { ...p, repostCount: res.updatedRepostCount };
          }
          return p;
        });
      });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
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

export default postActions;