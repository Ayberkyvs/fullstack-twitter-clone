import React from "react";
import { UserType } from "../../utils/types";
import useUpdateUserProfile from "../hooks/useUpdateUserProfile";
import LoadingSpinner from "../common/LoadingSpinner";


const EditProfileModal = ({authUser} :{authUser: UserType}) => {
	if (!authUser) return null;

	const [formData, setFormData] = React.useState({
		fullName: authUser.fullName,
		username: authUser.username,
		email: authUser.email,
		bio: authUser.bio,
		link: authUser.link,
		newPassword: "",
		currentPassword: "",
	});
	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();
	
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => (document.getElementById("edit_profile_modal") as HTMLDialogElement)?.showModal()}
				type="button"
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-base-content/10 shadow-md p-4'>
					<h3 className='font-bold text-lg mb-3'>Update Profile</h3>
					<form
						className='flex flex-col w-full gap-4 border'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-base-content/10 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-base-content/10 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-base-content/10 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 textarea textarea-md w-full max-w-x border border-base-content/10 rounded p-2 min-w-[209px]'
								value={formData.bio ?? ""}
								name='bio'
								onChange={handleInputChange}
                                maxLength={150}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-base-content/10 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-base-content/10 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-base-content/10 rounded p-2 input-md'
							value={formData?.link ?? ""}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-md' type="submit">
							{isUpdatingProfile ? <LoadingSpinner size="lg"/> : "Update"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none' type="submit">close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;