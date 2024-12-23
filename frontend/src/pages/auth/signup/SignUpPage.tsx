import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Logo from "../../../components/svgs/Logo";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SignUpFormType } from "../../../utils/types";
import { motion } from "framer-motion";
const SignUpPage = () => {
  const navigate = useNavigate();
  const [read, setRead] = useState(false);
  const [formData, setFormData] = useState<SignUpFormType>({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });
  const {
    mutate: signUpMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({
      email,
      username,
      fullName,
      password,
    }: SignUpFormType) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password }),
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "An error occurred while signing up");
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Signed up successfully");
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUpMutation(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target) {
      setFormData({ ...formData, [target.name]: target.value });
    }
  };
  if (!read) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Logo className="absolute w-full fill-base-content opacity-20 stroke-2 stroke-base-200 shadow-xl" />
        <motion.div
        initial={{ opacity: 0, scale: 0}}
        animate={{ opacity: 1, scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5 }}
        className="flex flex-col bg-base-200 p-4 rounded-lg gap-5 m-5 max-w-md z-[1] shadow-lg">
          <Logo className="w-12 fill-base-content" />
          <h1 className="text-3xl xs:text-4xl font-extrabold">Announcement!</h1>
          <p className="leading-relax text-base">
            <span className="text-error">
              Account deletion is currently unavailable.
            </span>{" "}
            By signing up, you acknowledge and accept this limitation. If you wish to request data deletion, please contact us directly.<br />
            <a
              href="mailto:contact@ayberkyavas.com"
              className="link link-primary"
              target="_blank"
            >
              contact@ayberkyavas.com
            </a>
          </p>
          <button
            className="btn btn-primary w-fit place-self-end"
            type="button"
            onClick={() => setRead(true)}
          >
            I read, go on.
          </button>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="w-full mx-auto flex min-h-screen h-fit p-5 sm:px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <Logo className="lg:w-2/3 fill-base-content" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="max-w-full lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <Logo className="w-20 lg:hidden fill-base-content" />
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6">
            What is happening?!
          </h1>
          <h3 className="text-2xl sm:text-3xl font-extrabold">Join Today.</h3>
          <label
            className={"input input-bordered rounded flex items-center gap-2"}
          >
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
              required
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
                required
              />
            </label>
          </div>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              required
            />
          </label>
          <button
            className="btn rounded-full btn-primary text-white"
            type="submit"
          >
            {isPending ? "Loading..." : "Sign up"}
          </button>
          <p className="text-xs text-gray-500">
            By signing up, you agree to the{" "}
            <span className="text-accent">Terms of Service</span> and{" "}
            <span className="text-accent">Privacy Policy</span>, including{" "}
            <span className="text-accent">Cookie Use.</span>
          </p>
          {isError && <p className="text-error">{error.message}</p>}
          <div className="flex flex-col gap-2 mt-4 w-full">
            <p className="text-white text-lg mb-2 font-bold">
              Already have an account?
            </p>
            <Link to="/login">
              <button
                className="btn rounded-full btn-primary text-white btn-outline w-full"
                type="button"
              >
                Sign in
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUpPage;
