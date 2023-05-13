import { create } from "zustand";

interface UseAuthenticatedStore {
	authenticated: boolean;
	accessToken: string;
	userId: string;
	onAuthentication: (at: string, userId: string) => void;
	onLogOut: () => void;
}

const useAuthenticated = create<UseAuthenticatedStore>((set, get) => ({
	authenticated: false,
	accessToken: "",
	userId: "",

	onAuthentication: (at, userId) => {
		set({ authenticated: true, accessToken: at, userId });
	},
	onLogOut: () => {
		set({ authenticated: false, accessToken: "", userId: "" });
	},
}));

export default useAuthenticated;
