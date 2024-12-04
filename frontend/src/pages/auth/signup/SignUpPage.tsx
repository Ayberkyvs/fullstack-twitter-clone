import { Link } from "react-router-dom";
import { useState } from "react";

import Logo from "../../../components/svgs/Logo";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
        console.log(formData)
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		if (target) {
			setFormData({ ...formData, [target.name]: target.value });
		}
	};
    let isError = false;
	return (
		<div className='w-full mx-auto flex min-h-screen h-fit p-5 sm:px-10 border'>
			<div className='flex-1 hidden lg:flex items-center justify-center'>
				<Logo className='lg:w-2/3 fill-base-content' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
                <form className='max-w-full lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<Logo className='w-20 lg:hidden fill-base-content' />
                    <h1 className='text-5xl sm:text-6xl font-extrabold mb-6'>What is happening?!</h1>
                    <h3 className="text-2xl sm:text-3xl font-extrabold">Join Today.</h3>
                    <label className={'input input-bordered rounded flex items-center gap-2'}>
                        <MdOutlineMail />
                        <input
                            type='email'
                            className='grow'
                            placeholder='Email'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                            required
                        />
                    </label>
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
                                required
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullName'
								onChange={handleInputChange}
								value={formData.fullName}
                                required
							/>
						</label>
					</div>
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
						Sign up
					</button>
                    <p className="text-xs text-gray-500">By signing up, you agree to the <span className="text-accent">Terms of Service</span> and <span className="text-accent">Privacy Policy</span>, including <span className="text-accent">Cookie Use.</span></p>
                    {isError && <p className='text-error'>Sorry, something went wrong.</p>}
                    <div className='flex flex-col gap-2 mt-4 w-full'>
                        <p className='text-white text-lg mb-2 font-bold'>Already have an account?</p>
                        <Link to='/login'>
                            <button className='btn rounded-full btn-primary text-white btn-outline w-full' type="button">Sign in</button>
                        </Link>
				    </div>
                </form>

			</div>
		</div>
	);
};
export default SignUpPage;