import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuthMiddleWare = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authorization = req.headers["authorization"] as string;
	if (!authorization) res.locals.tokenPayload = null;

	try {
		const token = authorization.split(" ")[1];
		const payload = jwt.verify(token, process.env.ACCESS_SECRET);
		res.locals.tokenPayload = { payload, status: "successfully verified" };
	} catch (error) {
		console.log(error);
		res.locals.tokenPayload = {
			payload: null,
			status: "bad token",
		};
	}

	return next();
};
