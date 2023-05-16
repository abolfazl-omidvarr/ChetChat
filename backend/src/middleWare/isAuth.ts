import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const isAuthMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers['authorization'] as string;
    if (!authorization) throw new Error('no token provided');

    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.ACCESS_SECRET!);

    res.locals.tokenPayload = {
      payload,
      status: 'token successfully verified',
      code: 200,
    };
  } catch (error: any) {
    res.locals.tokenPayload = {
      payload: null,
      status: error.message,
      code: 401,
    };
  }

  return next();
};
