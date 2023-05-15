import Jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { Response } from "express";

export const createAccessToken = (user: User) =>
	Jwt.sign({ userId: user.id }, process.env.ACCESS_SECRET!, {
		expiresIn: "3s",
	});

export const createRefreshToken = (user: User) =>
	Jwt.sign(
		{ userId: user.id, tokenVersion: user.tokenVersion },
		process.env.REFRESH_SECRET!,
		{
			expiresIn: "7d",
		}
	);

export const sendRefreshToken = (res: Response, token: string) => {
	res.cookie("jid", token, {
		httpOnly: true,
	});
};
