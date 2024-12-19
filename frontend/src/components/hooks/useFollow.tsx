import { useMutation,useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
    const queryClient = useQueryClient();
    const {mutate:follow, isPending} = useMutation({
        mutationFn: async (userId: string) => {
            try {
                const res = await fetch(`/api/users/follow/${userId}`, {
                    method: 'POST',
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Something went wrong!');
                return data;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: (data) => {
            Promise.all([
                queryClient.invalidateQueries({queryKey: ["suggested"]}),
                queryClient.invalidateQueries({queryKey: ["authUser"]}),
                queryClient.invalidateQueries({queryKey: ["userProfile"]}),
            ]);
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
  return {follow, isPending};
}

export default useFollow