"use client";
import React, { useCallback } from "react";
import { Button, Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CreateUserVariable, CreateUsernameData } from "@/util/types";
import userOperations from "@/graphql/operations/user";

type LogInProps = {};

const LogIn: React.FC<LogInProps> = () => {

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: { username: "", email: "", password: "" },
	});

	// const onSubmit: SubmitHandler<FieldValues> = (data) => {
	// 	setIsLoading(true);

	// 	signIn("credentials", {
	// 		...data,
	// 		redirect: false,
	// 	}).then((callback) => {
	// 		setIsLoading(false);

	// 		if (callback?.ok) {
	// 			toast.success("Logged in");
	// 			router.refresh();
	// 			loginModal.onClose();
	// 		}
	// 		if (callback?.error) {
	// 			toast.error(callback.error);
	// 		}
	// 	});
	// };

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
			<Text className="text-xl">Create an account</Text>
			<input
				id="email"
				{...register("email", { required: true })}
				placeholder="Email"
				className={inputClass("email")}
			/>
			<input
				id="username"
				{...register("username", { required: true })}
				placeholder="Username"
				className={inputClass("username")}
			/>
			{/* <Button onClick={() => handleSubmit(onsubmit)()}>Create</Button>
			<Text className="text-4xl py-5">OR</Text>
			<Button
				onClick={() => signIn("google")}
				leftIcon={<FcGoogle size={25} />}
			>
				Continue with Google
			</Button> */}
		</>
	);
};

export default LogIn;
