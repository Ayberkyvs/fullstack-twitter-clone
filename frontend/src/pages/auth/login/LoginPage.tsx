import { Link } from "react-router-dom";
import { useState } from "react";

import Logo from "../../../components/svgs/Logo";

import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { SignUpFormType } from "../../../utils/types";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const LoginPage = () => {
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState<Omit<SignUpFormType, "email" | "fullName">>({
		username: "",
		password: "",
	});

	const { mutate:signInMutation, isError, isPending, error } = useMutation({
		mutationFn: async ({ username, password }: Omit<SignUpFormType, "email" | "fullName">) => {
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "An error occurred while signing in");
				return data;
			} catch (error) {
				throw error;
			}
		},
		onSuccess: () => {
			// refetch the Auth user query
			queryClient.invalidateQueries({queryKey: ["authUser"]});
		},
		onError: (error) => {
			console.error(error);
			toast.error(error.message);
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
        signInMutation(formData);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		if (target) {
			setFormData({ ...formData, [target.name]: target.value });
		}
	};

	return (
		<div className='w-full mx-auto flex min-h-screen h-fit p-5 sm:px-10'>
			<div className='flex-1 hidden lg:flex items-center justify-center'>
				<Logo className='lg:w-2/3 fill-base-content' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
                <form className='max-w-full lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <Logo className='w-20 lg:hidden fill-base-content' />
                    <h1 className='text-5xl sm:text-6xl font-extrabold mb-6'>Welcome back to good old <br className="md:hidden"/> Twitter!</h1>
                    <h3 className="text-2xl sm:text-3xl font-extrabold">Sign In.</h3>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <FaUser />
                        <input
                            type='text'
                            className='grow'
                            placeholder='Username'
                            name='username'
                            onChange={handleInputChange}
                            value={formData.username}
                            required
                        />
                    </label>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
                            required
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white' type="submit">
						{isPending ? <LoadingSpinner size="lg" className="text-primary-content"/> : "Sign In"}
					</button>
                    <p className="text-xs text-gray-500">By signing in, you agree to the <span className="text-accent">Terms of Service</span> and <span className="text-accent">Privacy Policy</span>, including <span className="text-accent">Cookie Use.</span></p>
                    {isError && <p className='text-error'>{error.message}</p>}
                    <div className='flex flex-col gap-2 mt-4 w-full'>
                        <p className='text-white text-lg mb-2 font-bold'>Don't have an account?</p>
                        <Link to='/signup'>
                            <button className='btn rounded-full btn-primary text-white btn-outline w-full' type="button">Sign Up</button>
                        </Link>
				    </div>
                </form>

			</div>
		</div>
	);
};
export default LoginPage;