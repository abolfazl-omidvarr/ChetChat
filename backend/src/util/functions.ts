import Jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { Response } from 'express';
import { ParticipantPopulated } from './types';

export const createAccessToken = (user: User) =>
  Jwt.sign({ userId: user.id }, process.env.ACCESS_SECRET!, {
    expiresIn: '15m',
  });

export const createRefreshToken = (user: User) =>
  Jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_SECRET!,
    {
      expiresIn: '7d',
    }
  );

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('jid', token, {
    httpOnly: true,
  });
};

export const userIsConversationParticipant = (
  participants: Array<ParticipantPopulated>,
  userId: string
): boolean => {
  return participants.some((participant) => participant.id === userId);
};
