import jwt from 'jsonwebtoken';

export default async (token: string) => {
  try {
    if (!token) {
      return null;
    }

    const isValidToken = token.indexOf('Bearer') === 0;
    if (!isValidToken) {
      return null;
    }

    const pureToken = token.split(' ')[1];
    const user = await jwt.verify(pureToken, process.env.JWT);

    return user || null;
  } catch (err) {
    return null;
  }
};
