const PostSkeleton = ({ image = true }: { image?: boolean }) => {
  return (
    <div className="flex w-full h-fit p-[15px] items-start gap-3 border-b border-base-content/10">
      {/* Avatar Skeleton */}
      <div className="skeleton min-w-10 h-10 rounded-full"></div>

      {/* Content Skeleton */}
      <div className="flex flex-col w-full gap-2">
        {/* Header Skeleton */}
        <div className="grid grid-rows-2 grid-cols-1 xs:grid-rows-none xs:grid-cols-[auto_1fr] gap-2 items-center">
          <div className="flex w-fit h-fit justify-center items-start gap-[4px] text-base font-bold">
            <div className="skeleton w-24 h-4 rounded-full"></div>
          </div>
          <div className="flex w-full h-fit justify-between items-center text-neutral">
            <div className="skeleton w-36 h-3 rounded-full"></div>
          </div>
        </div>

        {/* Text Skeleton */}
        <div className="skeleton w-full h-3 rounded"></div>
        <div className="skeleton w-3/4 h-3 rounded"></div>

        {/* Image Skeleton */}
        {image && (
          <div className="w-full h-fit">
            <div className="skeleton w-full h-[300px] max-h-[500px] rounded border border-neutral/30"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostSkeleton;
