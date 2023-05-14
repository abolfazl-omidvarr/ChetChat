import qs from "query-string";

const getGoogleOAuthURL = () => {
	const rootUrl = "http://accounts.google.com/o/oauth2/v2/auth";

	const options = {
		redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL!,
		client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		].join(" "),
	};

	console.log(options);

	const query = qs.stringify(options);

	console.log(query);

	return `${rootUrl}?${query}`;
};

export default getGoogleOAuthURL;
