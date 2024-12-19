import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { GoImage } from "react-icons/go";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PostType, UserType } from "../../utils/types";
import Avatar from "../../components/common/Avatar";

const CreatePost = ({
  className,
  type = "original",
  parentPostId,
  showAvatar,
  modalName,
}: {
  className: string;
  type: "original" | "reply";
  parentPostId?: string;
  showAvatar: boolean;
  modalName?: string;
}) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState<string | ArrayBuffer | null>(null);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({
      text,
      img,
      type,
      parentPostId,
    }: {
      text: string;
      img: string | ArrayBuffer | null;
      type: string;
      parentPostId?: string;
    }) => {
      try {
        let requestBody: Record<string, any> = { text, img, type };
        if (type === "reply" && parentPostId) {
          requestBody.parentPostId = parentPostId;
        }
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.message || "An error occurred while creating the post."
          );
        return data;
      } catch (error) {
        throw error;
      }
    },
    // onMutate: async ({ text, img, type, parentPostId}) => {
    //   const post = {
    //     _id: Date.now().toString(),
    //     text,
    //     img: img ? (img as string) : undefined,
    //     type: type as "original" | "reply" | "repost",
    //     parentPost: parentPostId ? ({ _id: parentPostId } as PostType) : undefined,
    //     user: authUser as UserType,
    //     likes: [{}],
    //     replyCount: 0,
    //     likeCount: 0,
    //     repostCount: 0,
    //     createdAt: new Date().toISOString(),
    //   }

    //   await queryClient.cancelQueries();

    //   const updateReplyCount = (oldData: PostType[]) => {
    //     if (!oldData) return oldData;
    //     return oldData
    //       ?.map((p) =>
    //         p._id === parentPostId ? { ...p, replyCount: p.replyCount + 1 } : p
    //       )
    //       .push(post);
    //   };

    //   queryClient.setQueryData(["posts", "replies"], (oldData: PostType[]) => {
    //     if (post.type === "reply") {
    //       return updateReplyCount(oldData);
    //     }
    //     return oldData;
    //   });

    //   queryClient.setQueryData(["posts"], (oldData: PostType[]) => {
    //     if (post.type === "reply") {
    //       return updateReplyCount(oldData);
    //     }
    //     if (!oldData) return oldData;
    //     return oldData.push(post);
    //   });

    //   queryClient.setQueryData(["posts", parentPostId], (oldData: PostType) => {
    //     if (!oldData) return oldData;
    //     return {
    //       ...oldData,
    //       replyCount: oldData.replyCount + 1,
    //     };
    //   });
    // },
    onSuccess: (data) => {
      const updateReplyCount = (oldData: PostType[]) => {
        if (!oldData) return oldData;
        const updatedData = oldData?.map((p) =>
          p._id === data.parentPost?._id
            ? { ...p, replyCount: data.parentPost.replyCount }
            : p
        );
        return [data, ...updatedData];
      };

      queryClient.setQueryData(["posts", "replies"], (oldData: PostType[]) => {
        if (data.type === "reply") {
          return updateReplyCount(oldData);
        }
        return oldData;
      });

      queryClient.setQueryData(["posts"], (oldData: PostType[]) => {
        if (data.type === "reply") {
          return updateReplyCount(oldData);
        }
        if (!oldData) return oldData;
        return [data, ...oldData];
      });

      queryClient.setQueryData(["posts", parentPostId], (oldData: PostType) => {
        if (!oldData) return;
        return {
          ...oldData,
          replyCount: data?.parentPost?.replyCount,
        };
      });

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      if (data.type === "reply") {
        toast.success("You replied successfully");
      } else if (data.type === "original") {
        toast.success("You posted successfully");
      } else {
        toast.success("You did something successfully");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred.");
      const queriesToInvalidate = [
        ["authUser"],
        ["posts"],
        ["posts", "replies"],
      ];
      queriesToInvalidate.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    onSettled: () => {
      setText("");
      setImg(null);
      modalName &&
        (document.getElementById(modalName) as HTMLDialogElement).close();
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if ((!text && !img) || (text && text.trim() === "" && !img)) {
      toast.error("Please write something or upload an image to post.");
    } else if (isPending) {
      toast.loading("Posting...", { duration: 1500 });
    } else {
      createPost({ text, img, type, parentPostId });
    }
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const textLength = text.length;
  return (
    <div
      className={`flex w-full h-fit min-h-[150px] p-4 items-start gap-4 ${className}`}
    >
      {showAvatar && <Avatar user={authUser} className="w-12" />}
      <form
        className="flex flex-col gap-2 w-full h-full"
        onSubmit={handleSubmit}
      >
        <div className="relative flex w-full">
          <textarea
            className="textarea w-full h-[60px] p-0 text-base resize-none border-none focus:outline-none placeholder:text-neutral rounded-none"
            placeholder={
              type === "reply" ? "Write your reply..." : "What is happening?!"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {text && (
            <p className="absolute text-neutral text-sm right-1 bottom-0">
              <span
                className={`${
                  textLength > 250 ? "text-error" : "text-neutral"
                }`}
              >
                {textLength > 250 ? `-${textLength - 250}` : textLength}
              </span>{" "}
              / 250
            </p>
          )}
        </div>
        {img && (
          <div className="relative mx-auto w-full h-fit object-cover">
            <IoCloseSharp
              className="absolute top-2 right-2 bg-base-100 rounded-full w-6 h-6 cursor-pointer"
              onClick={() => {
                setImg(null);
                if (imgRef.current) {
                  (imgRef.current as HTMLInputElement).value = "";
                }
              }}
            />
            <img
              src={img as string}
              alt="Uploaded content"
              className="w-fit max-w-full mx-auto max-h-[418px] object-fit rounded"
            />
          </div>
        )}

        <div
          className={`flex justify-between py-2 ${
            text || img !== null ? "border-t border-t-base-content/10" : ""
          }`}
        >
          <div className="flex gap-2 items-center">
            <GoImage
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => {
                if (imgRef.current) {
                  (imgRef.current as HTMLInputElement).click();
                }
              }}
            />
            {/* <FaRegSmile className="fill-primary w-5 h-5 cursor-pointer" /> */}
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button
            className="btn btn-primary rounded-full btn-sm px-4"
            type="submit"
            onClick={handleSubmit}
            disabled={isPending || textLength > 250}
          >
            {isPending ? "Posting..." : type === "reply" ? "Reply" : "Post"}
          </button>
        </div>
        {isError && <div className="text-error">{error?.message}</div>}
      </form>
    </div>
  );
};

export default CreatePost;
