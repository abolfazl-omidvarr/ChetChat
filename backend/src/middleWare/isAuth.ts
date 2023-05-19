import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Payload } from '../util/types';

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
      status: error.message as string,
      code: 401,
    };
  }

  return next();
};

export const isAuthSubscription = (accessToken: string) => {
  try {
    if (!accessToken) throw new Error('no token provided');

    const payload = jwt.verify(
      accessToken,
      process.env.ACCESS_SECRET!
    ) as Payload;

    return {
      payload,
      status: 'token successfully verified',
      code: 200,
    };
  } catch (error: any) {
    return {
      payload: null,
      status: error.message,
      code: 401,
    };
  }
};
