import Jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export const createAccessToken = (user: User) =>
	Jwt.sign({ userId: user.id }, process.env.ACCESS_SECRET, {
		expiresIn: "15m",
	});

export const createRefreshToken = (user: User) =>
	Jwt.sign({ userId: user.id }, process.env.REFRESH_SECRET, {
		expiresIn: "7d",
	});
