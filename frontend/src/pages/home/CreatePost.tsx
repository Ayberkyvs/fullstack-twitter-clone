import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegSmile } from "react-icons/fa";
import { GoImage } from "react-icons/go";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CreatePost = ({ className }: { className: string }) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState<string | ArrayBuffer | null>(null);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { mutate: createPost, isError, isPending, error } = useMutation({
    mutationFn: async ({ text, img }: { text: string; img: string | ArrayBuffer | null }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "An error occurred while creating the post.");
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      setText("");
      setImg(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPost({ text, img });
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

  return (
    <div className={`h-fit min-h-[150px] p-4 items-start gap-4 border-b border-base-content/10 ${className}`}>
      <div className="avatar z-[0]">
        <div className="w-12 rounded-full">
          {/* authUser varsa resim ve isim render edilir */}
          <img
            src={authUser?.profileImg || "/avatar-placeholder.png"}
            alt={`${authUser?.fullName || "User"} profile picture`}
          />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full h-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full h-[60px] p-0 text-base resize-none border-none focus:outline-none placeholder:text-neutral"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
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
            <img src={img as string} alt="Uploaded content" className="w-fit max-w-full mx-auto max-h-[418px] object-fit rounded" />
          </div>
        )}

        <div className={`flex justify-between py-2 ${text || img !== null ? "border-t border-t-base-content/10" : ""}`}>
          <div className="flex gap-2 items-center">
            <GoImage
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => {
                if (imgRef.current) {
                  (imgRef.current as HTMLInputElement).click();
                }
              }}
            />
            <FaRegSmile className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input type="file" accept="image/*" hidden ref={imgRef} onChange={handleImgChange} />
          <button className="btn btn-primary rounded-full btn-sm px-4" type="submit">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-error">{error?.message}</div>}
      </form>
    </div>
  );
};

export default CreatePost;
