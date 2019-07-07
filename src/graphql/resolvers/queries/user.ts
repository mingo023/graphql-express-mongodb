import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../../models';
import { IUser } from '../../../models/user-model';
import { AuthenticationError, ForbiddenError } from 'apollo-server-core';

type InputSearchUser = {
  name: string;
  email: string;
};

type InputLogin = {
  email: string;
  password: string;
};

type ResponseLogin = {
  user: IUser;
  token: string;
};

type ContextGraph = {
  user: IUser;
};

export async function userItems(
  _: any,
  { user }: { user: InputSearchUser }
): Promise<IUser[]> {
  try {
    return await User.find(user)
      .populate('events')
      .select('-password')
      .lean();
  } catch (err) {
    throw new Error(err);
  }
}

export async function userLogin(
  _: any,
  { userInput }: { userInput: InputLogin }
): Promise<ResponseLogin> {
  try {
    const user = await User.findOne({ email: userInput.email }).lean();
    if (!user) {
      throw new Error('Email or password is incorrect.');
    }

    const isCorrectPassword = await bcrypt.compare(
      userInput.password,
      user.password
    );
    if (!isCorrectPassword) {
      throw new Error('Email or password is incorrect.');
    }

    delete user.password;
    const token = await jwt.sign(user, process.env.JWT);

    return {
      user,
      token,
    };
  } catch (err) {
    throw new Error(err);
  }
}

export async function userItem(
  _: any,
  { _id }: { _id: string },
  context: ContextGraph
): Promise<IUser> {
  if (!context.user) {
    throw new AuthenticationError('No auth token');
  }

  if (context.user._id !== _id) {
    throw new ForbiddenError('You dont have permisson to access.');
  }

  try {
    return await User.findById(_id).lean();
  } catch (err) {
    throw new Error(err);
  }
}
