"use client";
import React, { useCallback, useState } from "react";
import { Button, Text, Box } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { FcGoogle, FcSalesPerformance } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CreateUserVariable, CreateUserData } from "@/util/types";
import userOperations from "@/graphql/operations/user";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AccountCreateProps {}

const AccountCreate: React.FC<AccountCreateProps> = () => {
	const router = useRouter();
	const [login, setLogin] = useState(false);
	const [createUser, { loading, data, error }] = useMutation<
		CreateUserData,
		CreateUserVariable
	>(userOperations.Mutations.createUser);
	//handle form for create account
	const {
		register: registerCreateAccountForm,
		handleSubmit: handleSubmitCreateAccountForm,
		formState: { errors: errorCreateAccountForm },
	} = useForm<FieldValues>({
		defaultValues: { username: "", emailForCreate: "", passwordForCreate: "" },
	});

	//handle form form Log in
	const {
		register: registerLogInForm,
		handleSubmit: handleSubmitLogInForm,
		formState: { errors: errorLogInForm },
	} = useForm<FieldValues>({
		defaultValues: { userMail: "", passwordForLogin: "" },
	});

	const onCreateAccountSubmit: SubmitHandler<FieldValues> = useCallback(
		async (inputs) => {
			const { username, passwordForCreate, emailForCreate } = inputs;
			const { data } = await createUser({
				variables: {
					username,
					password: passwordForCreate,
					email: emailForCreate,
				},
			});

			if (!data?.createUser) {
				return toast.error("Oops, something is not quite alright");
			}
			if (data?.createUser.error) {
				return toast.error(data?.createUser?.error);
			}
			if (data?.createUser.success) {
				setLogin(true);
				toast.success("Account successfully created  🚀\nNow you may log in");
			}
		},
		[]
	);
	const onLogInSubmit: SubmitHandler<FieldValues> = useCallback(
		async (inputs) => {
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
		},
		[]
	);

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
		errorLogInForm[id] || errorCreateAccountForm[id]
			? "border-rose-500 focus:border-rose-500"
			: "border-neutral-600 focus:border-neutral-400"
	}
`;

	const createForm = (
		<>
			<Text className="text-3xl">ChetChat Messenger</Text>
			<Text className="text-xl">Create an account</Text>
			<input
				id="email"
				{...registerCreateAccountForm("emailForCreate", { required: true })}
				placeholder="Email"
				className={inputClass("emailForCreate")}
			/>
			<input
				id="username"
				{...registerCreateAccountForm("username", { required: true })}
				placeholder="Username"
				className={inputClass("username")}
			/>
			<input
				id="password"
				{...registerCreateAccountForm("passwordForCreate", { required: true })}
				placeholder="Password"
				className={inputClass("passwordForCreate")}
			/>
			<Button
				onClick={() => handleSubmitCreateAccountForm(onCreateAccountSubmit)()}
			>
				Create
			</Button>
			<Text className="text-4xl py-2">OR</Text>
			<Button
				onClick={() => signIn("google")}
				leftIcon={<FcGoogle size={25} />}
			>
				Continue with Google
			</Button>
			<Text className="text-sm py-2">
				Already have an account?
				<span
					onClick={() => setLogin(true)}
					className="hover:underline ml-1 cursor-pointer"
				>
					Log in
				</span>
			</Text>
		</>
	);

	const loginForm = (
		<>
			<Text className="text-3xl">ChetChat Messenger</Text>
			<Text className="text-lg pb-2">Log in to your account</Text>

			<input
				id="userMail"
				{...registerLogInForm("userMail", { required: true })}
				placeholder="Email or Username"
				className={inputClass("userMail")}
			/>
			<input
				id="password"
				{...registerLogInForm("passwordForLogin", { required: true })}
				placeholder="Password"
				className={inputClass("passwordForLogin")}
			/>
			<Button onClick={() => handleSubmitLogInForm(onLogInSubmit)()}>
				Log In
			</Button>

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

	return <>{login ? loginForm : createForm}</>;
};

export default AccountCreate;
