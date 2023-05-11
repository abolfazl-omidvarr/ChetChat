import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuthMiddleWare = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authorization = req.headers["authorization"] as string;
		if (!authorization) throw new Error("no token provided");

		const token = authorization.split(" ")[1];
		const payload = jwt.verify(token, process.env.ACCESS_SECRET);

		res.locals.tokenPayload = {
			payload,
			status: "token successfully verified",
		};
	} catch (error) {
		res.locals.tokenPayload = {
			payload: null,
			status: error.message,
		};
	}

	return next();
};
