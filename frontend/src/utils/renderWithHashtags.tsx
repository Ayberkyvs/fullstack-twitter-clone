import { useQueryClient } from "@tanstack/react-query";

const renderTextWithHashtags = (text: string): (JSX.Element | string)[] => {
    const queryClient = useQueryClient();
    const parts = text.split(/(\s*#[^\s#]+\s*)/g);
    return parts.map((part, index) => {
      if (/^\s*#[^\s#]+\s*$/.test(part)) {
        queryClient.invalidateQueries({ queryKey: ["trending"] });
        return (
          <span key={index} className="text-blue-500">
            {part}
          </span>
        );
      }
      return part;
    });
};

export default renderTextWithHashtags;