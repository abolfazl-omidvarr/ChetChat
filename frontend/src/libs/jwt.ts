import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

interface signOption {
	expiresIn: string | number;
}
const DEFAULT_SIGN_OPTION: SignOptions = {
	expiresIn: "1h",
};

export function signJWTAccessToken(
	payload: JwtPayload,
	option: SignOptions = DEFAULT_SIGN_OPTION
) {
	const secretKey = process.env.SECRET_KEY;
	const token = jwt.sign(payload, secretKey!, option);

	return token;
}

export function verifyJWTAccessToken(token: string) {
	try {
		const secretKey = process.env.SECRET_KEY;
		const decoded = jwt.verify(token, secretKey!);
		return decoded as JwtPayload;
	} catch (error) {
		console.log(error);
		return null;
	}
}
