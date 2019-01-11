import { User } from './user.model';

export class Session {
  accessToken: string;
  expiresIn: number;
  user: User;
}
