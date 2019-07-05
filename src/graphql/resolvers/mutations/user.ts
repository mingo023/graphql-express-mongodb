import bcrypt from 'bcrypt';
import { User } from '../../../models';
import { IUser } from '../../../models/user-model';

type InputUpdateUser = {
  name: string;
  email: string;
};

type InputUser = InputUpdateUser & {
  password: string;
  confirmPassword: string;
};

export async function createUserItem(
  _: any,
  { user }: { user: InputUser }
): Promise<IUser> {
  try {
    const { name, email, password, confirmPassword } = user;

    if (password !== confirmPassword) {
      throw new Error('The password does not match!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await User.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    throw new Error(err);
  }
}

export async function updateUserItem(
  _: any,
  { _id, user }: { _id: IUser['_id']; user: InputUpdateUser }
): Promise<any> {
  try {
    const updatedUser = await User.findByIdAndUpdate(_id, user, {
      new: true,
    })
      .populate('events')
      .select('-password')
      .lean();

    if (!updatedUser) {
      throw new Error('User not found!');
    }

    return updatedUser;
  } catch (err) {
    throw new Error(err);
  }
}
