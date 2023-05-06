"use client";
import React, { useCallback } from "react";
import { Button, Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CreateUserVariable, CreateUsernameData } from "@/util/types";
import userOperations from "@/graphql/operations/user";
import { toast } from "react-hot-toast";

interface LogInProps {
	login: boolean;
	setLogin: (state: boolean) => void;
}

const LogIn: React.FC<LogInProps> = ({ login, setLogin }) => {
	const {
		register,
		handleSubmit,
		formState: { errors: errors },
	} = useForm<FieldValues>({
		defaultValues: { userMail: "", password: "" },
	});

	const onSubmit: SubmitHandler<FieldValues> = useCallback(async (inputs) => {
		signIn("credentials", {
			...inputs,
			redirect: false,
		}).then((callback) => {
			if (callback?.ok) {
				toast.success("Logged in");
			}
			if (callback?.error) {
				toast.error(callback.error);
			}
		});
	}, []);

	const inputClass = (id: string) => `
	peer
	w-full
	p-2
	font-light
	bg-black/30
	border-2
	rounded-md
	outline-none
	transition
	disabled:opacity-70
	disabled:cursor-not-allowed
	${
		errors[id]
			? "border-rose-500 focus:border-rose-500"
			: "border-neutral-600 focus:border-neutral-400"
	}
`;

	return (
		<>
			<Text className="text-3xl">ChetChat Messenger</Text>
			<Text className="text-lg pb-2">Log in to your account</Text>

			<input
				id="userMail"
				type="text"
				{...register("userMail", { required: true })}
				placeholder="Email or Username"
				className={inputClass("userMail")}
			/>
			<input
				id="password"
				type="password"
				{...register("password", { required: true })}
				placeholder="Password"
				className={inputClass("password")}
			/>
			<Button onClick={() => handleSubmit(onSubmit)()}>Log In</Button>

			<Text className="text-sm py-2">
				Don't have an account?
				<span
					onClick={() => setLogin(false)}
					className="hover:underline ml-1 cursor-pointer"
				>
					Sign Up
				</span>
			</Text>
		</>
	);
};

export default LogIn;
